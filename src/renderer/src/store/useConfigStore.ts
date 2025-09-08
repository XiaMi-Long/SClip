import { defineStore } from 'pinia'
import { switchThemeMode, updateAccentColor } from '../util/system.theme'
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
     * 设置应用强调色
     * @param {string} color 强调色的十六进制颜色代码
     * @description 设置应用的强调色并应用相应的样式
     */
    setApplicationPrimaryColor(color: string) {
      this.setting.applicationPrimaryColor = color
      // 更新应用强调色
      updateAccentColor(color)
      // 更新配置
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
     * 设置是否启用显示主窗口并回到首页
     * @param {boolean} enableHomeOnShowMainWindow 是否启用显示主窗口并回到首页
     * @description 设置是否启用显示主窗口并回到首页，并更新应用配置
     */
    setJumpToFirstPage(jumpToFirstPage: boolean) {
      this.setting.appBehavior.jumpToFirstPage = jumpToFirstPage
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置历史记录限制
     * @param {number} historyLimit 历史记录限制
     * @description 设置历史记录限制，并更新应用配置
     */
    setHistoryLimit(historyLimit: number) {
      this.setting.appBehavior.historyLimit = historyLimit
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置是否固定窗口
     * @param {boolean} isFixedWindow 是否固定窗口
     * @description 设置是否固定窗口，并更新应用配置
     */
    setIsFixedWindow(isFixedWindow: boolean) {
      this.setting.appBehavior.isFixedWindow = isFixedWindow
      sendToMain.setIsFixedWindow(isFixedWindow)
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置是否显示类型标识
     * @param {boolean} showTypeIndicator 是否显示类型标识
     * @param {boolean} showLongContentTip 是否显示长内容提示
     * @description 设置是否显示类型标识，并更新应用配置
     */
    setShowTypeIndicator({
      showTypeIndicator,
      showLongContentTip
    }: {
      showTypeIndicator: boolean
      showLongContentTip: boolean
    }) {
      console.log(showTypeIndicator, showLongContentTip)
      this.setting.appBehavior.showTypeIndicator = showTypeIndicator
      this.setting.appBehavior.showLongContentTip = showLongContentTip
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置是否启用文本样式
     * @param {boolean} enableTextStyle 是否启用文本样式
     * @param {number} textStyleZoom 文本样式缩放比例
     * @param {number} rtfTextZoom RTF文本缩放比例
     * @description 设置文本样式相关配置，并更新应用配置
     */
    setEnableTextStyle({
      enableTextStyle,
      textStyleZoom,
      rtfTextZoom,
      longTextLimit
    }: {
      enableTextStyle: boolean
      textStyleZoom?: number
      rtfTextZoom?: number
      longTextLimit?: number
    }) {
      this.setting.clipboard.enableTextStyle = enableTextStyle

      if (textStyleZoom !== undefined) {
        this.setting.clipboard.textStyleZoom = textStyleZoom
      }

      if (rtfTextZoom !== undefined) {
        this.setting.clipboard.rtfTextZoom = rtfTextZoom
      }

      if (longTextLimit !== undefined) {
        this.setting.clipboard.longTextLimit = longTextLimit
      }

      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置是否强制使用Mac状态栏
     * @param {boolean} forceMacStatusBar 是否强制使用Mac状态栏
     * @description 设置是否在Windows系统上使用Mac风格的状态栏，并更新应用配置
     */
    setForceMacStatusBar(forceMacStatusBar: boolean) {
      // 如果是Mac系统，则不设置
      if (this.setting.system?.isMac) {
        return
      }
      // 直接设置到 setting 对象上，而不是 appBehavior 子对象
      this.setting.forceMacStatusBar = forceMacStatusBar
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置应用语言
     * @param {string} language 应用语言，可选值为 'zh-CN' 或 'en-US'
     * @description 设置应用语言，并更新应用配置
     */
    setAppLanguage(language: 'zh-CN' | 'en-US') {
      this.setting.appLanguage = language
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
    },

    /**
     * 设置是否启用数据去重
     * @param {boolean} endenableDataDeduplication 是否启用数据去重
     * @description 设置是否启用数据去重，并更新应用配置
     */
    setEndenableDataDeduplication(endenableDataDeduplication: boolean) {
      this.setting.enableDataDeduplication = endenableDataDeduplication
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置卡片样式
     * @param {string} cardStyle 卡片样式
     * @description 设置卡片样式，并更新应用配置
     */
    setCardStyle(cardStyle: 'default' | 'effects') {
      this.setting.currentCardStyle = cardStyle
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置层叠卡片背景颜色
     * @param {string} color 选择颜色
     * @description 设置层叠卡片背景颜色,并更新应用配置
     */
    setCardStyleBgColor(color: string) {
      this.setting.clipboardCardStyle.effects.cardBgColor = color
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    },

    /**
     * 设置是否显示教程
     * @param {boolean} showTutorial 是否显示教程
     * @description 设置是否显示教程,并更新应用配置
     */
    setShowTutorial(showTutorial: boolean) {
      this.setting.showTutorial = showTutorial
      sendToMain.updateConfigSetting(toRaw(this.setting), this.windowId)
    }
  }
})
