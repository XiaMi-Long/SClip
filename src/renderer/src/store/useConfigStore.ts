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
        getSetting(): Setting {
            return this.setting
        }
    },
    actions: {
        setSetting(setting: Setting) {
            this.setting = setting
        }
    }
})