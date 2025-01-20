<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'

import VClipboardCard from "./card/index.vue"
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useSwiperStore } from '@renderer/store/useSwiperStore'
import { useClipboardStore } from '@renderer/store/useClipboardStore'
import { Swiper as SwiperClass } from 'swiper/types'
import { useSwiper } from './hooks'

// 导入样式
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/keyboard'

const {
    swiperInstance,
    selectSwiper,
    floatingBallXY,
    floatingBallStyle,
    swiperParams,
    swiperShowCount,
    handleKeyPress,
    onSwiperInit,
    getPageCards,
    isFirstCard,
    getCardKey,
    getFloatingBallPosition
} = useSwiper()

const floatingBall = useTemplateRef('floatingBall')
// 使用组合式API优化store调用
const configStore = useConfigStore()
const swiperStore = useSwiperStore()
const clipboardStore = useClipboardStore()

watch(selectSwiper, () => {
    getFloatingBallPosition()
})

</script>

<template>
    <div class="swiper-container">
        <Swiper v-bind="swiperParams" @swiper="onSwiperInit" ref="swiperRef">
            <SwiperSlide v-for="swiperIndex in swiperStore.getSwiperLength" :key="`page-${swiperIndex}`">
                <div class="clipboard-list">
                    <div v-if="swiperIndex === 1" class="floating-ball" ref="floatingBall" :style="floatingBallStyle">
                    </div>

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
    position: relative;
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

.floating-ball {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--swiper-pagination-color);
    z-index: 10;
    pointer-events: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

    /* 使用 CSS transform 进行位置移动 */
    transform: translate3d(var(--ball-x, 275px), var(--ball-y, 5px), 0);

    /* 添加平滑过渡 */
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    /* 使用 will-change 提示浏览器优化 */
    will-change: transform;

    /* 强制开启硬件加速 */
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

/* 可选：添加悬浮效果 */
@media (hover: hover) {
    .floating-ball::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: 50%;
        background: var(--swiper-pagination-color);
        opacity: 0.2;
        z-index: -1;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.2;
    }

    50% {
        transform: scale(1.5);
        opacity: 0;
    }
}
</style>
