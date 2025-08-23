<script setup lang="ts">
/**
 * @file CardBadge 组件 (Effects版本)
 * @description 专门用于effects模块的卡片标记组件，支持固定标记、类型指示器和长内容提示
 */
import stickyImage from '@renderer/assets/sticky_white.png'
import { computed } from 'vue'

/**
 * @typedef {Object} Props
 * @property {ClipboardState} card - 剪贴板状态对象
 * @property {boolean} showTypeIndicator - 是否显示类型指示器
 * @property {boolean} showLongContentTip - 是否显示长内容提示
 */
const props = defineProps<{
  card: ClipboardState
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
    <!-- 固定标记 -->
    <Transition name="fade">
      <div v-if="shouldShowSticky" class="badge sticky-badge">
        <img :src="stickyImage" alt="固定标记" />
      </div>
    </Transition>

    <!-- 长内容提示 -->
    <Transition name="fade">
      <div v-if="shouldShowLongContentTip" class="badge long-content-badge">
        <span>max</span>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="shouldShowTypeIndicator"
        class="badge type-indicator-badge"
        :class="typeIndicatorClass"
      >
        <span>{{ typeIndicatorText }}</span>
      </div>
    </Transition>
    <!-- 类型指示器 -->
  </div>
</template>

<style scoped lang="scss">
/**
 * @description effects模块标记组件的基础样式
 */
.badge-container {
  display: flex;
  gap: 0.3em;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transform: all 0.3s ease;
  z-index: 2;
  //   position: relative;
}

.badge {
  box-sizing: border-box;
  width: 1.5em;
  height: 1.5em;
  padding: 0.3em;
  flex: 1;
  background-color: var(--sticky-badge-bg);
  transition: background-color 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  //   transform: all 0.3s ease;
  //   position: absolute;

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

// 固定标记样式
.sticky-badge {
  &.error {
    animation-name: tada;
    animation-duration: 1.5s;
    animation-fill-mode: both;
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

.fade-enter-active {
  transition: all 0.3s;
}

.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
</style>
