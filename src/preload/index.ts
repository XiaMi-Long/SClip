import { contextBridge, ipcRenderer } from 'electron'


if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('clipboard', {
      // 设置剪贴板文本
      setClipboardToRenderer: (callback) => ipcRenderer.on('set-clipboard-to-render', (_event, clipboardState: ClipboardState[]) => callback(clipboardState)),
      // 获取剪贴板文本
      changeClipboard: (clipboardState: ClipboardState) => ipcRenderer.send('change-clipboard', clipboardState)
    })
    contextBridge.exposeInMainWorld('setting', {
      // 获取全局配置
      setSettingToRender: (callback) => ipcRenderer.on('set-setting', (event, setting: Setting) => callback(setting))
    })
  } catch (error) {
    console.error(error)
  }
}
