<script setup lang="ts">
/**
 * @file PaginationIndicator.vue
 * @description 分页状态组件，使用条形区域表示页码。
 * 新增功能：根据页面切换方向添加过渡动画
 *   - 前进：上一个区域宽度过渡连接
 *   - 后退：当前区域宽度过渡连接
 */

import { computed, ref, watch } from 'vue'

const props = defineProps<{
  current: number
  total: number
}>()

/**
 * @constant {number} BAR_WIDTH - 每个条形区域的宽度（像素）
 */
const BAR_WIDTH = 15

/**
 * @constant {number} BAR_GAP - 条形区域之间的间隔（像素）
 */
const BAR_GAP = 8

// 记录动画状态
const isAnimating = ref(false)
const isForward = ref(false)
const animatingIndex = ref(-1)

// 监听页码变化
watch(
  () => props.current,
  (newVal, oldVal) => {
    if (oldVal !== undefined && newVal !== oldVal) {
      isForward.value = newVal > oldVal
      animatingIndex.value = isForward.value ? oldVal : newVal
      isAnimating.value = true

      // 动画结束后重置状态
      setTimeout(() => {
        isAnimating.value = false
        animatingIndex.value = -1
      }, 500) // 与动画时长保持一致
    }
  }
)

/**
 * @function getTransformX
 * @description 计算条形区域容器的横向偏移量
 */
const transformX = computed(() => {
  if (props.total <= 3) return 0

  if (props.current === 0) {
    // 第一页：不偏移
    return 0
  } else if (props.current === props.total - 1) {
    // 最后一页：向左偏移使最后一个条形区域位于最右侧
    return -((props.total - 3) * (BAR_WIDTH + BAR_GAP))
  } else {
    // 中间页：保持当前页的条形区域在中间
    return -((props.current - 1) * (BAR_WIDTH + BAR_GAP))
  }
})

/**
 * @function bars
 * @description 生成所有条形区域的数组
 */
const bars = computed(() => Array.from({ length: props.total }, (_, index) => index))

/**
 * @function getBarClass
 * @description 获取条形区域的类名
 */
const getBarClass = (index: number) => ({
  'pagination-bar': true,
  active: index === props.current,
  animating: isAnimating.value && index === animatingIndex.value,
  forward: isAnimating.value && isForward.value,
  backward: isAnimating.value && !isForward.value
})
</script>

<template>
  <div class="pagination-container">
    <div class="pagination-wrapper" :class="{ flex: props.total <= 3 }">
      <div class="pagination-bars" :style="{ transform: `translateX(${transformX}px)` }">
        <div v-for="index in bars" :key="index" :class="getBarClass(index)"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pagination-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 65px;
  /* (15px * 3) + (8px * 2) = 65px，刚好容纳3个条形区域 */
  overflow: visible; /* 修改为visible以显示伪元素溢出部分 */
  height: 4px; /* 明确设置高度 */
  z-index: 5; /* 确保分页指示器在磨砂背景上方 */
  transition: background-color 0.5s ease;

  /* 添加磨砂质感伪元素 */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -3px; /* 位于区域下方 */
    transform: translateX(-50%);
    width: calc(100% + 20px); /* 比容器宽20px */
    height: 12px; /* 比容器高 */
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: -1; /* 确保在分页指示器下方 */
    background: var(--container-bg);

    -webkit-backdrop-filter: blur(50px);
    backdrop-filter: blur(50px);
  }
}

.pagination-wrapper {
  position: relative;
  width: 100%;
  height: 4px;
  overflow: hidden;
  /* 条形区域高度 */
  &.flex {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.pagination-bars {
  position: absolute;
  display: flex;
  gap: 8px;
  /* 条形区域间隔 */
  transition: transform 0.3s ease;
  /* 使用 will-change 提示浏览器优化 */
  will-change: transform;

  /* 强制开启硬件加速 */
  backface-visibility: hidden;
}

.pagination-bar {
  width: 15px;
  /* 条形区域宽度 */
  height: 4px;
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.2);
  transition: background-color 0.5s ease;

  &.active {
    background-color: var(--title-bar-bg);
  }
}

/* 前进动画 */
@keyframes expandForward {
  0% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(6px);
  }

  40% {
    transform: translateX(12px);
  }

  60% {
    transform: translateX(12px);
  }

  100% {
    transform: translateX(23px);
  }
}

/* 后退动画 */
@keyframes expandBackward {
  0% {
    transform: translateX(23px);
  }

  40% {
    transform: translateX(12px);
  }

  60% {
    transform: translateX(12px);
  }

  80% {
    transform: translateX(6px);
  }

  100% {
    transform: translateX(0px);
  }
}

/* 应用动画 */
.pagination-bar.animating {
  position: absolute;
  transition: background-color 0.5s ease;

  &.forward {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      transform-origin: left center;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 2px;
      background-color: var(--title-bar-bg);
      animation: expandForward 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  }

  &.backward {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      transform-origin: left center;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 2px;
      background-color: var(--title-bar-bg);
      animation: expandBackward 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  }
}
</style>
