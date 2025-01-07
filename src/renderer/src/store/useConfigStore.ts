import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
    state: () => ({
        setting: {
            isShowHtmlClipboard: false,
            isGlobalShortcut: true,
            isSwipeClipboardCard: true,
            swiperShowCount: 3,
        }
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
        setSetting(setting: Setting) {
            this.setting = setting
        }
    }
})