import { contextBridge, ipcRenderer } from 'electron'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('clipboard', {
      /**
       * 发送剪贴板文本到渲染进程
       * @param {function} callback - 回调函数
       */
      setClipboardToRenderer: (callback) =>
        ipcRenderer.on('set-clipboard-to-render', (_event, clipboardState: ClipboardState[]) =>
          callback(clipboardState)
        ),

      /**
       * 获取剪贴板文本-渲染进程通知主进程准备复制剪贴板的内容到用户输入区域
       * @param {ClipboardState} clipboardState - 剪贴板数据
       */
      writeClipboard: (clipboardState: ClipboardState) =>
        ipcRenderer.send('write-clipboard', clipboardState),

      /**
       * 更新剪贴板数据
       * @param {ClipboardState} clipboardState - 剪贴板数据
       */
      updateClipboardItem: (clipboardState: ClipboardState) =>
        ipcRenderer.send('update-clipboard-item', clipboardState),

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
      getAppSetting: (callback) =>
        ipcRenderer.on('get-app-setting', (event, setting: Setting) => callback(setting)),

      /**
       * 设置窗口ID
       * @param {function} callback - 回调函数
       */
      setWindowId: (callback) =>
        ipcRenderer.on('set-window-id', (event, windowId: string) => callback(windowId))
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

    contextBridge.exposeInMainWorld('systemTheme', {
      /**
       * 获取当前系统主题
       */
      getNativeThemeShouldUseDarkColors: () =>
        ipcRenderer.invoke('get-native-theme-shouldUseDarkColors'),

      /**
       * 发送系统主题变化事件
       */
      sendNativeThemeUpdated: (callback) =>
        ipcRenderer.on('native-theme-updated', (event, isDarkMode: boolean) =>
          callback(isDarkMode)
        ),

      /**
       * 更新应用配置
       */
      updateConfigSetting: (setting: Setting, windowId: string) =>
        ipcRenderer.send('update-config-setting', setting, windowId)
    })
  } catch (error) {
    console.error(error)
  }
}
