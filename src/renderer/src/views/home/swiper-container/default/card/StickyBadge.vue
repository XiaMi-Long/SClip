<script setup lang="ts">
/**
 * @file StickyBadge 组件
 * @description 显示固定选项的标记组件，使用动画效果显示固定标记
 */
import stickyImage from '../../../../../assets/sticky_white.png'
import { useMotions } from '@vueuse/motion'
import { computed } from 'vue'

/**
 * @typedef {Object} Props
 * @property {ClipboardState} card - 剪贴板状态对象
 * @property {number} cardId - 卡片ID，用于动画标识
 */
const props = defineProps<{
  card: ClipboardState
  cardId: number
}>()

// 获取 motions 实例
const motions = useMotions()

/**
 * @description 定义标记的动画配置
 */
const badgeMotion = {
  initial: { opacity: 0, scale: 0.3 },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 300,
      ease: [0.215, 0.61, 0.355, 1]
    }
  },
  leave: {
    opacity: 0,
    scale: 0.3,
    transition: {
      duration: 150
    }
  }
}

/**
 * @description 计算是否应该显示标记
 * @returns {boolean} 是否显示标记
 */
const shouldShow = computed(() => {
  return props.card.isSticky === 'true'
})

/**
 * @description 获取卡片ID，用于动画标识
 * @returns {number} 卡片ID
 */
const getCardId = computed(() => {
  return props.cardId
})

/**
 * @description 处理元素离开时的动画
 * @param {Element} _ - 动画元素（未使用）
 * @param {Function} done - 动画完成回调
 */
const handleLeave = (_: Element, done: () => void) => {
  motions[`stickyBadge${getCardId.value}`].leave(done)
}
</script>

<template>
  <transition :css="false" @leave="handleLeave">
    <div
      v-if="shouldShow"
      v-motion="'stickyBadge' + getCardId"
      :initial="badgeMotion.initial"
      :enter="badgeMotion.enter"
      :leave="badgeMotion.leave"
      class="sticky-badge"
    >
      <img :src="stickyImage" alt="固定标记" />
    </div>
  </transition>
</template>

<style scoped lang="scss">
/**
 * @description StickyBadge 样式定义
 */
.sticky-badge {
  z-index: 2;
  position: absolute;
  box-sizing: border-box;
  left: 5%;
  bottom: 5%;
  width: 1.5em;
  height: 1.5em;
  padding: 0.3em;
  background-color: var(--sticky-badge-bg);
  transition: background-color 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;

  &.error {
    animation-name: tada;
    animation-duration: 1.5s;
    animation-fill-mode: both;
  }
}

.sticky-badge img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

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
    background-color: var(--stickybadge-error-bg);
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
</style>
