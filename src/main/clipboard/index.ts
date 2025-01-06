import { clipboard } from 'electron'
import { BrowserWindow } from 'electron'
import { SETTING } from '../config/setting'
import { createHash } from 'crypto'
import { Logger } from '../utils/logger'
import { DBManager } from '../database/index'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
const execAsync = promisify(exec)

interface ClipboardState {
    type: 'text' | 'html' | 'image' | 'file' | 'url'          // 剪贴板格式
    contentHash?: string     // 内容哈希
    timestamp: number        // 时间戳
    content: string         // 内容 真正传输到渲染进程展示的内容
    text: string            // 文本 目前只用于本地文件的判断和使用，其他两类不涉及
    meta: any
    time: number
}
let lastState: ClipboardState = {
    type: 'text',
    timestamp: 0,
    contentHash: '',
    text: '',
    content: '',
    meta: {},
    time: 0,
}

const db = DBManager.getInstance()
function loopReadClipboard(mainWindow: BrowserWindow) {

    setInterval(async () => {
        Logger.info('Clipboard', '正在监听剪贴板')
        Logger.debug('Clipboard', '剪贴板支持的格式', clipboard.availableFormats())


        const text = clipboard.readText()
        Logger.debug('Clipboard', '剪贴板文本', text)
        const clipboardTypes = clipboard.availableFormats()

        if (clipboardTypes.includes('text/uri-list')) {
            Logger.info('Clipboard', '检测到文件')
            if (text === lastState.text) {
                Logger.debug('Clipboard', '文件内容相同')
                return
            }
            lastState.text = text
            const actualPath = await getActualPath()
            const imageBase64 = await getImageBase64(actualPath)
            const time = new Date().getTime()
            if (imageBase64) {
                lastState.content = imageBase64
                lastState.type = 'image'
                lastState.timestamp = time
                lastState.meta = {
                    origin: 'local-file',
                }
                sendClipboardContent(mainWindow)
            } else {
                lastState.content = text
                lastState.type = 'text'
                lastState.timestamp = time
                lastState.meta = {
                    origin: 'local-file-no-image',
                }
                sendClipboardContent(mainWindow)
                Logger.info('Clipboard', '文件不是图片')
            }
            return
        }

        if (clipboardTypes.includes('image/png')) {
            Logger.info('Clipboard', '检测到图片')
            let contentHash = ''
            const imageBuffer = clipboard.readImage().toPNG()
            contentHash = createHash('md5')
                .update(imageBuffer.subarray(0, 1024))
                .digest('hex')
            if (contentHash === lastState.contentHash) {
                Logger.debug('Clipboard', '图片内容相同')
                return
            }

            lastState.contentHash = contentHash
            lastState.content = clipboard.readImage().toDataURL()
            lastState.type = 'image'
            lastState.timestamp = new Date().getTime()
            sendClipboardContent(mainWindow)
        }

        if (clipboardTypes.includes('text/plain') || clipboardTypes.includes('text/html')) {
            let contentHash = ''
            contentHash = createHash('md5')
                .update(text)
                .digest('hex')
            if (contentHash === lastState.contentHash) {
                Logger.debug('Clipboard', '文本内容相同')
                return
            }
            lastState.contentHash = contentHash
            if (SETTING.isShowHtmlClipboard) {
                lastState.content = clipboard.readHTML()
                lastState.type = 'html'
            } else {
                lastState.content = text
                lastState.type = 'text'
            }
            lastState.timestamp = new Date().getTime()
            sendClipboardContent(mainWindow)
        }
        Logger.debug('Clipboard', '分割线', '--------------------------------')

    }, 1000)
}

/**
 * 处理mac和window系统图片路径函数
 * @param {string} path 图片路径
 * @returns {string} 处理后的图片路径
 */
async function getActualPath(): Promise<string> {
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
                const { stdout } = await execAsync(script)
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
async function getImageBase64(path: string): Promise<string> {
    const ext = path.split('.').pop()
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'bmp' || ext === 'tiff' || ext === 'ico') {
        const buffer = await fs.readFileSync(path)
        return 'data:image/' + ext + ';base64,' + buffer.toString('base64')
    }
    return ''
}

/**
 * 发送剪贴板内容
 * @param {BrowserWindow} mainWindow 主窗口
 */
function sendClipboardContent(mainWindow: BrowserWindow) {
    const id = db.insertClipboardItem({
        content: lastState.content,
        type: lastState.type,
        contentHash: lastState.contentHash || '',
        meta: lastState.meta
    })
    Logger.info('Database', `保存剪贴板记录 ID: ${id}`)
    mainWindow.webContents.send('get-clipboard', {
        ...lastState
    });
}

export { loopReadClipboard }
