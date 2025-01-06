import { contextBridge, ipcRenderer } from 'electron'


if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('clipboard', {
      // 获取剪贴板文本
      getClipboard: (callback) => ipcRenderer.on('get-clipboard', (event, lastCopy) => callback(lastCopy))
    })
    contextBridge.exposeInMainWorld('setting', {
      // 获取全局配置
      getSetting: (callback) => ipcRenderer.on('get-setting', (event, lastCopy) => callback(lastCopy))
    })
  } catch (error) {
    console.error(error)
  }
}
