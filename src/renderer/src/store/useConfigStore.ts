import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
    state: () => ({
        setting: {
            applicationTheme: 'light',
            clipboardTheme: 'default',
            rtfTextZoom: 1
        } as Setting
    }),
    getters: {
        /**
         * 获取设置
         * @returns {Setting} 设置
         */
        getSetting(): Setting {
            return this.setting
        }
    },
    actions: {
        /**
         * 设置设置
         * @param {Setting} setting 设置
         */
        setSettingToRender(setting: Setting) {
            this.setting = setting
        }
    }
})