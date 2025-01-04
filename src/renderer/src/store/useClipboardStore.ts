import { useConfigStore } from './useConfigStore'
import { defineStore } from 'pinia'


export const useClipboardStore = defineStore('clipboard', {
    state: () => ({
        /**
         * 剪贴板列表
         */
        clipboardList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }),
    getters: {
        /**
         * 获取剪贴板列表
         * @returns {Array} 剪贴板列表
         */
        getClipboard() {
            return this.clipboardList
        },

        /**
         * 获取剪贴板列表长度
         * @returns {number} 剪贴板列表长度
         */
        getClipboardLength() {
            const configStore = useConfigStore()
            const swiperConfig = configStore.getSwiperConfig
            return Math.ceil(this.clipboardList.length / swiperConfig.swiperShowCount)
        }
    }
})