<!-- src/renderer/src/views/swiper-container/themes/default/swiper.vue -->
<script setup lang="ts">
/**
 * @module swiper.vue
 * @description 自定义轮播视图组件，实现卡片的分页展示和导航
 */

import { computed, ref, watch } from 'vue'
import VClipboardCard from './card/index.vue'
import StickyBadge from './card/StickyBadge.vue'
import SelectBadge from './card/selectBadge.vue'
import PaginationIndicator from './card/PaginationIndicator.vue'
import { useCarousel } from './hooks'
import { listenFromMain } from '@renderer/util/ipc.renderer.service'
// 全局类型定义中已经包含ClipboardState接口，不需要显式导入

// 解构hooks,只使用我们需要的状态和getter
const { state, getters, actions } = useCarousel()

// 延迟加载配置
const INITIAL_LOAD_COUNT = 20 // 初始加载20条
const BATCH_SIZE = 10 // 每次新加载10条
const LOAD_THRESHOLD = 5 // 当用户浏览到倒数第5条时触发加载

// 实际显示的卡片数据
const displayedCards = ref<ClipboardState[]>([])

// 空数据动画
const noDataMotion = {
  initial: {
    opacity: 0,
    y: -10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 600,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
}

/**
 * 加载更多数据
 * @description 从allCards中加载更多数据到displayedCards
 */
const loadMoreCards = () => {
  if (displayedCards.value.length >= getters.allCards.value.length) {
    return // 已加载全部数据
  }

  const nextBatchSize = Math.min(
    BATCH_SIZE,
    getters.allCards.value.length - displayedCards.value.length
  )

  const newCards = getters.allCards.value.slice(
    displayedCards.value.length,
    displayedCards.value.length + nextBatchSize
  )

  displayedCards.value.push(...newCards)
}

/** 每页的宽度（像素） */
const PAGE_WIDTH = computed(() => {
  return document.documentElement.clientWidth
})

/** 总页数 */
const totalPages = computed(() => {
  return Math.ceil(displayedCards.value.length / 3)
})

/**
 * 计算轮播列表的样式
 * @description 根据当前页码计算水平偏移，实现页面切换效果
 */
const listStyle = computed(() => ({
  transform: `translateX(-${state.currentPage.value * PAGE_WIDTH.value}px)`,
  transition: 'transform 0.3s ease',
  width: `${totalPages.value * PAGE_WIDTH.value}px`
}))

// 初始加载
watch(
  () => getters.allCards.value,
  (newCards) => {
    console.log('newCards', newCards)

    if (newCards.length > 0) {
      // 初始只加载指定数量的卡片
      displayedCards.value = newCards.slice(0, Math.min(INITIAL_LOAD_COUNT, newCards.length))
    } else {
      displayedCards.value = []
    }
  },
  { immediate: true }
)

// 监听活动索引变化，在接近末尾时加载更多
watch(
  () => getters.activeAbsoluteIndex.value,
  (newIndex) => {
    if (
      displayedCards.value.length - newIndex <= LOAD_THRESHOLD &&
      displayedCards.value.length < getters.allCards.value.length
    ) {
      loadMoreCards()
    }
  }
)

listenFromMain.onShowMainWindow(() => {
  actions.navigate.jumpToFirstPage()
})
</script>

<template>
  <div class="carousel-container">
    <!-- 内层列表，将所有卡片渲染出来 -->

    <div
      v-if="getters.allCards && getters.allCards.value.length === 0"
      v-motion="noDataMotion"
      class="no-data-container"
    >
      <div class="no-data-content">
        <div class="no-data-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2V13.5H21V2L19.5 3.5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3 13.5H21V22H3V13.5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 17H15"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h3>暂无剪贴板记录</h3>
        <p>复制一些内容后会在这里显示</p>
      </div>
    </div>

    <div class="all-cards" :style="listStyle">
      <div
        v-for="(card, index) in displayedCards"
        :key="card.id"
        :class="['card-wrapper', { active: index === getters.activeAbsoluteIndex.value }]"
        :style="{ width: PAGE_WIDTH + 'px' }"
        :data-id="card.id"
      >
        <StickyBadge :card="card" :card-id="card.id" />
        <SelectBadge
          v-if="index === getters.activeAbsoluteIndex.value"
          :card="card"
          :card-id="card.id"
        />
        <VClipboardCard :clipboard-options="card" />
      </div>
    </div>
    <!-- 分页状态展示组件（仅展示当前页码，不具备点击功能） -->
    <PaginationIndicator
      v-if="getters.allCards && getters.allCards.value.length > 0"
      :current="state.currentPage.value"
      :total="getters.totalPages.value"
    />
  </div>
</template>

<style scoped lang="scss">
/* 容器样式：设置溢出隐藏和全屏高度 */
.carousel-container {
  box-sizing: border-box;
  overflow: hidden;
  height: 100%;
}

/* 内层列表：垂直排列所有卡片，设置间距和内边距 */
.all-cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px 0px;
  height: 100%;
  background-color: var(--container-bg);
  transition: background-color 0.5s ease;
  will-change: transform; /* 提示浏览器优化变换性能 */
}

/* 卡片样式：设置基础样式和过渡效果 */
.card-wrapper {
  box-sizing: border-box;
  height: calc((100% - 6px - 2.5px) / 3);
  position: relative;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease;
  will-change: transform;
  backface-visibility: hidden;
}

/* 空数据容器样式 */
.no-data-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .no-data-content {
    text-align: center;
    color: var(--text-color, #8c8c8c);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    animation: fadeIn 0.5s ease-in-out;
  }

  .no-data-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 8px;

    svg {
      width: 100%;
      height: 100%;
      color: var(--text-color, #8c8c8c);
      animation: floatAnimation 3s ease-in-out infinite;
    }
  }

  h3 {
    font-size: 18px;
    margin: 0;
    font-weight: 500;
  }

  p {
    font-size: 14px;
    margin: 0;
    opacity: 0.8;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
