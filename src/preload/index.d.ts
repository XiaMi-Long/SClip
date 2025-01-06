import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    clipboard: {
      getClipboard: (callback: (lastCopy: any) => void) => void
    },
    setting: {
      getSetting: (callback: (setting: any) => void) => void
    }
  }

}
