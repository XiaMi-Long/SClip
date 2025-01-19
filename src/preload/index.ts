import { contextBridge, ipcRenderer } from 'electron'


if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('clipboard', {
      // 设置剪贴板文本
      setClipboard: (callback) => ipcRenderer.on('set-clipboard', (event, clipboardState: ClipboardState[]) => callback(clipboardState)),
      // 获取剪贴板文本
      getClipboard: (clipboardState: ClipboardState) => ipcRenderer.send('paste-selected-text', clipboardState)
    })
    contextBridge.exposeInMainWorld('setting', {
      // 获取全局配置
      setSetting: (callback) => ipcRenderer.on('set-setting', (event, setting: Setting) => callback(setting))
    })
  } catch (error) {
    console.error(error)
  }
}
