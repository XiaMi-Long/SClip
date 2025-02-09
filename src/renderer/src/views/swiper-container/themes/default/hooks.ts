import { ref, computed, watch, reactive } from 'vue'
import { Swiper as SwiperClass } from 'swiper/types'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useSwiperStore } from '@renderer/store/useSwiperStore'
import { Pagination, Keyboard } from 'swiper/modules'
import { useClipboardStore } from '@renderer/store/useClipboardStore'
import robot from 'robotjs'

export function useSwiper() {
    const clipboardStore = useClipboardStore()
    const ITEMS_PER_PAGE = 3


    const paginatedClipboardList = computed(() => {
        const list = clipboardStore.getClipboard
        const pages: ClipboardState[][] = []
        for (let i = 0; i < list.length; i += ITEMS_PER_PAGE) {
            pages.push(list.slice(i, i + ITEMS_PER_PAGE))
        }
        return pages
    })


    const cardMotion = (cardIndex: number) => {
        return cardIndex === 0 ? {
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
        } : {}
    }

    // 分离状态和方法
    const swiperState = ref({
        swiperInstance: null as SwiperClass | null,
        changeSwiperIndex: 0,
        swiperItemsPerPage: ITEMS_PER_PAGE,
        floatingBallX: 275,
        floatingBallY: 5
    })

    // Swiper 参数配置
    const swiperParams = reactive({
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

    // 计算浮动球样式
    const floatingBallStyle = computed(() => {
        return {
            '--ball-x': `${swiperState.value.floatingBallX}px`,
            '--ball-y': `${swiperState.value.floatingBallY}px`
        }
    })

    // 浮动球位置计算
    const getFloatingBallPosition = () => {
        if (swiperState.value.swiperInstance === null) {
            swiperState.value.floatingBallX = 275
            swiperState.value.floatingBallY = 5
            return
        }

        const swiperActiveIndex = swiperState.value.swiperInstance.activeIndex
        swiperState.value.floatingBallX = 275 + 300 * swiperActiveIndex
        swiperState.value.floatingBallY = 5

        if (swiperState.value.changeSwiperIndex === 1) {
            swiperState.value.floatingBallY = 140 + 5
        }
        if (swiperState.value.changeSwiperIndex === 2) {
            swiperState.value.floatingBallY = 140 + 140 + 5
        }
    }

    // Swiper 初始化处理
    const onSwiperInit = (swiper: SwiperClass) => {
        swiperState.value.swiperInstance = swiper
        swiper.on('activeIndexChange', () => {
            getFloatingBallPosition()
        })
    }

    // 返回组织好的服务对象
    const swiperServices = reactive({
        state: swiperState,
        params: swiperParams,
        onSwiperInit,
        getFloatingBallPosition,
        floatingBallStyle
    })

    return {
        swiperServices,
        paginatedClipboardList,
        cardMotion,
        totalPages: computed(() => paginatedClipboardList.value.length)
    }
}