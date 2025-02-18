<script setup lang="ts">
/**
 * @file StickyBadge 组件
 * @description 显示固定选项的标记组件，使用fadeInRight动画从右侧淡入
 */
import stickyImage from '../../../../../../assets/sticky_white.png'
import { useMotions } from '@vueuse/motion'
import { ref, computed } from 'vue'

const props = defineProps<{
  card: ClipboardState
  cardId: number
}>()

// 获取 motions 实例
const motions = useMotions()

// 定义动画配置
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

const shouldShow = computed(() => {
  // 添加微任务延迟确保状态同步
  return props.card.isSticky === 'true'
})

const getCardId = computed(() => {
  return props.cardId
})
</script>

<template>
  <transition :css="false" @leave="(el, done) => motions[`stickyBadge${getCardId}`].leave(done)">
    <div v-if="shouldShow" v-motion="'stickyBadge' + getCardId" :initial="badgeMotion.initial" :enter="badgeMotion.enter"
      :leave="badgeMotion.leave" class="sticky-badge">
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
  /* 改用百分比 */
  bottom: 5%;
  /* 改用百分比 */
  width: 1.5em;
  /* 使用 em 单位，相对于字体大小 */
  height: 1.5em;
  /* 使用 em 单位 */
  padding: 0.3em;
  /* 使用 em 单位 */
  background-color: var(--stickybadge-bg);
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
