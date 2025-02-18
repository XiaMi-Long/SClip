import { defineStore } from 'pinia'

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
     * 设置窗口ID
     * @param {string} windowId 窗口ID
     */
    setWindowId(windowId: string) {
      this.windowId = windowId
    }
  }
})
