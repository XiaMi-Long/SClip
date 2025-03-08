/**
 * 主进程IPC通信服务
 * 整合所有与渲染进程的通信方法
 */
import { ipcMain, nativeTheme, BrowserWindow, clipboard, nativeImage } from 'electron'
import { Logger } from './logger.service'
import { DBManager } from '../database/database.manager'
import { ConfigManager } from '../config/app.config'
import { BrowserWindowManager } from '../window/window.manager'
import robot from 'robotjs'
import { ApplicationRegister } from '../app/application'

/**
 * 主进程IPC通信服务类
 */
export class MainIPCService {
  /**
   * 注册所有IPC事件监听
   * 整合所有preload相关的调用
   */
  static registerAllEvents(): void {
    // 注册接收渲染进程消息的事件
    this.registerMainProcessReceivers()

    // 注册需要返回数据给渲染进程的事件
    this.registerMainProcessHandlers()
  }

  /**
   * 注册从渲染进程接收消息的事件（不需要返回数据）
   * 使用ipcMain.on方法
   */
  private static registerMainProcessReceivers(): void {
    /**
     * 监听渲染进程通信-渲染进程通知主进程准备复制剪贴板的内容到用户输入区域
     */
    ipcMain.on('write-clipboard', (event, clipboardState: ClipboardState) => {
      Logger.info('Application', `主进程通信-获取到渲染进程剪贴板记录`)
      const window = BrowserWindow.getAllWindows()[0]
      if (!window) return

      try {
        // 根据类型处理不同内容
        switch (clipboardState.type) {
          case 'image': {
            const image = nativeImage.createFromDataURL(clipboardState.content)
            clipboard.writeImage(image)
            break
          }
          case 'rtf': {
            const setting = ConfigManager.getInstance().getSetting()
            if (setting.rtfRenderType === 'rtf') {
              clipboard.writeRTF(clipboardState.content)
            } else if (setting.rtfRenderType === 'html') {
              clipboard.writeHTML(clipboardState.meta.rtf_html)
            } else {
              clipboard.writeText(clipboardState.meta.rtf_text)
            }
            break
          }
          default:
            clipboard.writeText(clipboardState.content)
            break
        }
        window.hide()
        setTimeout(() => {
          // 模拟粘贴操作
          robot.mouseClick('left')
          robot.keyTap('v', process.platform === 'darwin' ? 'command' : 'control')
        }, 200)
      } catch (error) {
        Logger.error('Application', '粘贴内容失败', error)
      }
    })

    /**
     * 监听渲染进程通信-更新剪贴板数据
     */
    ipcMain.on('update-clipboard-item', (event, clipboardState: ClipboardState) => {
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
    ipcMain.on('delete-clipboard-item', (_event, clipboardState: ClipboardState) => {
      Logger.info('IPC', '接收到删除剪贴板项目请求', {
        id: clipboardState.id
      })
      // 处理删除剪贴板项目
      DBManager.getInstance().deleteClipboardItem(clipboardState.id as number)
    })

    /**
     * 监听渲染进程通信-打开设置窗口
     */
    ipcMain.on('open-setting', () => {
      ApplicationRegister.getSettingWindowMethod().init()
    })

    /**
     * 窗口最小化
     */
    ipcMain.on('window-minimize', (event) => {
      // 获取发送事件的窗口
      const win = BrowserWindow.fromWebContents(event.sender)
      if (win) {
        win.minimize()
      }
    })

    /**
     * 窗口最大化（目前设置为不可用）
     */
    ipcMain.on('window-maximize', (event) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (win) {
        // 由于我们设置了窗口不可最大化，这里可以不做处理
        // 或者可以添加一些提示
        Logger.info('Application', '窗口不支持最大化')
      }
    })

    /**
     * 窗口关闭
     */
    ipcMain.on('window-close', (event) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) return

      const windowType =
        win === ApplicationRegister.getMainWindowMethod().getMainWindow() ? 'main' : 'setting'

      if (windowType === 'main') {
        // 主窗口隐藏时保持任务栏图标
        win.hide()
      } else {
        // 其他窗口（如设置窗口）直接关闭
        win.close()
      }
    })

    /**
     * 监听渲染进程通信-更新应用配置
     */
    ipcMain.on('update-config-setting', (event, setting: Setting, windowId: string) => {
      ConfigManager.getInstance().updateSetting(setting)
      // 获取所有窗口
      const allWindows = BrowserWindowManager.getBrowserWindows()
      // 遍历所有窗口，向非 windowId 窗口发送更新配置事件
      allWindows.forEach((_, key) => {
        // 跳过 windowId 窗口，只向其他窗口发送更新
        if (key !== windowId) {
          this.sendToRenderer.setSettingWindow(setting, key)
        }
      })
    })
  }

  /**
   * 注册需要返回数据给渲染进程的处理器
   * 使用ipcMain.handle方法
   */
  private static registerMainProcessHandlers(): void {
    /**
     * 监听渲染进程通信-获取当前系统主题
     */
    ipcMain.handle('get-native-theme-shouldUseDarkColors', () => {
      return nativeTheme.shouldUseDarkColors
    })

    /**
     * 处理获取日志请求
     */
    ipcMain.handle('get-logs', async (_event, options) => {
      Logger.info('IPC', '接收到获取日志请求', options)

      try {
        const logs = DBManager.getInstance().getLogs({
          level: options.level,
          limit: options.limit || 20,
          startTime: options.startTime,
          endTime: options.endTime
        })

        return {
          data: logs.slice(options.offset || 0, (options.offset || 0) + (options.limit || 20)),
          total: logs.length
        }
      } catch (error) {
        Logger.error('IPC', '获取日志失败', error)
        return { data: [], total: 0 }
      }
    })

    /**
     * 处理清空所有日志请求
     */
    ipcMain.handle('clear-all-logs', async () => {
      Logger.info('IPC', '接收到清空所有日志请求')

      try {
        const result = DBManager.getInstance().clearAllLogs()
        return result
      } catch (error) {
        Logger.error('IPC', '清空日志失败', error)
        return 0
      }
    })
  }

  /**
   * 主进程发送到渲染进程的消息
   * 整合所有发送到渲染进程的方法
   */
  static sendToRenderer = {
    /**
     * 发送剪贴板数据
     * @param data 剪贴板数据
     */
    setClipboardToRenderer: (data: ClipboardState[]) => {
      try {
        Logger.info('SendRenderer', '发送剪贴板数据', data)
        const mainWindow = BrowserWindowManager.getBrowserWindow('main')
        if (mainWindow) {
          mainWindow.webContents.send('set-clipboard-to-render', data)
        }
      } catch (error) {
        Logger.error('SendRenderer', '发送剪贴板数据失败', error)
      }
    },

    /**
     * 发送应用配置数据
     * @param data 应用配置数据
     * @param browserWindowKey 窗口key
     */
    setSettingWindow: (data: Setting, browserWindowKey: string) => {
      try {
        Logger.info(
          'SendRenderer-setSettingWindow',
          `【发送应用配置数据】-${browserWindowKey}`,
          data
        )
        const browserWindow = BrowserWindowManager.getBrowserWindow(browserWindowKey)
        if (browserWindow) {
          browserWindow.webContents.send('get-app-setting', data)
        }
      } catch (error) {
        Logger.error('SendRenderer', '发送应用配置数据失败', error)
      }
    },

    /**
     * 发送窗口ID
     * @param windowId 窗口ID
     * @param browserWindowKey 窗口key
     */
    setWindowId: (windowId: string, browserWindowKey: string) => {
      try {
        const browserWindow = BrowserWindowManager.getBrowserWindow(browserWindowKey)
        if (browserWindow) {
          browserWindow.webContents.send('set-window-id', windowId)
        }
      } catch (error) {
        Logger.error('SendRenderer', '发送窗口ID失败', error)
      }
    },

    /**
     * 发送系统主题变化事件
     * @param isDarkMode 是否为暗色模式
     */
    sendNativeThemeUpdated: (isDarkMode: boolean) => {
      const allWindows = BrowserWindowManager.getBrowserWindows()
      allWindows.forEach((_, key) => {
        const window = BrowserWindowManager.getBrowserWindow(key)
        if (window) {
          window.webContents.send('native-theme-updated', isDarkMode)
        }
      })
    },

    /**
     * 发送显示主窗口事件
     */
    sendShowMainWindow: () => {
      const mainWindow = BrowserWindowManager.getBrowserWindow('main')
      if (mainWindow) {
        if (
          mainWindow.isVisible() &&
          ConfigManager.getInstance().getSetting().appBehavior.jumpToFirstPage
        ) {
          mainWindow.webContents.send('show-main-window')
        }
      }
    }
  }
}
