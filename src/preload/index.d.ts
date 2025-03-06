// 添加LogData接口定义
import { ElectronAPI } from '@electron-toolkit/preload'

interface LogData {
  id?: number
  level: 'info' | 'warn' | 'error' | 'debug'
  module: string
  message: string
  data?: string
  created_at: number
}

declare global {
  interface Window {
    clipboard: {
      setClipboardToRenderer: (callback: (clipboardState: ClipboardState[]) => void) => void
      writeClipboard: (clipboardState: ClipboardState) => void
      updateClipboardItem: (clipboardState: ClipboardState) => void
      deleteClipboardItem: (clipboardData: ClipboardState) => void
    }
    titleBar: {
      minimize: () => void
      maximize: () => void
      close: () => void
    }
    appConfig: {
      getAppSetting: (callback: (setting: Setting) => void) => void
      setWindowId: (callback: (windowId: string) => void) => void
    }
    browserWindow: {
      openSetting: () => void
    }
    systemTheme: {
      getNativeThemeShouldUseDarkColors: () => Promise<boolean>
      sendNativeThemeUpdated: (callback: (isDarkMode: boolean) => void) => void
      updateConfigSetting: (setting: Setting, windowId: string) => void
    }
    database: {
      /**
       * 获取日志记录
       * @param options 查询选项
       * @returns 日志数据和总数
       */
      getLogs: (options: {
        level?: string
        limit?: number
        offset?: number
        startTime?: number
        endTime?: number
      }) => Promise<{ data: LogData[]; total: number }>

      /**
       * 清空所有日志
       * @returns 删除的记录数
       */
      clearAllLogs: () => Promise<number>
    }
  }
}
