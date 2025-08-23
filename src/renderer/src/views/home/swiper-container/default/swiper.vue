<!-- src/renderer/src/views/swiper-container/themes/default/swiper.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import VClipboardCard from './card/index.vue'
import CardBadge from './badge-componet/CardBadge.vue'
import PaginationIndicator from './card/pagination-component/PaginationIndicator.vue'
import { useCarousel } from './hooks'
import { listenFromMain } from '@renderer/util/ipc.renderer.service'
import NoData from '../components/no-data/index.vue'
// 全局类型定义中已经包含ClipboardState接口，不需要显式导入

// 解构hooks,只使用我们需要的状态和getter
const { state, getters, actions } = useCarousel()

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
    <NoData v-if="!cardsLength"></NoData>

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
</style>
