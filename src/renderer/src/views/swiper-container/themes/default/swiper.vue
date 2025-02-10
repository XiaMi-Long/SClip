<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import VClipboardCard from "./card/index.vue"
import { useSwiper } from './hooks'

// 导入样式
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/keyboard'

const { swiperServices, paginatedClipboardList, cardMotion } = useSwiper()

console.log(paginatedClipboardList.value);

</script>

<template>
    <div class="swiper-container">
        <div v-if="paginatedClipboardList.length > 0" class="floating-ball" ref="floatingBall"
            :style="swiperServices.floatingBallStyle">
        </div>
        <Swiper v-bind="swiperServices.params" @swiper="swiperServices.onSwiperInit" ref="swiperRef">

            <SwiperSlide v-for="(pageItems, pageIndex) in paginatedClipboardList" :key="`page-${pageIndex}`">
                <div class="clipboard-list">
                    <div v-for="(card, cardIndex) in pageItems" :key="card.contentHash + 'key' + cardIndex" class="card-wrapper">
                        <VClipboardCard :clipboardOptions="card" v-motion="cardMotion(cardIndex)" />
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
