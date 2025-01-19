<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Keyboard } from 'swiper/modules'
import VClipboardCard from "./card/index.vue"
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useSwiperStore } from '@renderer/store/useSwiperStore'
import { useClipboardStore } from '@renderer/store/useClipboardStore'
import { Swiper as SwiperClass } from 'swiper/types'

// 导入样式
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/keyboard'


const swiperInstance = ref<SwiperClass | null>(null)
// 当前选中的swiper
const selectSwiper = ref(0)
const floatingBallXY = ref({
    x: 275,
    y: 5
})
const floatingBall = useTemplateRef('floatingBall')
// 使用组合式API优化store调用
const configStore = useConfigStore()
const swiperStore = useSwiperStore()
const clipboardStore = useClipboardStore()
const swiperShowCount = ref(configStore.getSetting.swiperShowCount)

// 键盘事件处理函数
const handleKeyPress = (_swiper: SwiperClass, keyCode: number) => {
    console.log('Key pressed:', keyCode)
    switch (keyCode) {
        case 39:
            handleKeyPressRight()
            break;
        case 37:
            handleKeyPressLeft()
            break;
        case 38:
            handleKeyPressUp()
            break;
        case 40:
            handleKeyPressDown()
            break;
        case 87:
            handleKeyPressUp()
            break;
        case 83:
            handleKeyPressDown()
            break;
        case 65:
            if (swiperInstance.value) {
                swiperInstance.value.slidePrev(500)
            }
            handleKeyPressLeft()
            break;
        case 68:
            if (swiperInstance.value) {
                swiperInstance.value.slideNext(500)
            }
            handleKeyPressRight()
            break;
        case 32:
            // 空格选中
            window.clipboard.getClipboard({
                content: "123",
                timestamp: 123,
                type: "text",
                text: "123",
                meta: "123",
                time: 123
            })
            break;
        case 13:
            // 空格选中
            window.clipboard.getClipboard({
                content: "123",
                timestamp: 123,
                type: "text",
                text: "123",
                meta: "123",
                time: 123
            })
            break;
    }
    console.log("selectSwiper：", selectSwiper.value);

}

const floatingBallStyle = computed(() => {
    return {
        '--ball-x': `${floatingBallXY.value.x}px`,
        '--ball-y': `${floatingBallXY.value.y}px`
    }
})

const getFloatingBallPosition = () => {
    if (swiperInstance.value === null) {
        floatingBallXY.value = {
            x: 275,
            y: 5
        }
        return
    }

    const swiperActiveIndex = swiperInstance.value.activeIndex
    console.log("swiperActiveIndex：", swiperActiveIndex);
    floatingBallXY.value.x = 275 + 300 * swiperActiveIndex
    floatingBallXY.value.y = 5

    if (selectSwiper.value === 1) {
        floatingBallXY.value.y = 140 + 5
    }
    if (selectSwiper.value === 2) {
        floatingBallXY.value.y = 140 + 140 + 5
    }

}
// 右键
const handleKeyPressRight = () => {
    console.log('Right key pressed');
}
// 左键
const handleKeyPressLeft = () => {
    console.log('Left key pressed');
}
// 上键
const handleKeyPressUp = () => {
    if (selectSwiper.value > 0) {
        selectSwiper.value--
    } else {
        // 如果已经是第一个，则跳到最后一个
        selectSwiper.value = swiperShowCount.value - 1
    }
}
// 下键
const handleKeyPressDown = () => {
    if (selectSwiper.value < swiperShowCount.value - 1) {
        selectSwiper.value++
    } else {
        // 如果已经是最后一个，则跳到第一个
        selectSwiper.value = 0
    }
}

// 抽离配置
const swiperParams = ref({
    keyboard: {
        enabled: true,
        onlyInViewport: false,
    },
    pagination: {
        enabled: true,
        dynamicBullets: true,
        type: "bullets" as const
    },
    modules: [Pagination, Keyboard],
    initialSlide: 0,
    speed: 500
})

// 使用 onSwiper 来获取 Swiper 实例
const onSwiperInit = (swiper: any) => {
    swiperInstance.value = swiper
    // 添加键盘事件监听
    swiper.on('keyPress', handleKeyPress)
    swiper.on('activeIndexChange', () => {
        console.log("activeIndexChange");
        getFloatingBallPosition()
    })
}

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
