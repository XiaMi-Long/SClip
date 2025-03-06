import { join } from 'path'
import { screen, nativeTheme } from 'electron'
import { Menu, MenuItemConstructorOptions } from 'electron'
import icon from '../../../resources/images/icons/icon.png?asset'
import {
  app,
  shell,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  powerMonitor,
  Tray
} from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { BrowserWindowManager } from '../window/window.manager'
import { ClipboardManager } from '../clipboard'
import { GlobalShortcut } from '../shortcuts/shortcut.manager.ts'
import { DBManager } from '../database/database.manager'
import { Logger } from '../services/logger.service'
import { ConfigManager } from '../config/app.config'
import { MainIPCService } from '../services/ipc.main.service'

/**
 * 基础事件注册接口
 */
interface registerEvent {
  init(): void
  registerEvent(): void
}

/**
 * 应用注册事件接口
 * 扩展自 registerEvent
 */
interface appRegisterEvent extends registerEvent {
  registerIPCEvent(): void
  registerTray(): void
  registerAppMenu(): void
  registerPowerMonitorEvent(): void
  registerNativeThemeEvent(): void
}

/**
 * 主窗口方法接口
 * 扩展自 WindowMethod
 */
interface mainWindowMethod extends registerEvent {
  startClipboardListening(): void
  startGlobalShortcut(): void
  getMainWindow(): BrowserWindow | undefined
  createMainWindow(): void
}

interface settingWindowMethod extends registerEvent {
  createSettingWindow(): void
  getSettingWindow(): BrowserWindow | undefined
}

/**
 * 应用注册管理类
 * 负责管理应用的窗口创建、事件注册等
 */
export class ApplicationRegister {
  private static tray: Tray | null = null

  /**
   * 主窗口的配置参数
   */
  private static get mainWindowParams(): BrowserWindowConstructorOptions {
    const { width, height } = this.getScaledWindowSize(300, 450)
    return {
      width,
      height,
      show: false,
      frame: false,
      transparent: true,
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: 12, y: 10 },
      autoHideMenuBar: true,
      title: 'SClip',
      ...(process.platform === 'linux' ? { icon } : {}),
      roundedCorners: true,
      vibrancy: 'under-window',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: true,
        scrollBounce: true,
        devTools: is.dev ? true : false
      }
    }
  }

  /**
   * 设置窗口的配置参数
   */
  private static get settingWindowParams(): BrowserWindowConstructorOptions {
    const { width, height } = this.getScaledWindowSize(1000, 600)

    return {
      width,
      height,
      show: false,
      title: 'SClip - 设置',
      frame: false,
      titleBarStyle: 'hidden',
      autoHideMenuBar: true,
      trafficLightPosition: { x: 12, y: 10 },
      transparent: false,
      roundedCorners: true,
      vibrancy: 'under-window',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: true,
        scrollBounce: true,
        devTools: is.dev ? true : false
      }
    }
  }

  /**
   * 类构造函数
   * 由于所有方法都是静态的，此构造函数为空
   */
  constructor() {
    // 空构造函数，所有功能通过静态方法实现
  }

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
      this.registerTray()
      this.registerAppMenu()
      this.registerPowerMonitorEvent()
      this.registerNativeThemeEvent()
      electronApp.setAppUserModelId('com.sclip')
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

      // 监听应用关闭事件
      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit()
        }
      })

      // 清理资源
      app.on('before-quit', () => {
        if (ApplicationRegister.tray) {
          ApplicationRegister.tray.destroy()
          ApplicationRegister.tray = null
        }

        BrowserWindowManager.destroyAllWindows()
      })
    },

    /**
     * 注册应用IPC通信事件
     */
    registerIPCEvent() {
      // 使用整合的IPC服务注册所有事件
      MainIPCService.registerAllEvents()
    },

    /**
     * 注册托盘事件
     */
    registerTray() {
      if (!ApplicationRegister.tray) {
        ApplicationRegister.tray = new Tray(icon)

        // 设置托盘图标的上下文菜单
        const contextMenu = Menu.buildFromTemplate([
          {
            label: '显示主窗口',
            click: () => {
              const mainWindow = ApplicationRegister.getMainWindowMethod().getMainWindow()
              if (mainWindow) {
                mainWindow.show()
              }
            }
          },
          {
            label: '退出',
            click: () => {
              app.quit()
            }
          }
        ])

        ApplicationRegister.tray.setToolTip('SClip') // 设置鼠标悬浮时的提示文字
        ApplicationRegister.tray.setContextMenu(contextMenu) // 设置右键菜单

        // 点击托盘图标时显示主窗口
        ApplicationRegister.tray.on('click', () => {
          const mainWindow = ApplicationRegister.getMainWindowMethod().getMainWindow()
          if (mainWindow) {
            mainWindow.show()
          }
        })
      }
    },

    /**
     * 注册应用菜单
     */
    registerAppMenu(): void {
      const template: MenuItemConstructorOptions[] = [
        {
          label: '设置',
          submenu: [
            { label: '关于SClip', id: 'about-sclip', click: () => {} },
            { type: 'separator' },
            { label: '主题设置', id: 'theme-setting', click: () => {} },
            { type: 'separator' },
            { label: '趣味数据', id: 'funny-data', click: () => {} },
            { type: 'separator' },
            { label: '操作日志', id: 'operation-log', click: () => {} },
            { type: 'separator' },
            { label: '快捷键设置', id: 'shortcut-setting', click: () => {} },
            { type: 'separator' },
            { label: '软件设置', id: 'software-setting', click: () => {} },
            { type: 'separator' }
          ]
        },
        {
          label: '窗口',
          submenu: [
            { role: 'minimize', label: '最小化', id: 'minimize', click: () => {} },
            { role: 'reload', label: '刷新', id: 'reload', click: () => {} },
            { role: 'quit', label: '退出', id: 'quit', click: () => {} }
          ]
        }
      ]
      if (is.dev) {
        ;(template[1].submenu as MenuItemConstructorOptions[]).unshift({
          role: 'toggleDevTools',
          label: '开发者工具',
          id: 'toggle-dev-tools'
        })
      }

      const menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
    },

    /**
     * 注册电源监控事件
     */
    registerPowerMonitorEvent(): void {
      /**
       * 监听应用恢复事件
       */
      powerMonitor.on('resume', () => {
        Logger.info('PowerMonitor', '系统恢复，恢复监听剪贴板')
        ClipboardManager.getInstance().startListening()
      })

      /**
       * 监听应用挂起事件
       */
      powerMonitor.on('suspend', () => {
        Logger.info('PowerMonitor', '系统挂起，停止监听剪贴板')
        ClipboardManager.getInstance().stopListening()
      })

      /**
       * 监听屏幕锁定事件
       */
      powerMonitor.on('lock-screen', () => {
        Logger.info('PowerMonitor', '屏幕锁定，停止监听剪贴板')
        ClipboardManager.getInstance().stopListening()
      })

      /**
       * 监听屏幕解锁事件
       */
      powerMonitor.on('unlock-screen', () => {
        Logger.info('PowerMonitor', '屏幕解锁，恢复监听剪贴板')
        ClipboardManager.getInstance().startListening()
      })
    },

    /**
     * 监听系统主题变化事件
     *
     * @description 该方法实现了对系统主题变化的监听和处理
     *
     * 实现逻辑：
     * 1. 初始化一个变量 isDarkMode 存储当前系统主题状态
     * 2. 监听 nativeTheme 的 'updated' 事件
     * 3. 当事件触发时，检查系统主题是否发生变化
     * 4. 如果主题发生变化，更新 isDarkMode 变量
     * 5. 使用IPC服务发送消息到所有渲染进程
     */
    registerNativeThemeEvent(): void {
      let isDarkMode = nativeTheme.shouldUseDarkColors
      nativeTheme.on('updated', () => {
        if (isDarkMode !== nativeTheme.shouldUseDarkColors) {
          isDarkMode = !isDarkMode
          // 使用IPC服务发送系统主题变化事件
          MainIPCService.sendToRenderer.sendNativeThemeUpdated(isDarkMode)
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
                MainIPCService.sendToRenderer.setClipboardToRenderer(clipboardHistory)
              } catch (error) {
                Logger.error('Application', `初始化应用恢复剪贴板记录失败`, error)
              }

              try {
                const setting = ConfigManager.getInstance().getSetting()
                MainIPCService.sendToRenderer.setSettingWindow(setting, 'main')
                MainIPCService.sendToRenderer.setWindowId('main', 'main')
              } catch (error) {
                Logger.error('Application', `初始化应用恢复设置失败`, error)
              }

              // 在开发环境下打开 DevTools
              if (is.dev) {
                mainWindow.webContents.openDevTools({ mode: 'detach' })
              }
              // mainWindow.setAlwaysOnTop(true, 'screen-saver')

              // 监听显示器变化事件
              screen.on('display-metrics-changed', (event, display, changedMetrics) => {
                if (changedMetrics.includes('scaleFactor')) {
                  const { width, height } = ApplicationRegister.getScaledWindowSize(300, 450)
                  mainWindow.setSize(width, height)
                  // 可选：保持窗口在屏幕中心
                  mainWindow.center()
                }
              })
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
       * @description 根据系统类型注册不同的快捷键
       * 1. 如果系统是mac，则注册mac的快捷键
       * 2. 如果系统是windows，则注册windows的快捷键
       * 3. 如果系统是linux，则注册window的快捷键
       * 4. 如果系统是windows，并且设置了覆盖window系统快捷键，则注册window系统的默认快捷键
       */
      startGlobalShortcut() {
        let keyMap = ''
        const setting = ConfigManager.getInstance().getSetting()
        if (setting.system.isMac) {
          keyMap = setting.shortcut.appVisibleShortcut.mac
        } else {
          keyMap = setting.shortcut.appVisibleShortcut.windows
        }

        GlobalShortcut.registerShortcut(keyMap, () => {
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

  /**
   * 获取设置窗口相关方法
   * @returns SettingWindowMethod 设置窗口方法对象
   */
  public static getSettingWindowMethod(): settingWindowMethod {
    return {
      /**
       * 初始化设置窗口
       */
      init() {
        const existingWindow = this.getSettingWindow()
        if (existingWindow) {
          // 如果设置窗口已存在，则显示并聚焦
          existingWindow.show()
          existingWindow.focus()
        } else {
          // 否则创建新窗口
          this.createSettingWindow()
        }
      },

      /**
       * 创建设置窗口
       */
      createSettingWindow() {
        BrowserWindowManager.createBrowserWindow({
          key: 'setting',
          browserWindow: ApplicationRegister.settingWindowParams
        })

        const settingWindow = this.getSettingWindow()
        if (settingWindow) {
          // 设置窗口事件
          settingWindow.on('ready-to-show', () => {
            settingWindow.show()
            // 发送窗口 ID 到渲染进程
            MainIPCService.sendToRenderer.setWindowId('setting', 'setting')
            // 发送设置到渲染进程
            const setting = ConfigManager.getInstance().getSetting()
            MainIPCService.sendToRenderer.setSettingWindow(setting, 'setting')

            if (is.dev) {
              settingWindow.webContents.openDevTools()
            }
          })

          // 加载设置页面
          if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            settingWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/setting`)
          } else {
            settingWindow.loadFile(join(__dirname, '../../renderer/index.html'), {
              hash: '/setting'
            })
          }
        }
      },

      /**
       * 注册设置窗口事件
       * 当需要为设置窗口添加特定事件时实现此方法
       */
      registerEvent() {
        // 当前无需注册特定事件
      },

      /**
       * 获取设置窗口
       */
      getSettingWindow() {
        return BrowserWindowManager.getBrowserWindow('setting')
      }
    }
  }

  /**
   * 获取基于屏幕分辨率的窗口尺寸
   */
  private static getScaledWindowSize(baseWidth: number, baseHeight: number) {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize

    // 获取显示器缩放因子
    const scaleFactor = primaryDisplay.scaleFactor

    // 基准分辨率（1080p）
    const baseScreenWidth = 1920
    const baseScreenHeight = 1080

    // 计算缩放比例（考虑显示器分辨率和缩放因子）
    const scale = Math.min(
      screenWidth / scaleFactor / baseScreenWidth,
      screenHeight / scaleFactor / baseScreenHeight
    )

    // 应用缩放（最小不低于0.8，最大不超过1.5）
    const finalScale = Math.max(0.9, Math.min(1.4, scale))

    return {
      width: Math.round(baseWidth * finalScale),
      height: Math.round(baseHeight * finalScale)
    }
  }
}
