import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
    state: () => ({
        swiperConfig: {
            /**
             * 每页显示的swiper数量
             */
            swiperShowCount: 3,
        }
    }),
    getters: {
        /**
         * 获取swiper配置
         * @returns {Object} swiper配置
         */
        getSwiperConfig() {
            return this.swiperConfig
        }
    }
})