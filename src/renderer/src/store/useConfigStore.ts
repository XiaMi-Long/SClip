import { defineStore } from 'pinia'
import { switchThemeMode } from '../util/system.theme'
import { toRaw } from 'vue'
import { invokeMain, sendToMain } from '../util/ipc.renderer.service'

export const useConfigStore = defineStore('config', {
  state: () => ({
    setting: {} as Setting,
    windowId: ''
  }),
  getters: {
    /**
     * 获取应用配置
     * @returns {AppConfig} 应用配置
     */
    getSetting(): Setting {
      return this.setting
    },

    /**
     * 获取窗口ID
     * @returns {string} 窗口ID
     */
    getWindowId(): string {
      return this.windowId
    }
  },
  actions: {
    /**
     * 设置应用配置
     * @param {AppConfig} appConfig 应用配置
     */
    setSetting(setting: Setting) {
      this.setting = setting
    },

    /**
     * 设置应用主题
     * @param {ThemeMode} theme 应用主题模式，可选值为 'dark'、'light' 或 'system'
     * @description 设置应用的主题模式并应用相应的样式
     * @implementation
     * 1. 更新 setting.applicationTheme 为当前选择的主题模式
     * 2. 如果选择的是系统主题（'system'）：
     *    - 调用 getNativeThemeShouldUseDarkColors 获取系统当前主题
     *    - 根据系统主题是否为深色调用 switchThemeMode 切换到对应主题（'dark'或'light'）
     * 3. 如果选择的是明确的主题（'dark'或'light'）：
     *    - 直接调用 switchThemeMode 应用选择的主题
     * @returns {Promise<void>} 异步函数，无返回值
     */
    async setApplicationTheme(theme: ThemeMode) {
      this.setting.applicationTheme = theme
      if (theme === 'system') {
        const isDark = await invokeMain.getNativeThemeShouldUseDarkColors()
        switchThemeMode(isDark ? 'dark' : 'light')
      } else {
        switchThemeMode(theme)
      }
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置是否覆盖Windows系统快捷键
     * @param {boolean} isWindowShortcutOverridden 是否覆盖Windows系统快捷键
     * @description 设置是否覆盖Windows系统快捷键，并更新应用配置
     */
    setShortcut(keys: string) {
      if (this.setting.system.isMac) {
        this.setting.shortcut.appVisibleShortcut.mac = keys
      } else {
        this.setting.shortcut.appVisibleShortcut.windows = keys
      }
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置图片显示模式
     * @param {string} mode 图片显示模式，可选值为 'auto'、'contain' 或 'cover'
     * @description 设置图片显示模式，并更新应用配置
     */
    setImageSettings({
      displayMode,
      enableAnimation
    }: {
      displayMode?: 'auto' | 'contain' | 'cover'
      enableAnimation?: boolean
    }) {
      if (displayMode !== undefined) {
        this.setting.imageSettings.displayMode = displayMode
      }
      if (enableAnimation !== undefined) {
        this.setting.imageSettings.enableAnimation = enableAnimation
      }

      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置窗口ID
     * @param {string} windowId 窗口唯一标识ID
     * @description 设置当前窗口的唯一标识ID，用于多窗口场景下的窗口识别与管理
     * @implementation
     * 1. 将传入的 windowId 赋值给 store 中的 windowId 状态
     * 2. 此 ID 可通过 getWindowId 方法获取，用于窗口间通信或特定窗口的操作
     */
    setWindowId(windowId: string) {
      this.windowId = windowId
    }
  }
})
