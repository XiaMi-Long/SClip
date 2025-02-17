import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
    state: () => ({
        setting: {} as Setting
    }),
    getters: {
        /**
         * 获取应用配置
         * @returns {AppConfig} 应用配置
         */
        getSetting(): Setting {
            return this.setting
        }
    },
    actions: {
        /**
         * 设置应用配置
         * @param {AppConfig} appConfig 应用配置
         */
        setSetting(setting: Setting) {
            this.setting = setting
        }
    }
})