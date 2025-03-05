import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    clipboard: {
      setClipboardToRenderer: (callback: (clipboardState: ClipboardState[]) => void) => void
      changeClipboard: (clipboardState: ClipboardState) => void
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
  }
}
