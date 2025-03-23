<script setup lang="ts">
/**
 * @file CardBadge 组件
 * @description 统一的卡片标记组件，支持多种标记类型（固定、选中等）
 */
import stickyImage from '../../../../../../assets/sticky_white.png'
import { computed } from 'vue'

/**
 * @typedef {Object} Props
 * @property {ClipboardState} card - 剪贴板状态对象
 * @property {boolean} isActive - 是否为当前激活的卡片
 * @property {boolean} showTypeIndicator - 是否显示类型指示器
 * @property {boolean} showLongContentTip - 是否显示长内容提示
 */
const props = defineProps<{
  card: ClipboardState
  isActive: boolean
  showTypeIndicator: boolean
  showLongContentTip: boolean
}>()

/**
 * @description 计算是否应该显示固定标记
 * @returns {boolean} 是否显示固定标记
 */
const shouldShowSticky = computed(() => {
  return props.card.isSticky === 'true'
})

/**
 * @description 计算是否应该显示长内容提示
 * @returns {boolean} 是否显示长内容提示
 */
const shouldShowLongContentTip = computed(() => {
  return props.showLongContentTip && props.card.type === 'text' && props.card.content.length > 150
})

/**
 * @description 计算是否应该显示类型指示器
 * @returns {boolean} 是否显示类型指示器
 */
const shouldShowTypeIndicator = computed(() => {
  return props.showTypeIndicator && (props.card.type === 'text' || props.card.type === 'rtf')
})

/**
 * @description 获取类型指示器显示的文本
 * @returns {string} 类型指示器文本
 */
const typeIndicatorText = computed(() => {
  if (props.card.type === 'text') return 'txt'
  if (props.card.type === 'rtf') return 'word'
  return ''
})

/**
 * @description 获取类型指示器的CSS类名
 * @returns {string} CSS类名
 */
const typeIndicatorClass = computed(() => {
  if (props.card.type === 'text') return 'text-type'
  if (props.card.type === 'rtf') return 'rtf-type'
  return ''
})
</script>

<template>
  <div class="badge-container">
    <!-- 左下角固定标记 -->
    <div v-if="shouldShowSticky" class="badge sticky-badge">
      <img :src="stickyImage" alt="固定标记" />
    </div>

    <!-- 右下角标记区域 -->
    <div class="right-bottom-badges">
      <!-- 长内容提示 -->
      <div v-if="shouldShowLongContentTip" class="badge long-content-badge">
        <span>max</span>
      </div>

      <!-- 类型指示器 -->
      <div
        v-if="shouldShowTypeIndicator"
        class="badge type-indicator-badge"
        :class="typeIndicatorClass"
      >
        <span>{{ typeIndicatorText }}</span>
      </div>

      <!-- 选中标记 -->
      <div v-if="isActive" class="badge select-badge">
        <div class="pulse-circle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/**
 * @description 标记组件的基础样式
 */
.badge-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

// 右下角标记区域
.right-bottom-badges {
  position: absolute;
  right: 5%;
  bottom: 5%;
  display: flex;
  gap: 0.3em;
  flex-direction: row-reverse; // 从右向左排列
}

.badge {
  position: relative; // 改为相对定位，因为现在在flex容器中
  box-sizing: border-box;
  width: 1.5em;
  height: 1.5em;
  padding: 0.3em;
  background-color: var(--sticky-badge-bg);
  transition: background-color 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;

  // 共享样式
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  span {
    font-size: 0.6em;
    font-weight: bold;
    color: white;
    text-transform: uppercase;
  }
}

// 固定标记位于左下角
.sticky-badge {
  position: absolute; // 保持绝对定位
  left: 5%;
  bottom: 5%;

  &.error {
    animation-name: tada;
    animation-duration: 1.5s;
    animation-fill-mode: both;
  }
}

// 选中标记样式
.select-badge {
  .pulse-circle {
    width: 0.6em;
    height: 0.6em;
    background-color: var(--button-primary-bg);
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

// 长内容提示样式
.long-content-badge {
}

// 类型指示器样式
.type-indicator-badge {
}

// 固定标记的错误动画
@keyframes tada {
  0% {
    transform: scale3d(1, 1, 1);
  }

  10%,
  20% {
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }

  30%,
  50%,
  70%,
  90% {
    transform: scale3d(1.2, 1.2, 1.2) rotate3d(0, 0, 1, 3deg);
    background-color: var(--sticky-badge-error-bg);
  }

  40%,
  60%,
  80% {
    transform: scale3d(1.4, 1.4, 1.4) rotate3d(0, 0, 1, -3deg);
  }

  100% {
    transform: scale3d(1, 1, 1);
  }
}

// 选中标记的脉冲动画
@keyframes pulse {
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }

  50% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(0.9);
    opacity: 0.8;
  }
}
</style>
