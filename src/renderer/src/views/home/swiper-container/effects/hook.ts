import { computed, ComputedRef, ref, Ref, onMounted, onUnmounted, toRaw } from 'vue'
import { useClipboardStore } from '@renderer/store/useClipboardStore'
import { useConfigStore } from '@renderer/store/useConfigStore'
import throttle from 'lodash/throttle'
import { listenFromMain, sendToMain } from '@renderer/util/ipc.renderer.service'
interface Status {
  activeIndex: Ref<number>
}
interface Getters {
  getAllCards: ComputedRef<ClipboardState[]>
  effectsCardBgColor: ComputedRef<string>
  isMac: ComputedRef<boolean>
  getActiveCard: ComputedRef<ClipboardState>
}

interface Actions {
  nextPage: () => void
  prevPage: () => void
  jumpToFirstPage: () => void
  toggleSticky: () => void
  deleteCurrent: () => void
  writeToClipboard: () => void
}

/**
 * 卡片层叠效果的 Hook
 */
export const useStyles = () => {
  const clipboardStore = useClipboardStore()
  const configStore = useConfigStore()

  const status: Status = {
    activeIndex: ref(0)
  }

  const getters: Getters = {
    /**  获取所有剪贴板数据 */
    getAllCards: computed(() => clipboardStore.getClipboard.slice().reverse()),

    /** 获取卡片配置中的背景颜色 */
    effectsCardBgColor: computed(
      () => configStore.getSetting.clipboardCardStyle.effects.cardBgColor
    ),

    /** 获取当前activeindex的卡片 */
    getActiveCard: computed(() => {
      return getters.getAllCards.value[status.activeIndex.value]
    }),

    /** 当前系统是不是mac */
    isMac: computed(() => {
      return useConfigStore().getSetting.system.isMac
    })
  }

  const actions: Actions = {
    /** 下一个 */
    nextPage: () => {
      if (status.activeIndex.value === getters.getAllCards.value.length - 1) return
      status.activeIndex.value++
    },

    /** 上一个 */
    prevPage: () => {
      if (status.activeIndex.value === 0) return
      status.activeIndex.value--
    },

    /** 回到第一页 */
    jumpToFirstPage: () => {
      status.activeIndex.value = 0
    },

    toggleSticky: () => {
      const item = getters.getAllCards.value[status.activeIndex.value]
      if (item) {
        item.isSticky = item.isSticky === 'true' ? 'false' : 'true'
        sendToMain.updateClipboardItem(toRaw(item))
      }
    },

    /** 删除 */
    deleteCurrent: () => {
      const count = getters.getAllCards.value.length

      if (count === 0) return

      const currentIndex = count - status.activeIndex.value - 1
      const currentItem = clipboardStore.getClipboard[currentIndex]

      clipboardStore.removeClipboardItem(currentIndex)
      sendToMain.deleteClipboardItem(toRaw(currentItem))
      // 如果删除的是最后一位则返回上一个位置
      if (count - 1 === status.activeIndex.value) {
        status.activeIndex.value = Math.max(status.activeIndex.value - 1, 0)
      }
    },
    writeToClipboard: () => {}
  }

  // 1  3

  /**
   * 根据卡片索引计算其样式
   * @param index - 卡片的索引
   */
  const getCardStyle = (index: number) => {
    // 计算与当前激活卡片的偏移量
    const offset = index - status.activeIndex.value

    // 只显示中间及其左右两边的卡片，其余的隐藏
    if (Math.abs(offset) > 1) {
      return {
        opacity: 0,
        // 将其移出视野
        transform: `translateX(${Math.sign(offset) * 100}%) scale(0.5) translateZ(-500px)`,
        zIndex: 5
      }
    }

    // 根据偏移量计算样式
    // 中间卡片 scale 为 1，两侧为 0.8
    const scale = offset === 0 ? 1 : 0.8
    // 中间卡片层级最高
    const zIndex = 10 - Math.abs(offset)
    // X 轴偏移量，使两侧卡片露出一半
    const translateX = offset * 50
    // Z 轴偏移量，使两侧卡片有纵深感，看起来在后面
    const translateZ = -Math.abs(offset) * 100

    const isShow = index === status.activeIndex.value

    return {
      transform: `translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale})`,
      zIndex: zIndex,
      opacity: isShow ? 1 : 0.5,
      backgroundColor: getters.effectsCardBgColor.value
      //   border: isShow ? '1px solid var(--button-primary-bg)' : ''
    }
  }

  /**
   * 处理键盘事件
   * @param {KeyboardEvent} event - 键盘事件对象
   */
  const handleKeyPress = (event: KeyboardEvent) => {
    const keyMap: Record<string, () => void> = {
      'ArrowLeft|a|A': actions.prevPage,
      'ArrowRight|d|D': actions.nextPage,
      'e|E': actions.toggleSticky,
      'q|Q': actions.deleteCurrent,
      Enter: actions.writeToClipboard
    }

    Object.entries(keyMap).forEach(([keys, action]) => {
      if (keys.split('|').includes(event.key)) {
        event.preventDefault()
        action()
      }
    })
  }

  /**
   * 滚轮事件处理
   * @param {WheelEvent} event - 滚轮事件对象
   */
  const WHEEL_THROTTLE_TIME = 40 // 滚轮事件节流时间（毫秒）

  const handleWheel = throttle(
    (event: WheelEvent) => {
      // 防止事件冒泡和默认行为（需要 passive: false）
      event.preventDefault()
      const deltaY = event.deltaY
      const isMac = getters.isMac.value

      // Mac: 负值上一页，正值下一页；Windows: 相反
      if (isMac) {
        if (deltaY < 0) {
          actions.prevPage()
        } else if (deltaY > 0) {
          actions.nextPage()
        }
      } else {
        if (deltaY > 0) {
          actions.prevPage()
        } else if (deltaY < 0) {
          actions.nextPage()
        }
      }
    },
    WHEEL_THROTTLE_TIME,
    { leading: true, trailing: false }
  )

  onMounted(() => {
    // 键盘事件监听
    window.addEventListener('keydown', handleKeyPress)

    // 监听回到首页
    listenFromMain.onShowMainWindow(() => {
      actions.jumpToFirstPage()
    })

    const cardSwiperContainer = document.querySelector('.card-swiper-wrapper') as HTMLElement
    if (cardSwiperContainer) {
      cardSwiperContainer.addEventListener('wheel', handleWheel)
    }
  })

  onUnmounted(() => {
    // 移除键盘事件监听
    window.removeEventListener('keydown', handleKeyPress)

    const cardSwiperContainer = document.querySelector('.card-swiper-wrapper') as HTMLElement
    if (cardSwiperContainer) {
      cardSwiperContainer.removeEventListener('wheel', handleWheel)
    }

    handleWheel.cancel()
  })

  return {
    getters,
    status,
    getCardStyle
  }
}
