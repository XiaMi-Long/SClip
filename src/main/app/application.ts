import { join } from 'path'
import icon from '../../../resources/icon.png?asset'
import { app, shell, BrowserWindow, ipcMain, BrowserWindowConstructorOptions, powerMonitor } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { BrowserWindowManager } from "../window/window.manager";
import { ClipboardManager } from '../clipboard';
import { GlobalShortcut } from '../shortcuts/shortcut.manager.ts';
import { DBManager } from '../database/database.manager';
import { Logger } from '../services/logger.service';
import sendRenderer from '../services/ipc.service';
import { clipboard, nativeImage } from 'electron'
import robot from 'robotjs'
import { ConfigManager } from '../config/app.config';

/**
 * 基础事件注册接口
 */
interface registerEvent {
    init(): void
    registerEvent(): void
}

/**
 * 主窗口方法接口
 * 扩展自 registerEvent
 */
interface WindowMethod extends registerEvent {
    getMainWindow(): BrowserWindow | undefined
    createMainWindow(): void
}

/**
 * 应用注册事件接口
 * 扩展自 registerEvent
 */
interface appRegisterEvent extends registerEvent {
    registerIPCEvent(): void
}

/**
 * 主窗口方法接口
 * 扩展自 WindowMethod
 */
interface mainWindowMethod extends WindowMethod {
    startClipboardListening(): void
    startGlobalShortcut(): void
}

/**
 * 应用注册管理类
 * 负责管理应用的窗口创建、事件注册等
 */
export class ApplicationRegister {
    /**
     * 主窗口的配置参数
     */
    private static mainWindowParams: BrowserWindowConstructorOptions = {
        width: 300,
        height: 450,
        show: false,
        autoHideMenuBar: true,
        // focusable: false,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            scrollBounce: true
        }
    }

    constructor() { }

    /**
     * 应用注册事件对象
     * 包含应用级别的事件注册和初始化
     */
    public static appRegister: appRegisterEvent = {
        /**
         * 初始化应用注册事件
         */
        init() {
            this.registerEvent()
            this.registerIPCEvent()
            electronApp.setAppUserModelId('com.electron')
        },

        /**
         * 注册应用级别的事件
         */
        registerEvent() {
            // 监听浏览器窗口创建事件
            app.on('browser-window-created', (_, window) => {
                optimizer.watchWindowShortcuts(window)
            })

            // 监听应用激活事件
            app.on('activate', function () {
                const mainWindow = ApplicationRegister.getMainWindowMethod().getMainWindow()
                if (mainWindow === undefined) {
                    ApplicationRegister.getMainWindowMethod().createMainWindow()
                } else {
                    mainWindow.show()
                }
            })

            app.on('window-all-closed', () => {
                if (process.platform !== 'darwin') {
                    app.quit()
                }
            })

            // 清理资源
            app.on('before-quit', () => {
                const mainWindow = ApplicationRegister.getMainWindowMethod().getMainWindow()
                // 允许窗口关闭
                mainWindow?.removeAllListeners('close')
            })
        },

        /**
         * 注册应用IPC通信事件
         */
        registerIPCEvent() {
            /**
             * 监听应用恢复事件
             */
            powerMonitor.on('resume', () => {
                try {
                    const clipboardHistory = DBManager.getInstance().getClipboardHistory()
                    sendRenderer.setClipboardToRenderer(clipboardHistory)
                } catch (error) {
                    Logger.error('Application', `恢复剪贴板记录失败`, error)
                }
            })

            /**
             * 监听渲染进程通信-渲染进程通知主进程准备复制剪贴板的内容到用户输入区域
             */
            ipcMain.on('change-clipboard', (event, clipboardState: ClipboardState) => {
                console.warn(clipboardState);

                Logger.info('Application', `主进程通信-获取到渲染进程剪贴板记录`)
                const window = BrowserWindow.getAllWindows()[0]
                if (!window) return;

                window.hide()
                try {
                    // 根据类型处理不同内容
                    switch (clipboardState.type) {
                        case 'image':
                            const image = nativeImage.createFromDataURL(clipboardState.content)
                            clipboard.writeImage(image)
                            break
                        case 'rtf':
                            const setting = ConfigManager.getInstance().getSetting()
                            if (setting.rtfRenderType === 'rtf') {
                                clipboard.writeRTF(clipboardState.content)
                            } else if (setting.rtfRenderType === 'html') {
                                clipboard.writeHTML(clipboardState.meta.rtf_html)
                            } else {
                                clipboard.writeText(clipboardState.meta.rtf_text)
                            }
                            break
                        default:
                            clipboard.writeText(clipboardState.content)
                            break
                    }
                    setTimeout(() => {
                        // 模拟粘贴操作
                        robot.mouseClick('left')
                        robot.keyTap('v', process.platform === 'darwin' ? 'command' : 'control')
                    }, 200);


                } catch (error) {
                    Logger.error('Application', '粘贴内容失败', error)
                }
            })

            /**
             * 监听渲染进程通信-更新剪贴板数据
             */
            ipcMain.on('update-clipboard-item', (event, clipboardState: ClipboardState) => {
                console.error(clipboardState);
                try {
                    if (clipboardState) {
                        DBManager.getInstance().updateClipboardItem(clipboardState)
                    }
                } catch (error) {
                    Logger.error('Application', '更新剪贴板数据失败', error)
                }
            })

            /**
             * 监听渲染进程通信-删除剪贴板数据
             */
            ipcMain.on('delete-clipboard-item', (event, clipboardState: ClipboardState) => {
                try {
                    if (clipboardState && clipboardState.id) {
                        DBManager.getInstance().deleteClipboardItem(clipboardState.id)
                    }
                } catch (error) {
                    Logger.error('Application', '删除剪贴板数据失败', error)
                }
            })
        }
    }

    /**
     * 获取主窗口相关方法
     * @returns MainWindowMethod 主窗口方法对象
     */
    public static getMainWindowMethod(): mainWindowMethod {
        return {
            /**
             * 注册主窗口事件
             */
            init() {
                this.createMainWindow()
                this.registerEvent()
                this.startClipboardListening()
                this.startGlobalShortcut()
            },

            /**
             * 创建主窗口
             */
            createMainWindow() {
                BrowserWindowManager.createBrowserWindow({
                    key: 'main',
                    browserWindow: ApplicationRegister.mainWindowParams
                })
            },

            /**
             * 获取主窗口
             */
            getMainWindow() {
                return BrowserWindowManager.getBrowserWindow('main')
            },

            /**
             * 注册主窗口事件
             */
            registerEvent() {
                const mainWindow = this.getMainWindow()
                if (mainWindow) {
                    mainWindow.on('ready-to-show', () => {
                        if (mainWindow) {
                            mainWindow.show()
                            mainWindow.maximizable = false
                            mainWindow.resizable = false
                            // mainWindow.setAlwaysOnTop(true, 'screen-saver')
                            try {
                                const clipboardHistory = DBManager.getInstance().getClipboardHistory()
                                sendRenderer.setClipboardToRenderer(clipboardHistory)
                            } catch (error) {
                                Logger.error('Application', `初始化应用恢复剪贴板记录失败`, error)
                            }

                            try {
                                const setting = ConfigManager.getInstance().getSetting()
                                sendRenderer.setSettingToRender(setting)
                            } catch (error) {
                                Logger.error('Application', `初始化应用恢复设置失败`, error)
                            }


                            // 打开开发者工具
                            mainWindow.webContents.openDevTools()
                            // mainWindow.setAlwaysOnTop(true, 'screen-saver')
                        }
                    })

                    // 监听主窗口关闭事件
                    mainWindow.on('close', (event) => {
                        if (process.platform === 'darwin') {
                            event.preventDefault()
                            mainWindow.hide()
                        }
                    })

                    // 监听主窗口失去焦点事件
                    mainWindow.on('blur', () => {
                        // mainWindow.hide()
                    })

                    // 监听主窗口打开外部链接事件
                    mainWindow.webContents.setWindowOpenHandler((details) => {
                        shell.openExternal(details.url)
                        return { action: 'deny' }
                    })

                    // 加载主窗口
                    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
                        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
                    } else {
                        mainWindow.loadFile(join(__dirname, '../../renderer/index.html'))
                    }



                } else {
                    console.error('主窗口未创建')
                }
            },

            /**
             * 启动剪贴板监听
             */
            startClipboardListening() {
                ClipboardManager.getInstance().startListening()
            },

            /**
             * 注册全局显示窗口快捷键
             */
            startGlobalShortcut() {
                GlobalShortcut.registerShortcut("Alt+V", () => {
                    const window = BrowserWindowManager.getBrowserWindow('main')
                    if (window) {
                        if (window.isVisible()) {
                            window.hide()
                        } else {
                            window.show()
                        }
                    }
                })
            }
        }
    }
}