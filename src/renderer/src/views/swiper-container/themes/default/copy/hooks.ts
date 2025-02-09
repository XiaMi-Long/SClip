import { ref, computed, watch } from 'vue'
import { Swiper as SwiperClass } from 'swiper/types'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useSwiperStore } from '@renderer/store/useSwiperStore'
import { Pagination, Keyboard } from 'swiper/modules'
import { useClipboardStore } from '@renderer/store/useClipboardStore'
import robot from 'robotjs'


export function useSwiper() {
    const swiperInstance = ref<SwiperClass | null>(null)
    const selectSwiper = ref(0)
    const floatingBallXY = ref({
        x: 275,
        y: 5
    })

    const configStore = useConfigStore()
    const swiperStore = useSwiperStore()
    const clipboardStore = useClipboardStore()
    const swiperShowCount = ref(configStore.getSetting.swiperShowCount)

    // 计算浮动球样式
    const floatingBallStyle = computed(() => {
        return {
            '--ball-x': `${floatingBallXY.value.x}px`,
            '--ball-y': `${floatingBallXY.value.y}px`
        }
    })

    // 获取浮动球位置
    const getFloatingBallPosition = () => {
        if (swiperInstance.value === null) {
            floatingBallXY.value = {
                x: 275,
                y: 5
            }
            return
        }

        const swiperActiveIndex = swiperInstance.value.activeIndex
        floatingBallXY.value.x = 275 + 300 * swiperActiveIndex
        floatingBallXY.value.y = 5

        if (selectSwiper.value === 1) {
            floatingBallXY.value.y = 140 + 5
        }
        if (selectSwiper.value === 2) {
            floatingBallXY.value.y = 140 + 140 + 5
        }
    }

    // 键盘事件处理
    const handleKeyPress = (_swiper: SwiperClass, keyCode: number) => {
        switch (keyCode) {
            case 39:
                handleKeyPressRight()
                break
            case 37:
                handleKeyPressLeft()
                break
            case 38:
                handleKeyPressUp()
                break
            case 40:
                handleKeyPressDown()
                break
            case 87:
                handleKeyPressUp()
                break
            case 83:
                handleKeyPressDown()
                break
            case 65:
                if (swiperInstance.value) {
                    swiperInstance.value.slidePrev(500)
                }
                handleKeyPressLeft()
                break
            case 68:
                if (swiperInstance.value) {
                    swiperInstance.value.slideNext(500)
                }
                handleKeyPressRight()
                break
            case 32:

                break
            case 13:
                // 回车
                // 根据目前选择的第几项，获取对应的剪贴板数据
                const clipboardData = getPageCards(selectSwiper.value)
                console.log(clipboardData);

                break
        }
    }

    // 方向键处理函数
    const handleKeyPressRight = () => {
        console.log('Right key pressed')
    }

    const handleKeyPressLeft = () => {
        console.log('Left key pressed')
    }

    const handleKeyPressUp = () => {
        if (selectSwiper.value > 0) {
            selectSwiper.value--
        } else {
            selectSwiper.value = swiperShowCount.value - 1
        }
    }

    const handleKeyPressDown = () => {
        if (selectSwiper.value < swiperShowCount.value - 1) {
            selectSwiper.value++
        } else {
            selectSwiper.value = 0
        }
    }

    // Swiper 配置
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

    // Swiper 初始化回调
    const onSwiperInit = (swiper: SwiperClass) => {
        swiperInstance.value = swiper
        swiper.on('keyPress', handleKeyPress as any)
        swiper.on('activeIndexChange', () => {
            getFloatingBallPosition()
        })
    }

    // 计算每页卡片数据
    const getPageCards = (pageIndex: number) => {
        const startIndex = pageIndex * swiperShowCount.value
        const endIndex = startIndex + swiperShowCount.value
        return clipboardStore.changeClipboard.slice(startIndex, endIndex)
    }

    // 判断是否是第一个卡片
    const isFirstCard = (swiperIndex: number, cardIndex: number): boolean => {
        return swiperIndex === 0 && cardIndex === 0
    }

    // 生成卡片的key
    const getCardKey = (swiperIndex: number, cardIndex: number, timestamp: number): string => {
        return isFirstCard(swiperIndex, cardIndex) ? `card-${timestamp}` : `card-${swiperIndex}-${cardIndex}`
    }

    // 监听选择器变化
    watch(selectSwiper, () => {
        getFloatingBallPosition()
    })

    return {
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
    }
}