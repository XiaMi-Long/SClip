import { ref, computed, watch, reactive, toRaw } from 'vue'
import { Swiper as SwiperClass } from 'swiper/types'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { Pagination, Keyboard } from 'swiper/modules'
import { useClipboardStore } from '@renderer/store/useClipboardStore'
export function useSwiper() {
    const ITEMS_PER_PAGE = 3
    const clipboardStore = useClipboardStore()


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
        floatingBallY: 10,
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

    /**
     * swiper 浮动球事件处理
     */
    const swiperBallHandler = reactive({
        /**
         * 处理键盘事件
         */
        handleKeyPress: (_swiper: SwiperClass, keyCode: number) => {
            switch (keyCode) {
                case 39:
                    console.log('Right key pressed')
                    break
                case 37:
                    console.log('Left key pressed')
                    break
                case 38:
                    console.log('Up key pressed')
                    swiperBallHandler.up()
                    break
                case 40:
                    console.log('Down key pressed')
                    swiperBallHandler.down()
                    break
                case 87:
                    console.log('W key pressed')
                    swiperBallHandler.up()
                    break
                case 83:
                    console.log('S key pressed')
                    swiperBallHandler.down()
                    break
                case 65:
                    if (swiperState.value.swiperInstance) {
                        swiperState.value.swiperInstance.slidePrev(500)
                    }
                    console.log('A key pressed')
                    break
                case 68:
                    if (swiperState.value.swiperInstance) {
                        swiperState.value.swiperInstance.slideNext(500)
                    }
                    swiperBallHandler.right()
                    break
                case 32:

                    break
                case 13:
                    // 回车
                    // 根据目前选择的第几项，获取对应的剪贴板数据
                    if (swiperState.value.swiperInstance) {
                        const activeIndex = swiperState.value.swiperInstance.activeIndex * swiperState.value.swiperItemsPerPage + swiperState.value.changeSwiperIndex
                        const clipboardData = clipboardStore.getClipboard[activeIndex]
                        if (clipboardData) {
                            // 使用 toRaw 解包响应式对象
                            const rawClipboardData = toRaw(clipboardData)
                            window.clipboard.changeClipboard(rawClipboardData)
                        }
                    }

                    break
            }
        },

        /**
         * 左移
         */
        left: () => {

            console.log('Left key pressed')
        },


        /**
         * 右移
         * @description 核心思路：如果当前下一页选择的index并不存在，则将index设置为0
         */
        right: () => {
            const newIndex = swiperState.value.changeSwiperIndex
            const isHas = swiperBallHandler.validateSwiperIndexIsHas(newIndex)
            if (!isHas) {
                swiperState.value.changeSwiperIndex = 0
            }
            console.log('Right key pressed')
        },


        /**
         * 上移
         * @description 使用(current - 1) % length的模运算公式来实现循环
         */
        up: () => {
            const newIndex =
                (swiperState.value.changeSwiperIndex - 1 + swiperState.value.swiperItemsPerPage) %
                swiperState.value.swiperItemsPerPage;

            const isHas = swiperBallHandler.validateSwiperIndexIsHas(newIndex)
            if (isHas) {
                swiperState.value.changeSwiperIndex = newIndex
            }
        },

        /**
         * 下移
         * @description 使用(current + 1) % length的模运算公式来实现循环
         */
        down: () => {
            const newIndex =
                (swiperState.value.changeSwiperIndex + 1) %
                swiperState.value.swiperItemsPerPage;
            const isHas = swiperBallHandler.validateSwiperIndexIsHas(newIndex)
            if (isHas) {
                swiperState.value.changeSwiperIndex = newIndex
            }
        },

        /**
         * 验证下一个swiperIndex是否存在
         * @description 核心思路：当前选择的页数 * 每页的个数 + 下一个index = 下一个选择数据的在总数据中的下标
         */
        validateSwiperIndexIsHas: (newIndex: number) => {
            if (swiperState.value.swiperInstance) {
                const activeIndex = (swiperState.value.swiperInstance.activeIndex) * swiperState.value.swiperItemsPerPage + newIndex
                const item = clipboardStore.getClipboard[activeIndex]
                if (item) {
                    return true
                }
                return false
            }
            return false
        },

        /**
         * 浮动球位置计算
         * @description 核心思路：根据当前选择的页数和当前选择的index，计算浮动球的位置
         */
        getFloatingBallPosition: () => {
            if (!swiperState.value.swiperInstance) {
                swiperState.value.floatingBallX = 275
                swiperState.value.floatingBallY = 10
                return
            }
            swiperState.value.floatingBallY = 10

            if (swiperState.value.changeSwiperIndex === 1) {
                swiperState.value.floatingBallY = 140 + 10
            }
            if (swiperState.value.changeSwiperIndex === 2) {
                swiperState.value.floatingBallY = 140 + 140 + 10
            }
        }

    })


    /**
     * Swiper 初始化处理
     */
    const onSwiperInit = (swiper: SwiperClass) => {
        swiperState.value.swiperInstance = swiper
        swiper.on('activeIndexChange', () => {
            swiperBallHandler.getFloatingBallPosition()
        })
        swiper.on('keyPress', swiperBallHandler.handleKeyPress as any)
    }

    /**
     * 计算浮动球样式
     */
    const floatingBallStyle = computed(() => {
        return {
            '--ball-x': `${swiperState.value.floatingBallX}px`,
            '--ball-y': `${swiperState.value.floatingBallY}px`
        }
    })

    // 返回组织好的服务对象
    const swiperServices = reactive({
        state: swiperState,
        params: swiperParams,
        onSwiperInit,
        getFloatingBallPosition: swiperBallHandler.getFloatingBallPosition,
        floatingBallStyle,
        ballHandler: swiperBallHandler
    })

    watch(() => swiperState.value.changeSwiperIndex, () => {
        swiperBallHandler.getFloatingBallPosition()
    })

    return {
        swiperServices,
        paginatedClipboardList,
        cardMotion,
        totalPages: computed(() => paginatedClipboardList.value.length)
    }
}