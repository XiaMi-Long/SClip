import { defineStore } from 'pinia'
import { useClipboardStore } from './useClipboardStore'

export const useSwiperStore = defineStore('swiper', {
    state: () => ({
        /**
         * swiper长度
         */
        swiperLength: 0
    }),
    getters: {
        /**
         * 获取swiper长度
         * @returns {number} swiper长度
         */
        getSwiperLength(): number {
            const clipboardStore = useClipboardStore()
            this.swiperLength = clipboardStore.getClipboardLength
            // 如果swiper长度为0，则设置为1
            if (this.swiperLength === 0) {
                this.swiperLength = 1
            }
            return this.swiperLength
        },

    }
})