<script lang="ts" setup>
import { computed } from 'vue'
import SettingPreviewDark from '../../../../assets/image/setting-preview-dark.jpg'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'

/**
 * 图片微动画设置组件
 * 负责管理图片微动画效果
 */

const props = defineProps<{
  enableAnimation: boolean
}>()

const emit = defineEmits<{
  (e: 'update:enableAnimation', value: boolean): void
}>()

// 是否启用图片微动画
const enableImageAnimation = computed({
  get: () => props.enableAnimation,
  set: (value) => emit('update:enableAnimation', value)
})

// 生成 -10 到 10 之间的随机数
const getRandomPosition = () => Math.random() * 30 - 25

// 图片浮动动画
const imgMotion = {
  initial: {
    scale: 1.1,
    x: 0,
    y: 0
  },
  visible: {
    scale: 1.1,
    x: getRandomPosition(),
    y: getRandomPosition(),
    transition: {
      duration: 6000,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  }
}

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion

/**
 * 切换图片微动画开关
 * @param {boolean} value - 开关状态
 */
const toggleImageAnimation = (value: boolean): void => {
  enableImageAnimation.value = value
  // 保存设置
  useConfigStore().setImageSettings({
    enableAnimation: value
  })
  // 显示成功消息通知
  Message.success({
    title: '设置已保存',
    message: '图片微动画设置已成功应用，下次打开应用时生效',
    duration: 2000
  })
}
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="animation-section">
    <div class="section-title">
      <h3>图片微动画</h3>
      <p class="subtitle">为图片添加微妙的动态效果</p>
    </div>

    <!-- 添加预览区域 -->
    <div class="animation-preview">
      <div class="preview-container">
        <img
          v-motion="imgMotion"
          :src="SettingPreviewDark"
          alt="动画预览"
          class="preview-image-animation"
        />
      </div>
    </div>

    <div class="toggle-option">
      <div class="option-info">
        <div class="option-title">启用图片微动画</div>
        <div class="option-description">为图片卡片添加轻微的动态效果，增强视觉体验</div>
      </div>
      <VSwitch v-model="enableImageAnimation" @change="toggleImageAnimation" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.animation-section {
  margin-bottom: 30px;
}

.section-title {
  margin-bottom: 20px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .subtitle {
    font-size: 14px;
    color: var(--text-color);
    opacity: 0.7;
    transition: color 0.5s ease;
  }
}

.animation-preview {
  margin-bottom: 20px;

  .preview-container {
    width: 100%;
    height: 180px;
    background-color: var(--title-bar-bg);
    transition: background-color 0.5s ease;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview-image-animation {
    width: 100%;
    height: 100%;
    will-change: transform;
    object-fit: cover;
  }
}

.toggle-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: rgba(var(--rgb-text-color, 0, 0, 0), 0.03);
  transition: background-color 0.5s ease;
  border-radius: 10px;
  margin-bottom: 15px;

  .option-info {
    flex: 1;

    .option-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .option-description {
      font-size: 14px;
      color: var(--text-color);
      opacity: 0.7;
      transition: color 0.5s ease;
    }
  }
}
</style>
