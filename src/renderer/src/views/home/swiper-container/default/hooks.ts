/**
 * @module hooks.ts
 * @description 自定义轮播图逻辑钩子，整合状态与操作方法，并以聚合对象形式导出
 */

import {
  ref,
  computed,
  onMounted,
  watch,
  toRaw,
  type Ref,
  type ComputedRef,
  onUnmounted
} from 'vue'
import { useClipboardStore } from '@renderer/store/useClipboardStore'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { sendToMain } from '@renderer/util/ipc.renderer.service'
import throttle from 'lodash/throttle'

/** 每页显示的卡片数量 */
const ITEMS_PER_PAGE = 3

/**
 * @interface CarouselState
 * @description 轮播图状态接口
 */
interface CarouselState {
  /** 当前页码，从0开始 */
  currentPage: Ref<number>
  /** 当前页内选中的卡片索引，从0开始 */
  currentCardIndex: Ref<number>
}

/**
 * @interface CarouselGetters
 * @description 轮播图计算属性接口
 */
interface CarouselGetters {
  /** 所有卡片数据，已倒序排列（最新的在前） */
  allCards: ComputedRef<ClipboardState[]>
  /** 总页数 */
  totalPages: ComputedRef<number>
  /** 当前页的卡片数量 */
  currentPageLength: ComputedRef<number>
  /** 当前选中卡片的绝对索引（相对于所有卡片） */
  activeAbsoluteIndex: ComputedRef<number>
  /** 是否显示类型标识 */
  showTypeIndicator: ComputedRef<boolean>
  /** 是否显示长内容提示 */
  showLongContentTip: ComputedRef<boolean>
  /** 当前系统是不是mac */
  isMac: ComputedRef<boolean>
}

/**
 * @interface CarouselActions
 * @description 轮播图操作方法接口
 */
interface CarouselActions {
  /** 导航相关操作 */
  navigate: {
    /** 前往上一页 */
    prevPage: () => void
    /** 前往下一页 */
    nextPage: () => void
    /** 选择上一个卡片 */
    prevCard: () => void
    /** 选择下一个卡片 */
    nextCard: () => void
    /** 跳转到首页 */
    jumpToFirstPage: () => void
  }
  /** 卡片项操作 */
  itemActions: {
    /** 切换当前卡片的置顶状态 */
    toggleSticky: () => void
    /** 删除当前选中的卡片 */
    deleteCurrent: () => void
    /** 将当前卡片内容写入系统剪贴板 */
    writeToClipboard: () => void
  }
}

/**
 * @interface UseCarouselReturn
 * @description useCarousel hook 的返回值类型
 */
export type UseCarouselReturn = {
  state: CarouselState
  getters: CarouselGetters
  actions: CarouselActions
}

/**
 * @function useCarousel
 * @description 轮播图逻辑复用钩子，提供状态管理、导航控制和卡片操作功能
 * @returns {UseCarouselReturn} 包含状态、计算属性和操作方法的对象
 */
export function useCarousel(): UseCarouselReturn {
  const clipboardStore = useClipboardStore()

  // ===== 状态核心 =====
  const state: CarouselState = {
    currentPage: ref(0),
    currentCardIndex: ref(0)
  }

  // 当剪贴板数据的数量等于1时，重置页码和当前选中的索引
  watch(
    () => clipboardStore.getClipboard.length,
    (newLength) => {
      if (newLength === 1) {
        state.currentPage.value = 0
        state.currentCardIndex.value = 0
      }
    }
  )

  // ===== 计算属性 =====
  const getters: CarouselGetters = {
    /** 获取所有卡片数据并倒序排列 */
    allCards: computed(() => clipboardStore.getClipboard.slice().reverse()),

    /** 是否显示类型标识 */
    showTypeIndicator: computed(() => {
      return useConfigStore().getSetting.appBehavior.showTypeIndicator
    }),

    /** 是否显示长内容提示 */
    showLongContentTip: computed(() => {
      return useConfigStore().getSetting.appBehavior.showLongContentTip
    }),

    /** 计算总页数 */
    totalPages: computed(() => Math.ceil(getters.allCards.value.length / ITEMS_PER_PAGE)),

    /** 计算当前页的卡片数量 */
    currentPageLength: computed(() => {
      const remaining = getters.allCards.value.length - state.currentPage.value * ITEMS_PER_PAGE
      return Math.min(remaining, ITEMS_PER_PAGE)
    }),

    /** 计算当前选中卡片的绝对索引（相对于所有卡片） */
    activeAbsoluteIndex: computed(
      () => state.currentPage.value * ITEMS_PER_PAGE + state.currentCardIndex.value
    ),

    /** 当前系统是不是mac */
    isMac: computed(() => {
      return useConfigStore().getSetting.system.isMac
    })
  }

  // ===== 操作方法 =====
  const actions: CarouselActions = {
    navigate: {
      /** 切换到上一页 */
      prevPage: () => {
        if (state.currentPage.value > 0) {
          state.currentPage.value--
        }
      },

      /** 切换到下一页 */
      nextPage: () => {
        if (state.currentPage.value < getters.totalPages.value - 1) {
          state.currentPage.value++
          if (state.currentCardIndex.value >= getters.currentPageLength.value) {
            state.currentCardIndex.value = getters.currentPageLength.value - 1
          }
        }
      },

      /** 选择上一个卡片 */
      prevCard: () => {
        if (state.currentCardIndex.value > 0) {
          state.currentCardIndex.value--
        }
      },

      /** 选择下一个卡片 */
      nextCard: () => {
        if (state.currentCardIndex.value < getters.currentPageLength.value - 1) {
          state.currentCardIndex.value++
        }
      },

      /** 跳转到首页 */
      jumpToFirstPage: () => {
        state.currentPage.value = 0
        state.currentCardIndex.value = 0
      }
    },
    itemActions: {
      /** 切换当前卡片的置顶状态 */
      toggleSticky: () => {
        const item = getters.allCards.value[getters.activeAbsoluteIndex.value]
        if (item) {
          item.isSticky = item.isSticky === 'true' ? 'false' : 'true'
          sendToMain.updateClipboardItem(toRaw(item))
        }
      },
      /** 删除当前选中的卡片 */
      deleteCurrent: () => {
        const indexInStore =
          clipboardStore.getClipboard.length - 1 - getters.activeAbsoluteIndex.value
        if (indexInStore >= 0 && clipboardStore.getClipboard.length > 0) {
          const item = clipboardStore.getClipboard[indexInStore]

          // 如果卡片处于置顶状态，则触发动画效果
          if (item.isSticky === 'true') {
            /**
             * 查找 .all-cards 下的同时拥有 .card-wrapper.active 的元素，
             * 如果该元素没有动画 class 则添加，用于播放动画，
             * 动画结束后移除该 class
             */
            const activeCardEl = document.querySelector(
              '.all-cards .card-wrapper.active .sticky-badge'
            ) as HTMLElement
            if (activeCardEl && !activeCardEl.classList.contains('error')) {
              activeCardEl.classList.add('error')
              /**
               * 处理动画结束事件
               */
              const handleAnimationEnd = () => {
                activeCardEl.classList.remove('error')
                activeCardEl.removeEventListener('animationend', handleAnimationEnd)
              }
              activeCardEl.addEventListener('animationend', handleAnimationEnd)
            }
            return
          }

          clipboardStore.removeClipboardItem(indexInStore)
          sendToMain.deleteClipboardItem(toRaw(item))

          // 处理删除后的页面和选中状态
          if (
            getters.allCards.value.length - 1 < state.currentPage.value * ITEMS_PER_PAGE &&
            state.currentPage.value > 0
          ) {
            actions.navigate.prevPage()
          } else {
            state.currentCardIndex.value = Math.min(
              state.currentCardIndex.value,
              getters.currentPageLength.value - 1
            )
          }
        }
      },

      /** 将当前卡片内容写入系统剪贴板 */
      writeToClipboard: () => {
        const item = getters.allCards.value[getters.activeAbsoluteIndex.value]
        console.log(item)

        item && sendToMain.writeClipboard(toRaw(item))
      }
    }
  }

  /**
   * 处理键盘事件
   * @param {KeyboardEvent} event - 键盘事件对象
   */
  const handleKeyPress = (event: KeyboardEvent) => {
    const keyMap: Record<string, () => void> = {
      'ArrowLeft|a|A': actions.navigate.prevPage,
      'ArrowRight|d|D': actions.navigate.nextPage,
      'ArrowUp|w|W': actions.navigate.prevCard,
      'ArrowDown|s|S': actions.navigate.nextCard,
      'e|E': actions.itemActions.toggleSticky,
      'q|Q': actions.itemActions.deleteCurrent,
      Enter: actions.itemActions.writeToClipboard
    }

    Object.entries(keyMap).forEach(([keys, action]) => {
      if (keys.split('|').includes(event.key)) {
        event.preventDefault()
        action()
      }
    })
  }

  // ===== 鼠标滑动处理 =====
  /**
   * 处理鼠标拖动事件
   * @description 监听鼠标按下、移动和释放事件，实现左右滑动翻页功能
   */
  let isDragging = false
  let startX = 0
  const MIN_DRAG_DISTANCE = 50 // 最小拖动距离，小于这个距离不触发翻页

  /**
   * 鼠标按下事件处理
   * @param {MouseEvent} event - 鼠标事件对象
   */
  const handleMouseDown = (event: MouseEvent) => {
    isDragging = true
    startX = event.clientX
  }

  /**
   * 鼠标移动事件处理
   * @param {MouseEvent} event - 鼠标事件对象
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return

    // 可以在这里添加拖动过程中的逻辑，如计算当前拖动距离
    const currentX = event.clientX
    // 计算当前拖动距离，可用于后续开发实时拖动效果
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentDelta = currentX - startX

    // 防止在拖动过程中选择文本
    event.preventDefault()
  }

  /**
   * 鼠标释放事件处理
   * @param {MouseEvent} event - 鼠标事件对象
   */
  const handleMouseUp = (event: MouseEvent) => {
    if (!isDragging) return

    const endX = event.clientX
    const deltaX = endX - startX

    // 判断是否达到触发翻页的最小距离
    if (Math.abs(deltaX) >= MIN_DRAG_DISTANCE) {
      if (deltaX > 0) {
        // 向右滑动，触发上一页
        actions.navigate.prevPage()
      } else {
        // 向左滑动，触发下一页
        actions.navigate.nextPage()
      }
    }

    isDragging = false
  }

  /**
   * 鼠标离开元素范围处理
   */
  const handleMouseLeave = () => {
    isDragging = false
  }

  // ===== 鼠标点击和双击事件 =====

  /**
   * 处理卡片点击事件
   * @param {MouseEvent} event - 鼠标事件对象
   */
  const handleDoubleClick = (event: MouseEvent) => {
    if (isDragging) return

    // 找到最近的 card-wrapper 元素
    const cardElement = (event.target as HTMLElement).closest('.card-wrapper') as HTMLElement

    if (!cardElement) return

    const cardIndex = cardElement.dataset.index

    if (cardIndex !== undefined) {
      const index = parseInt(cardIndex, 10)
      const cardIndexInPage = index % 3
      // 更新卡片索引
      state.currentCardIndex.value = cardIndexInPage

      // 可以在这里添加其他操作
      // 例如：写入剪贴板
      actions.itemActions.writeToClipboard()
    }
  }

  // ===== 滚轮滑动处理 =====
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
          actions.navigate.prevPage()
        } else if (deltaY > 0) {
          actions.navigate.nextPage()
        }
      } else {
        if (deltaY > 0) {
          actions.navigate.prevPage()
        } else if (deltaY < 0) {
          actions.navigate.nextPage()
        }
      }
    },
    WHEEL_THROTTLE_TIME,
    { leading: true, trailing: false }
  )

  // ===== 生命周期 =====
  onMounted(() => {
    // 键盘事件监听
    window.addEventListener('keydown', handleKeyPress)

    // 获取轮播容器元素
    const carouselEl = document.querySelector('.all-cards') as HTMLElement
    if (carouselEl) {
      // 添加鼠标拖动事件监听
      carouselEl.addEventListener('mousedown', handleMouseDown)
      carouselEl.addEventListener('mousemove', handleMouseMove)
      carouselEl.addEventListener('mouseup', handleMouseUp)
      carouselEl.addEventListener('mouseleave', handleMouseLeave)

      // 添加鼠标点击事件监听
      // carouselEl.addEventListener('click', handleCardClick)
      // 添加鼠标双击事件监听
      carouselEl.addEventListener('dblclick', handleDoubleClick)
      // 添加滚轮事件监听
      carouselEl.addEventListener('wheel', handleWheel, { passive: false })
    }
  })

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    // 移除键盘事件监听
    window.removeEventListener('keydown', handleKeyPress)

    // 获取轮播容器元素
    const carouselEl = document.querySelector('.all-cards') as HTMLElement
    if (carouselEl) {
      // 移除鼠标拖动事件监听
      carouselEl.removeEventListener('mousedown', handleMouseDown)
      carouselEl.removeEventListener('mousemove', handleMouseMove)
      carouselEl.removeEventListener('mouseup', handleMouseUp)
      carouselEl.removeEventListener('mouseleave', handleMouseLeave)

      // 移除鼠标点击事件监听
      // carouselEl.removeEventListener('click', handleCardClick)
      // 移除鼠标双击事件监听
      carouselEl.removeEventListener('dblclick', handleDoubleClick)

      // 移除滚轮事件监听
      carouselEl.removeEventListener('wheel', handleWheel)
    }

    // 取消可能存在的等待中的节流
    handleWheel.cancel()
  })

  return {
    state,
    getters,
    actions
  }
}
