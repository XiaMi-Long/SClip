import { useConfigStore } from '@renderer/store/useConfigStore'

/**
 * 渲染进程IPC通信服务
 * 整合所有与preload相关的调用
 */

// 导入LogData类型
interface LogData {
  id?: number
  level: 'info' | 'warn' | 'error' | 'debug'
  module: string
  message: string
  data?: string
  created_at: number
}

/**
 * 发送到主进程的消息
 * 不需要等待主进程返回数据的方法
 */
export const sendToMain = {
  /**
   * 复制剪贴板内容到用户输入区域
   * @param {ClipboardState} clipboardState - 剪贴板数据
   */
  writeClipboard: (clipboardState: ClipboardState): void => {
    window.clipboard.writeClipboard(clipboardState)
  },

  /**
   * 更新剪贴板数据
   * @param {ClipboardState} clipboardState - 剪贴板数据
   */
  updateClipboardItem: (clipboardState: ClipboardState): void => {
    window.clipboard.updateClipboardItem(clipboardState)
  },

  /**
   * 清除剪贴板数据
   */
  clearClipboard: (): Promise<number | boolean> => {
    return window.mainWindow.clearClipboard()
  },

  /**
   * 删除剪贴板数据
   * @param {ClipboardState} clipboardData - 剪贴板数据
   */
  deleteClipboardItem: (clipboardData: ClipboardState): void => {
    window.clipboard.deleteClipboardItem(clipboardData)
  },

  /**
   * 打开设置窗口
   */
  openSetting: (): void => {
    window.browserWindow.openSetting()
  },

  /**
   * 窗口最小化
   */
  minimize: (): void => {
    window.titleBar.minimize()
  },

  /**
   * 窗口最大化
   */
  maximize: (): void => {
    window.titleBar.maximize()
  },

  /**
   * 窗口关闭
   */
  close: (): void => {
    window.titleBar.close()
  },

  /**
   * 更新应用配置
   * @param {Setting} setting - 应用配置
   * @param {string} windowId - 窗口ID
   */
  updateConfigSetting: (setting: Setting, windowId: string): void => {
    window.appConfig.updateConfigSetting(setting, windowId)
  },

  /**
   * 设置是否固定窗口
   * @param {boolean} isFixedWindow - 是否固定窗口
   * @param {string} windowId - 窗口ID
   */
  setIsFixedWindow: (isFixedWindow: boolean): void => {
    window.mainWindow.setIsFixedWindow(isFixedWindow)
  }
}

/**
 * 需要等待主进程返回数据的方法
 */
export const invokeMain = {
  /**
   * 获取当前系统主题
   * @returns {Promise<boolean>} 是否为暗色模式
   */
  getNativeThemeShouldUseDarkColors: (): Promise<boolean> => {
    return window.systemTheme.getNativeThemeShouldUseDarkColors()
  },

  /**
   * 获取日志记录
   * @param {Object} options - 查询选项
   * @param {string} [options.level] - 日志级别
   * @param {number} [options.limit] - 限制数量
   * @param {number} [options.offset] - 偏移量
   * @param {number} [options.startTime] - 开始时间
   * @param {number} [options.endTime] - 结束时间
   * @returns {Promise<{data: LogData[], total: number}>} 日志数据和总数
   */
  getLogs: (options: {
    level?: string
    limit?: number
    offset?: number
    startTime?: number
    endTime?: number
  }): Promise<{ data: LogData[]; total: number }> => {
    return window.database.getLogs(options)
  },

  /**
   * 清空所有日志
   * @returns {Promise<number>} 删除的记录数
   */
  clearAllLogs: (): Promise<number> => {
    return window.database.clearAllLogs()
  }
}

/**
 * 监听主进程发送到渲染进程的消息
 */
export const listenFromMain = {
  /**
   * 监听剪贴板数据
   * @param {function} callback - 回调函数
   */
  onClipboardUpdate: (callback: (clipboardState: ClipboardState[]) => void): void => {
    window.clipboard.setClipboardToRenderer(callback)
  },

  /**
   * 监听应用配置
   * @param {function} callback - 回调函数
   */
  onAppSettingUpdate: (callback: (setting: Setting) => void): void => {
    window.appConfig.getAppSetting(callback)
  },

  /**
   * 监听窗口ID
   * @param {function} callback - 回调函数
   */
  onWindowIdUpdate: (callback: (windowId: string) => void): void => {
    window.appConfig.setWindowId(callback)
  },

  /**
   * 监听系统主题变化
   * @param {function} callback - 回调函数
   */
  onNativeThemeUpdate: (callback: (isDarkMode: boolean) => void): void => {
    window.systemTheme.sendNativeThemeUpdated(callback)
  },

  /**
   * 监听显示主窗口
   * @param {function} callback - 回调函数
   */
  onShowMainWindow: (callback: () => void): void => {
    if (useConfigStore().getSetting.appBehavior.jumpToFirstPage) {
      window.mainWindow.showMainWindow(callback)
    }
  }
}
