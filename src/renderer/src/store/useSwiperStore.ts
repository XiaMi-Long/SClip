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
        getSwiperLength() {
            const clipboardStore = useClipboardStore()
            this.swiperLength = clipboardStore.getClipboardLength
            return this.swiperLength
        },

    }
})