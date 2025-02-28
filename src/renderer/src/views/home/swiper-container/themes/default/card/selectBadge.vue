<script setup lang="ts">
/**
 * @file SelectBadge 组件
 * @description 显示选中状态的标记组件，使用动画效果显示选中标记
 */
import selectImage from '../../../../../../assets/select_white.png'
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
      duration: 500,
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

const rotateMotion = {
  initial: { rotate: 0 },
  enter: { rotate: 180, transition: { duration: 500, ease: [0.215, 0.61, 0.355, 1] } }
}

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
  motions[`selectBadge${getCardId.value}`].leave(done)
}
</script>

<template>
  <transition :css="false" @leave="handleLeave">
    <div
      v-motion="'selectBadge' + getCardId"
      :initial="badgeMotion.initial"
      :enter="badgeMotion.enter"
      :leave="badgeMotion.leave"
      class="select-badge"
    >
      <img v-motion="rotateMotion" :src="selectImage" alt="选中标记" />
    </div>
  </transition>
</template>

<style scoped lang="scss">
/**
 * @description SelectBadge 样式定义
 */
.select-badge {
  z-index: 2;
  position: absolute;
  box-sizing: border-box;
  right: 5%;
  bottom: 5%;
  width: 1.5em;
  height: 1.5em;
  padding: 0.3em;
  background-color: var(--stickybadge-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}

.select-badge img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
