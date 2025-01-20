import { useConfigStore } from './useConfigStore'
import { defineStore } from 'pinia'

export const useClipboardStore = defineStore('clipboard', {
    state: () => ({
        /**
         * 剪贴板列表
         */
        clipboardList: [] as ClipboardState[]
    }),
    getters: {
        /**
         * 获取剪贴板列表
         * @returns {Array} 剪贴板列表
         */
        getClipboard(): ClipboardState[] {
            return this.clipboardList
        },

        /**
         * 获取剪贴板列表长度
         * @returns {number} 剪贴板列表长度
         */
        getClipboardLength(): number {
            const configStore = useConfigStore()
            const systemSetting = configStore.getSetting
            return Math.ceil(this.clipboardList.length / systemSetting.swiperShowCount)
        }
    },
    actions: {
        /**
         * 设置剪贴板列表
         * @param {Array} list 剪贴板列表
         */
        pushClipboard(list: ClipboardState[]): void {
            this.clipboardList.unshift(...list)
        }
    }
})
