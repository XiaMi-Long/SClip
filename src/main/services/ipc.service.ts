import { Logger } from './logger.service'
import { BrowserWindowManager } from '../window/window.manager'

/**
 * @deprecated 此文件已废弃，请使用 MainIPCService 替代
 * 相关功能已经被集成到 MainIPCService 类的 sendToRenderer 对象中
 * 请修改你的代码以使用 MainIPCService.sendToRenderer
 *
 * 例如:
 * - 旧: sendRenderer.setClipboardToRenderer(data)
 * - 新: MainIPCService.sendToRenderer.setClipboardToRenderer(data)
 */
const sendRenderer = {
  /**
   * @deprecated 请使用 MainIPCService.sendToRenderer.setClipboardToRenderer
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
   * @deprecated 请使用 MainIPCService.sendToRenderer.setSettingWindow
   */
  setSettingWindow: (data: Setting, browserWindowKey: string) => {
    try {
      Logger.info('SendRenderer-setSettingWindow', `【发送应用配置数据】-${browserWindowKey}`, data)
      const browserWindow = BrowserWindowManager.getBrowserWindow(browserWindowKey)
      if (browserWindow) {
        browserWindow.webContents.send('get-app-setting', data)
      }
    } catch (error) {
      Logger.error('SendRenderer', '发送应用配置数据失败', error)
    }
  },

  /**
   * @deprecated 请使用 MainIPCService.sendToRenderer.setWindowId
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
  }
}

export default sendRenderer
