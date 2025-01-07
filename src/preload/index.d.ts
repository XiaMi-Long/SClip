import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    clipboard: {
      setClipboard: (callback: (clipboardState: ClipboardState[]) => void) => void
    },
    setting: {
      setSetting: (callback: (setting: Setting) => void) => void
    }
  }

}
