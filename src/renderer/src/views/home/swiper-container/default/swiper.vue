<!-- src/renderer/src/views/swiper-container/themes/default/swiper.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import VClipboardCard from './card/index.vue'
import CardBadge from './card/badge-componet/CardBadge.vue'
import PaginationIndicator from './card/pagination-component/PaginationIndicator.vue'
import { useCarousel } from './hooks'
import { listenFromMain } from '@renderer/util/ipc.renderer.service'
// 全局类型定义中已经包含ClipboardState接口，不需要显式导入

// 解构hooks,只使用我们需要的状态和getter
const { state, getters, actions } = useCarousel()

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

/** 每页的宽度（像素） */
const PAGE_WIDTH = computed(() => {
  return document.documentElement.clientWidth
})

/** 总页数 */
const totalPages = computed(() => {
  return Math.ceil(cardsLength.value / 3)
})

/** 是否显示分页状态 */
const displayCardsIsEmptyData = computed(() => {
  return cardsLength.value > 0
})

/** 卡片数量 */
const cardsLength = computed(() => {
  return getters.allCards.value.length
})

/**
 * 计算轮播列表的样式
 * @description 根据当前页码计算水平偏移，实现页面切换效果
 */
const listStyle = computed(() => ({
  transform: `translateX(-${state.currentPage.value * PAGE_WIDTH.value}px)`,
  transition: 'transform .3s ease',
  width: `${totalPages.value * PAGE_WIDTH.value}px`
}))

listenFromMain.onShowMainWindow(() => {
  actions.navigate.jumpToFirstPage()
})

console.log(getters.allCards.value)
</script>

<template>
  <div class="carousel-container">
    <!-- 内层列表，将所有卡片渲染出来 -->
    <div v-if="!cardsLength" v-motion="noDataMotion" class="no-data-container">
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
        v-for="(card, index) in getters.allCards.value"
        :key="card.id"
        :class="['card-wrapper', { active: index === getters.activeAbsoluteIndex.value }]"
        :style="{ width: PAGE_WIDTH + 'px' }"
        :data-index="index"
      >
        <CardBadge
          :card="card"
          :is-active="index === getters.activeAbsoluteIndex.value"
          :show-type-indicator="getters.showTypeIndicator.value"
          :show-long-content-tip="getters.showLongContentTip.value"
        />
        <VClipboardCard :clipboard-options="card" />
      </div>
    </div>

    <!-- 分页状态展示组件（仅展示当前页码，不具备点击功能） -->
    <PaginationIndicator
      v-if="displayCardsIsEmptyData"
      :current="state.currentPage.value"
      :total="totalPages"
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
  transition: transform 0.5s ease;
  will-change: transform;
  backface-visibility: hidden;
  // background-color: red;
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
