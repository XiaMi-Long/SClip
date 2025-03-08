<!-- src/renderer/src/views/swiper-container/themes/default/swiper.vue -->
<script setup lang="ts">
/**
 * @module swiper.vue
 * @description 自定义轮播视图组件，实现卡片的分页展示和导航
 */

import { computed, toRefs } from 'vue'
import VClipboardCard from './card/index.vue'
import StickyBadge from './card/StickyBadge.vue'
import SelectBadge from './card/selectBadge.vue'
import PaginationIndicator from './card/PaginationIndicator.vue'
import { useCarousel } from './hooks'
import { listenFromMain } from '@renderer/util/ipc.renderer.service'

// 解构hooks,只使用我们需要的状态和getter
const { state, getters, actions } = useCarousel()
/** 每页的宽度（像素） */
const PAGE_WIDTH = computed(() => {
  return document.documentElement.clientWidth
})

/**
 * 计算轮播列表的样式
 * @description 根据当前页码计算水平偏移，实现页面切换效果
 */
const listStyle = computed(() => ({
  transform: `translateX(-${state.currentPage.value * PAGE_WIDTH.value}px)`,
  transition: 'transform 0.3s ease',
  width: `${getters.totalPages.value * PAGE_WIDTH.value}px`
}))

listenFromMain.onShowMainWindow(() => {
  console.log('showMainWindow')
  actions.navigate.jumpToFirstPage()
})
</script>

<template>
  <div class="carousel-container">
    <!-- 内层列表，将所有卡片渲染出来 -->
    <transition name="no-data" appear>
      <div v-if="getters.allCards && getters.allCards.value.length === 0" class="no-data-container">
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
    </transition>
    <div class="all-cards" :style="listStyle">
      <div
        v-for="(card, index) in getters.allCards.value"
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
}

/* 卡片样式：设置基础样式和过渡效果 */
.card-wrapper {
  box-sizing: border-box;
  // padding: 15px;
  height: calc((100% - 6px - 2.5px) / 3);
  position: relative;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease;
  // box-shadow: 0 2px 4px rgb(132 132 132 / 10%);

  /* 使用 will-change 提示浏览器优化 */
  will-change: transform;

  /* 强制开启硬件加速 */
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

/* 空数据动画 */
.no-data-enter-active {
  animation: bounceIn 0.5s ease;
}

@keyframes bounceIn {
  0%,
  100%,
  20%,
  40%,
  60%,
  80% {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }

  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
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

@keyframes floatAnimation {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>
