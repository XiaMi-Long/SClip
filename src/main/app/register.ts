import { join } from 'path'
import icon from '../../../resources/icon.png?asset'
import { app, shell, BrowserWindow, ipcMain, BrowserWindowConstructorOptions, powerMonitor } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { BrowserWindowManager } from "../utils/browser_window_manager";

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
interface MainWindowMethod extends registerEvent {
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
 * 应用注册管理类
 * 负责管理应用的窗口创建、事件注册等
 */
export class AppRegister {
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
            preload: join(__dirname, '../../preload/index.js'),
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
                const mainWindow = AppRegister.getMainWindowMethod().getMainWindow()
                if (mainWindow === undefined) {
                    AppRegister.getMainWindowMethod().createMainWindow()
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
                const mainWindow = AppRegister.getMainWindowMethod().getMainWindow()
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
                // const clipboardHistory = getClipboardHistory()
                // Logger.info('Database', `恢复剪贴板记录`)
                // sendRenderer.setClipboard({
                //     ...clipboardHistory
                // });
            })

            /**
             * 监听渲染进程通信-渲染进程通知主进程准备复制剪贴板的内容到用户输入区域
             */
            ipcMain.on('paste-selected-text', (event, clipboardState: ClipboardState) => {
                // Logger.info('Database', `渲染进程通信-获取剪贴板记录`)
                // console.log(clipboardState);
                // const window = BrowserWindow.getAllWindows()[0]
                // if (window) {
                //     window.hide()
                //     setTimeout(() => {
                //         robot.mouseClick('left')
                //         robot.typeString(clipboardState.text)
                //     }, 1000);
                // }
            })
        }
    }

    /**
     * 获取主窗口相关方法
     * @returns MainWindowMethod 主窗口方法对象
     */
    public static getMainWindowMethod(): MainWindowMethod {
        return {
            /**
             * 注册主窗口事件
             */
            init() {
                this.createMainWindow()
                this.registerEvent()
            },

            /**
             * 创建主窗口
             */
            createMainWindow() {
                BrowserWindowManager.createBrowserWindow({
                    key: 'main',
                    browserWindow: AppRegister.mainWindowParams
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

                            // 初始化剪贴板数据
                            // {
                            //     const clipboardHistory = getClipboardHistory()
                            //     sendRenderer.setClipboard(clipboardHistory)
                            // }

                            // 打开开发者工具
                            mainWindow.webContents.openDevTools()
                        }
                    })

                    // 监听主窗口关闭事件
                    mainWindow.on('close', (event) => {
                        if (process.platform === 'darwin') {
                            event.preventDefault()
                            mainWindow.hide()
                        }
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
            }
        }
    }
}