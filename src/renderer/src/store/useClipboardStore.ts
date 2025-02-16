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
    },
    actions: {
        /**
         * 设置剪贴板列表
         * @param {Array} list 剪贴板列表
         */
        pushClipboard(list: ClipboardState[]): void {
            console.log(list);
            this.clipboardList.push(...list)
        },

        /**
         * 删除剪贴板列表
         * @param {number} index 剪贴板列表索引
         */
        removeClipboardItem(index: number) {
            this.clipboardList.splice(index, 1)
        }
    }
})
