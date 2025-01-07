<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Keyboard } from 'swiper/modules'
import VClipboardCard from "./card/index.vue"
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useSwiperStore } from '@renderer/store/useSwiperStore'
import { useClipboardStore } from '@renderer/store/useClipboardStore'

// 导入样式
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/keyboard'

// 使用组合式API优化store调用
const configStore = useConfigStore()
const swiperStore = useSwiperStore()
const clipboardStore = useClipboardStore()

// 抽离配置
const swiperParams = ref({
    keyboard: {
        enabled: true,
        onlyInViewport: false,
    },
    modules: [Pagination, Keyboard],
    initialSlide: 0,
    speed: 500
})

const swiperShowCount = ref(configStore.getSetting.swiperShowCount)

// 计算每页的卡片数据
const getPageCards = (pageIndex: number) => {
    const startIndex = pageIndex * swiperShowCount.value
    const endIndex = startIndex + swiperShowCount.value
    return clipboardStore.getClipboard.slice(startIndex, endIndex)
}

// 判断是否是第一个卡片
const isFirstCard = (swiperIndex: number, cardIndex: number): boolean => {
    return swiperIndex === 0 && cardIndex === 0
}

// 生成卡片的key
const getCardKey = (swiperIndex: number, cardIndex: number, timestamp: number): string => {
    return isFirstCard(swiperIndex, cardIndex) ? `card-${timestamp}` : `card-${swiperIndex}-${cardIndex}`
}
</script>

<template>
    <div class="swiper-container">
        <Swiper v-bind="swiperParams">
            <SwiperSlide v-for="swiperIndex in swiperStore.getSwiperLength" :key="`page-${swiperIndex}`">
                <div class="clipboard-list">
                    <div v-for="(card, cardIndex) in getPageCards(swiperIndex - 1)"
                        :key="getCardKey(swiperIndex - 1, cardIndex, card.timestamp)" class="card-wrapper" v-motion="isFirstCard(swiperIndex - 1, cardIndex) ? {
                            initial: { opacity: 0, y: -100 },
                            enter: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 15
                                }
                            }
                        } : {}">
                        <VClipboardCard :clipboardOptions="card" />
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<style scoped lang="scss">
.swiper-container {
    width: 100%;
    height: 100vh;
}

.swiper {
    height: 100%;

    .clipboard-list {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 5px;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
}

.card-wrapper {
    will-change: transform, opacity;
}
</style>
