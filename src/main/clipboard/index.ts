import { clipboard } from 'electron'
import { SETTING } from '../config/app.config'
import { createHash } from 'crypto'
import { Logger } from '../services/logger.service'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import sendRenderer from '../services/ipc.service'
import { DBManager } from '../database/database.manager'

/**
 * 剪贴板管理器类
 * @class ClipboardManager
 */
export class ClipboardManager {
    private static instance: ClipboardManager
    private lastState: ClipboardState
    private execAsync: any
    private intervalId: NodeJS.Timeout | null

    private constructor() {
        this.execAsync = promisify(exec)
        this.intervalId = null
        this.lastState = {
            type: 'text',
            timestamp: 0,
            contentHash: '',
            last_file_name_text: '',
            content: '',
            meta: {},
        }
    }

    /**
     * 获取ClipboardManager单例
     * @returns {ClipboardManager} ClipboardManager实例
     */
    public static getInstance(): ClipboardManager {
        if (!ClipboardManager.instance) {
            ClipboardManager.instance = new ClipboardManager()
        }
        return ClipboardManager.instance
    }

    /**
     * 开始监听剪贴板
     */
    public startListening(): void {
        if (this.intervalId) return

        this.intervalId = setInterval(async () => {
            await this.handleClipboardChange()
        }, 1500)
    }

    /**
     * 停止监听剪贴板
     */
    public stopListening(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    /**
     * 处理剪贴板变化
     */
    private async handleClipboardChange(): Promise<void> {
        Logger.info('Clipboard', '正在监听剪贴板')
        const text = clipboard.readText()
        Logger.debug('Clipboard', '剪贴板文本', text)
        const clipboardTypes = clipboard.availableFormats()

        if (clipboardTypes.includes('text/uri-list')) {
            await this.handleUriList(text)
        } else if (clipboardTypes.includes('image/png')) {
            await this.handleImage()
        } else if (clipboardTypes.includes('text/plain') || clipboardTypes.includes('text/html')) {
            await this.handleText(text)
        }

        Logger.debug('Clipboard', '分割线', '--------------------------------')
    }

    /**
     * 处理URI列表类型的剪贴板内容
     */
    private async handleUriList(text: string): Promise<void> {
        if (text === this.lastState.last_file_name_text) return

        this.lastState.last_file_name_text = text
        const actualPath = await this.getActualPath()
        const imageBase64 = await this.getImageBase64(actualPath)
        const time = new Date().getTime()

        if (imageBase64) {
            this.updateLastState('image', imageBase64, time, { origin: 'local-file' })
        } else {
            this.updateLastState('text', text, time, { origin: 'local-file-no-image' })
            Logger.info('Clipboard', '文件不是图片')
        }
    }

    /**
     * 处理图片类型的剪贴板内容
     */
    private async handleImage(): Promise<void> {
        const imageBuffer = clipboard.readImage().toPNG()
        const contentHash = createHash('md5')
            .update(imageBuffer.subarray(0, 1024))
            .digest('hex')

        if (contentHash === this.lastState.contentHash) return

        this.updateLastState(
            'image',
            clipboard.readImage().toDataURL(),
            new Date().getTime(),
            {},
            contentHash
        )
    }

    /**
     * 处理文本类型的剪贴板内容
     */
    private async handleText(text: string): Promise<void> {
        const contentHash = createHash('md5')
            .update(text)
            .digest('hex')

        if (contentHash === this.lastState.contentHash) return

        this.updateLastState(
            'text',
            text,
            new Date().getTime(),
            {},
            contentHash
        )
    }

    /**
     * 更新最后的状态并发送到渲染进程
     */
    private updateLastState(
        type: ClipboardType,
        content: string,
        timestamp: number,
        meta: object = {},
        contentHash: string = ''
    ): void {
        this.lastState = {
            ...this.lastState,
            type,
            content,
            timestamp,
            meta,
            contentHash
        }
        DBManager.getInstance().insertClipboardItem(this.lastState)
        sendRenderer.setClipboardToRenderer([this.lastState])
    }

    /**
     * 处理mac和window系统图片路径函数
     * @param {string} path 图片路径
     * @returns {string} 处理后的图片路径
     */
    private async getActualPath(): Promise<string> {
        try {
            let buffer
            let filePathStr = ''
            if (process.platform === 'darwin') {
                // macOS
                buffer = clipboard.readBuffer('public.file-url')
            } else if (process.platform === 'win32') {
                // Windows
                buffer = clipboard.readBuffer('FileNameW')
            } else {
                // Linux
                buffer = clipboard.readBuffer('text/uri-list')
            }

            if (buffer) {
                // 转换 Buffer 为字符串
                filePathStr = buffer.toString('utf8')
                Logger.info('Clipboard', '文件路径:', filePathStr)
            }

            // Mac 系统
            if (process.platform === 'darwin') {
                if (filePathStr.includes('.file/id=')) {
                    const script = `osascript -e 'get POSIX path of ((POSIX file "${filePathStr}") as alias)'`
                    const { stdout } = await this.execAsync(script)
                    return stdout.trim()
                }
                return decodeURIComponent(filePathStr.replace('file://', ''))
            }

            // Windows 系统
            if (process.platform === 'win32') {
                // 移除 file:// 前缀
                let windowsPath = filePathStr.replace('file:///', '')
                // 解码 URL 编码的字符
                windowsPath = decodeURIComponent(windowsPath)
                // 替换正斜杠为反斜杠
                windowsPath = windowsPath.replace(/\//g, '\\')
                return windowsPath
            }

            // Linux 系统
            return decodeURIComponent(filePathStr.replace('file://', ''))
        } catch (error) {
            Logger.error('Clipboard', '路径转换错误:', error)
            return ''
        }
    }

    /**
     * 根据文件路径文件的后缀名判断是否为图片，如果是图片获取base64
     * @param {string} path 文件路径
     * @returns {Promise<string>} 返回base64字符串的Promise
     */
    private async getImageBase64(path: string): Promise<string> {
        const ext = path.split('.').pop()
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'bmp' || ext === 'tiff' || ext === 'ico') {
            const buffer = await fs.readFileSync(path)
            return 'data:image/' + ext + ';base64,' + buffer.toString('base64')
        }
        return ''
    }
}