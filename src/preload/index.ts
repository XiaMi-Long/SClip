import { contextBridge, ipcRenderer } from 'electron'


if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('clipboard', {

      /**
       * 发送剪贴板文本到渲染进程
       * @param {function} callback - 回调函数
       */
      setClipboardToRenderer: (callback) => ipcRenderer.on('set-clipboard-to-render', (_event, clipboardState: ClipboardState[]) => callback(clipboardState)),

      /**
       * 获取剪贴板文本
       * @param {function} callback - 回调函数
       */
      getClipboard: (callback) => ipcRenderer.on('get-clipboard', (_event, clipboardState: ClipboardState[]) => callback(clipboardState)),

      /**
       * 更新剪贴板数据
       * @param {ClipboardState} clipboardState - 剪贴板数据
       */
      updateClipboardItem: (clipboardState: ClipboardState) => ipcRenderer.send('update-clipboard-item', clipboardState),

      /**
       * 删除剪贴板数据
       * @param {ClipboardState} clipboardData - 剪贴板数据
       */
      deleteClipboardItem: (clipboardData: ClipboardState) => {
        ipcRenderer.send('delete-clipboard-item', clipboardData)
      }
    })

    contextBridge.exposeInMainWorld('appConfig', {
      /**
       * 获取应用配置
       * @param {function} callback - 回调函数
       */
      getAppSetting: (callback) => ipcRenderer.on('get-app-setting', (event, setting: Setting) => callback(setting))
    })

    contextBridge.exposeInMainWorld('browserWindow', {
      /**
       * 打开设置窗口
       */
      openSetting: () => ipcRenderer.send('open-setting')
    })

    contextBridge.exposeInMainWorld('titleBar', {
      /**
       * 最小化窗口
       */
      minimize: () => ipcRenderer.send('window-minimize'),

      /**
       * 最大化窗口
       */
      maximize: () => ipcRenderer.send('window-maximize'),

      /**
       * 关闭窗口
       */
      close: () => ipcRenderer.send('window-close')
    })

    contextBridge.exposeInMainWorld('ipc', {
      /**
       * 向主进程发送消息
       * @param {string} channel - 通信频道名称
       * @param {any} data - 要发送的数据
       */
      send: (channel: string, data: any) => ipcRenderer.send(channel, data)
    })
  } catch (error) {
    console.error(error)
  }
}
