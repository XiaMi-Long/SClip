<script lang="ts" setup>
import { computed } from 'vue'
import SettingPreviewDark from '../../../../assets/image/setting-preview-dark.jpg'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'

/**
 * 图片微动画设置组件
 * 负责管理图片微动画效果
 */

// 获取 i18n store
const i18nStore = useI18nStore()

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
    title: i18nStore.t('common.save'),
    message: i18nStore.t('setting.sclip.animation.saveSuccess'),
    duration: 2000
  })
}
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="animation-section">
    <div class="section-title">
      <h3>{{ i18nStore.t('setting.sclip.animation.title') }}</h3>
      <p class="subtitle">{{ i18nStore.t('setting.sclip.animation.subtitle') }}</p>
    </div>

    <!-- 添加预览区域 -->
    <div class="animation-preview">
      <div class="preview-container">
        <img
          v-motion="imgMotion"
          :src="SettingPreviewDark"
          :alt="i18nStore.t('setting.sclip.animation.preview')"
          class="preview-image-animation"
        />
      </div>
    </div>

    <div class="toggle-option">
      <div class="option-info">
        <div class="option-title">{{ i18nStore.t('setting.sclip.animation.enableAnimation') }}</div>
        <div class="option-description">
          {{ i18nStore.t('setting.sclip.animation.enableAnimationDesc') }}
        </div>
      </div>
      <VSwitch v-model="enableImageAnimation" @change="toggleImageAnimation" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../common.scss';

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
</style>
