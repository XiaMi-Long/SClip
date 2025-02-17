import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    clipboard: {
      setClipboardToRenderer: (callback: (clipboardState: ClipboardState[]) => void) => void,
      changeClipboard: (clipboardState: ClipboardState) => void,
      updateClipboardItem: (clipboardState: ClipboardState) => void,
      deleteClipboardItem: (clipboardData: ClipboardState) => void
    },
    titleBar: {
      minimize: () => void
      maximize: () => void
      close: () => void
    },
    appConfig: {
      getAppSetting: (callback: (setting: Setting) => void) => void
    },
    browserWindow: {
      openSetting: () => void
    }
  }

}
