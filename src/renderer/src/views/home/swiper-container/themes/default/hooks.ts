/**
 * @module hooks.ts
 * @description 自定义轮播图逻辑钩子，整合状态与操作方法，并以聚合对象形式导出
 */

import { ref, computed, onMounted, watch, toRaw, type Ref, type ComputedRef } from 'vue'
import { useClipboardStore } from '@renderer/store/useClipboardStore'

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
    )
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
      }
    },
    itemActions: {
      /** 切换当前卡片的置顶状态 */
      toggleSticky: () => {
        const item = getters.allCards.value[getters.activeAbsoluteIndex.value]
        if (item) {
          item.isSticky = item.isSticky === 'true' ? 'false' : 'true'
          window.clipboard.updateClipboardItem(toRaw(item))
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
          window.clipboard.deleteClipboardItem(toRaw(item))

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

        item && window.clipboard.writeClipboard(toRaw(item))
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

  // ===== 生命周期 =====
  onMounted(() => {
    window.addEventListener('keydown', handleKeyPress)
  })

  return {
    state,
    getters,
    actions
  }
}
