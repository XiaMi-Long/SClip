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
import noDataImage from '../../../../../assets/no-data.png'



const { state, getters, actions } = useCarousel()

// 解构计算属性，使其在模板中自动解包
const { allCards, activeAbsoluteIndex } = toRefs(getters)


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

console.log(getters.allCards.value)

/**
 * 元素进入时的动画
 * @param el - 进入的元素
 * @param done - 动画完成的回调
 */
const onEnter = (el: Element, done: () => void) => {
  const animation = el.animate(
    [
      {
        opacity: 0,
        transform: 'translateY(-30px)'
      },
      {
        opacity: 1,
        transform: 'translateY(0)'
      }
    ],
    {
      duration: 300,
      easing: 'ease-out'
    }
  )

  animation.onfinish = done
  done()
}

/**
 * 元素离开时的动画
 * @param el - 离开的元素
 * @param done - 动画完成的回调
 */
const onLeave = (el: Element, done: () => void) => {
  const animation = el.animate(
    [
      {
        transform: 'translateY(0)'
      },
      {
        transform: 'translateY(-30px)'
      }
    ],
    {
      duration: 300,
      easing: 'ease-in'
    }
  )

  animation.onfinish = done
  done()
}
</script>

<template>
  <div class="carousel-container">
    <!-- 内层列表，将所有卡片渲染出来 -->
    <transition name="no-data" appear>
      <div class="no-data-container" v-if="allCards.length === 0">
        <img :src="noDataImage" alt="no-data" />
      </div>
    </transition>
    <TransitionGroup tag="div" class="all-cards" :style="listStyle" :css="false" @enter="onEnter" @leave="onLeave" appear>
      <div v-for="(card, index) in allCards" :key="card.id" :class="['card-wrapper', { active: index === activeAbsoluteIndex }]"
        :style="{ width: PAGE_WIDTH + 'px' }" :data-id="card.id">
        <StickyBadge :card="card" :card-id="card.id" />
        <SelectBadge v-if="index === activeAbsoluteIndex" :card="card" :card-id="card.id" />
        <VClipboardCard :clipboardOptions="card" />
      </div>
    </TransitionGroup>
    <!-- 分页状态展示组件（仅展示当前页码，不具备点击功能） -->
    <PaginationIndicator :current="state.currentPage.value" :total="getters.totalPages.value" />
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
  gap: 3px 0px;
  height: 100%;
}

/* 卡片样式：设置基础样式和过渡效果 */
.card-wrapper {
  box-sizing: border-box;
  padding: 15px;
  height: calc((100% - 6px - 2.5px) / 3);
  position: relative;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease;
  background-color: #fff;
  box-shadow: 0 2px 4px rgb(132 132 132 / 10%);
  /* 使用 will-change 提示浏览器优化 */
  will-change: transform;

  /* 强制开启硬件加速 */
  backface-visibility: hidden;
}

.no-data-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-data-container img {
  width: 200px;
  height: 200px;
}

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
</style>
