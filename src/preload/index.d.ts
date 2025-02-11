import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    clipboard: {
      setClipboardToRenderer: (callback: (clipboardState: ClipboardState[]) => void) => void,
      changeClipboard: (clipboardState: ClipboardState) => void,
      updateClipboardItem: (clipboardState: ClipboardState) => void
    },
    setting: {
      setSettingToRender: (callback: (setting: Setting) => void) => void
    }
  }

}
