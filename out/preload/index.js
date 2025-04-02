"use strict";
const electron = require("electron");
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("clipboard", {
      /**
       * 发送剪贴板文本到渲染进程
       * @param {function} callback - 回调函数
       */
      setClipboardToRenderer: (callback) => electron.ipcRenderer.on(
        "clipboard:set-clipboard-to-render",
        (_event, clipboardState) => callback(clipboardState)
      ),
      /**
       * 获取剪贴板文本-渲染进程通知主进程准备复制剪贴板的内容到用户输入区域
       * @param {ClipboardState} clipboardState - 剪贴板数据
       */
      writeClipboard: (clipboardState) => electron.ipcRenderer.send("clipboard:write-clipboard", clipboardState),
      /**
       * 更新剪贴板数据
       * @param {ClipboardState} clipboardState - 剪贴板数据
       */
      updateClipboardItem: (clipboardState) => electron.ipcRenderer.send("clipboard:update-clipboard-item", clipboardState),
      /**
       * 删除剪贴板数据
       * @param {ClipboardState} clipboardData - 剪贴板数据
       */
      deleteClipboardItem: (clipboardData) => {
        electron.ipcRenderer.send("clipboard:delete-clipboard-item", clipboardData);
      }
    });
    electron.contextBridge.exposeInMainWorld("appConfig", {
      /**
       * 获取应用配置
       * @param {function} callback - 回调函数
       */
      getAppSetting: (callback) => electron.ipcRenderer.on("appConfig:get-app-setting", (event, setting) => callback(setting)),
      /**
       * 设置窗口ID
       * @param {function} callback - 回调函数
       */
      setWindowId: (callback) => electron.ipcRenderer.on("appConfig:set-window-id", (event, windowId) => callback(windowId)),
      /**
       * 更新应用配置
       */
      updateConfigSetting: (setting, windowId) => electron.ipcRenderer.send("appConfig:update-config-setting", setting, windowId)
    });
    electron.contextBridge.exposeInMainWorld("browserWindow", {
      /**
       * 打开设置窗口
       */
      openSetting: () => electron.ipcRenderer.send("browserWindow:open-setting")
    });
    electron.contextBridge.exposeInMainWorld("titleBar", {
      /**
       * 最小化窗口
       */
      minimize: () => electron.ipcRenderer.send("titleBar:window-minimize"),
      /**
       * 最大化窗口
       */
      maximize: () => electron.ipcRenderer.send("titleBar:window-maximize"),
      /**
       * 关闭窗口
       */
      close: () => electron.ipcRenderer.send("titleBar:window-close")
    });
    electron.contextBridge.exposeInMainWorld("systemTheme", {
      /**
       * 获取当前系统主题
       */
      getNativeThemeShouldUseDarkColors: () => electron.ipcRenderer.invoke("systemTheme:get-native-theme-shouldUseDarkColors"),
      /**
       * 发送系统主题变化事件
       */
      sendNativeThemeUpdated: (callback) => electron.ipcRenderer.on(
        "systemTheme:native-theme-updated",
        (event, isDarkMode) => callback(isDarkMode)
      )
    });
    electron.contextBridge.exposeInMainWorld("database", {
      /**
       * 获取日志记录
       * @param options 查询选项
       * @returns 日志数据和总数
       */
      getLogs: (options) => electron.ipcRenderer.invoke("database:get-logs", options),
      /**
       * 清空所有日志
       * @returns 删除的记录数
       */
      clearAllLogs: () => electron.ipcRenderer.invoke("database:clear-all-logs")
    });
    electron.contextBridge.exposeInMainWorld("mainWindow", {
      /**
       * 显示主窗口
       */
      showMainWindow: (callback) => electron.ipcRenderer.on("mainWindow:show-main-window", () => callback()),
      /**
       * 设置是否固定窗口
       * @param {boolean} isFixedWindow - 是否固定窗口
       * @param {string} windowId - 窗口ID
       */
      setIsFixedWindow: (isFixedWindow, windowId) => electron.ipcRenderer.send("mainWindow:set-is-fixed-window", isFixedWindow, windowId)
    });
  } catch (error) {
    console.error(error);
  }
}
