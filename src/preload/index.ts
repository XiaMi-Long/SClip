import { contextBridge, ipcRenderer } from 'electron'


if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('clipboard', {
      // 发送剪贴板文本
      setClipboardToRenderer: (callback) => ipcRenderer.on('set-clipboard-to-render', (_event, clipboardState: ClipboardState[]) => callback(clipboardState)),
      // 获取剪贴板文本
      changeClipboard: (clipboardState: ClipboardState) => ipcRenderer.send('change-clipboard', clipboardState),
      // 更新剪贴板数据
      updateClipboardItem: (clipboardState: ClipboardState) => ipcRenderer.send('update-clipboard-item', clipboardState),
      // 删除剪贴板数据
      deleteClipboardItem: (clipboardData: ClipboardState) => {
        ipcRenderer.send('delete-clipboard-item', clipboardData)
      }
    })
    contextBridge.exposeInMainWorld('setting', {
      // 获取全局配置
      setSettingToRender: (callback) => ipcRenderer.on('set-setting', (event, setting: Setting) => callback(setting))
    })
  } catch (error) {
    console.error(error)
  }
}
