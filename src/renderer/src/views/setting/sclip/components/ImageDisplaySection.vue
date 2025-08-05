<script lang="ts" setup>
import { computed } from 'vue'
import { isDarkMode } from '../../../../util/system.theme'
import SettingPreviewDark from '../../../../assets/image/setting-preview-dark.jpg'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { Message } from '@renderer/components/VMessage'

/**
 * 图片显示设置组件
 * 负责管理图片在卡片中的显示方式
 */

// 获取 i18n store
const i18nStore = useI18nStore()

const props = defineProps<{
  displayMode: 'auto' | 'contain' | 'cover'
}>()

const emit = defineEmits<{
  (e: 'update:displayMode', value: 'auto' | 'contain' | 'cover'): void
}>()

// 图片显示模式类型
interface ImageDisplayMode {
  id: 'auto' | 'contain' | 'cover'
  name: string
  description: string
}

const displayModeImage = computed(() => {
  // return isDarkMode.value ? SettingPreviewDark : SettingPreviewLight
  return SettingPreviewDark
})

// 图片显示模式选项
const displayModes: ImageDisplayMode[] = [
  {
    id: 'auto',
    name: i18nStore.t('setting.sclip.image.autoSelect'),
    description: i18nStore.t('setting.sclip.image.autoSelectDesc')
  },
  {
    id: 'contain',
    name: i18nStore.t('setting.sclip.image.fullDisplay'),
    description: i18nStore.t('setting.sclip.image.fullDisplayDesc')
  },
  {
    id: 'cover',
    name: i18nStore.t('setting.sclip.image.cropFill'),
    description: i18nStore.t('setting.sclip.image.cropFillDesc')
  }
]

// 选中的图片显示模式
const selectedDisplayMode = computed({
  get: () => props.displayMode,
  set: (value) => emit('update:displayMode', value)
})

// 勾选过渡动画
const checkIconMotion = {
  initial: { opacity: 0, scale: 0.6 },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 500,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
}

/**
 * 获取图片显示模式
 * @param {string} modeId - 显示模式ID
 * @returns {string} 对应的 CSS object-fit 值
 */
const getDisplayModeFit = (modeId: 'auto' | 'contain' | 'cover'): string => {
  if (modeId !== 'auto') {
    return modeId
  }
  return isDarkMode.value ? 'cover' : 'contain'
}

/**
 * 选择图片显示模式
 * @param {string} modeId - 显示模式ID
 */
const selectDisplayMode = (modeId: 'auto' | 'contain' | 'cover'): void => {
  selectedDisplayMode.value = modeId
  // 保存设置
  useConfigStore().setImageSettings({
    displayMode: modeId
  })
  // 显示成功消息通知
  Message.success({
    title: i18nStore.t('common.save'),
    message: i18nStore.t('setting.sclip.image.saveSuccess'),
    duration: 2000
  })
}
</script>

<template>
  <div class="image-display-section">
    <div class="section-title">
      <h3>{{ i18nStore.t('setting.sclip.image.displayMode') }}</h3>
      <p class="subtitle">{{ i18nStore.t('setting.sclip.image.displayModeDesc') }}</p>
    </div>

    <div class="display-mode-options">
      <!-- 显示模式预览卡片 -->
      <div
        v-for="mode in displayModes"
        :key="mode.id"
        class="display-mode-card"
        :class="{ active: selectedDisplayMode === mode.id }"
        @click="selectDisplayMode(mode.id)"
      >
        <!-- 显示模式预览 -->
        <div class="display-preview">
          <img
            class="preview-image"
            :class="'preview-image-' + mode.id"
            :src="displayModeImage"
            :alt="`${mode.name} ${i18nStore.t('setting.sclip.image.preview')}`"
            :style="{ objectFit: getDisplayModeFit(mode.id) }"
          />
        </div>

        <!-- 显示模式信息和选择状态 -->
        <div class="mode-info">
          <div
            v-if="selectedDisplayMode === mode.id"
            v-motion="checkIconMotion"
            class="check-icon-wrapper"
          >
            <div class="check-icon">✓</div>
          </div>
          <div class="mode-text" :class="{ active: selectedDisplayMode === mode.id }">
            <div class="mode-name">{{ mode.name }}</div>
            <div class="mode-description">{{ mode.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../common.scss';

.image-display-section {
  margin-bottom: 30px;
}

.display-mode-options {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.display-mode-card {
  flex: 1;
  background-color: var(--title-bar-bg);
  transition: background-color 0.5s ease;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
}

.display-preview {
  width: 100%;
  height: 160px;
  background-color: var(--title-bar-bg);
  transition: background-color 0.5s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .preview-image {
    width: 100%;
    height: 100%;
    border-radius: 8px 8px 0 0;
    object-fit: contain;
  }

  .preview-image-auto {
    object-fit: v-bind("getDisplayModeFit('auto')");
  }

  .preview-image-contain {
    object-fit: contain;
  }

  .preview-image-cover {
    object-fit: cover;
  }
}

.mode-info {
  padding: 15px;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .check-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--button-primary-bg);
    transition: background-color 0.5s ease;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .mode-text {
    flex: 1;
    transition: all 0.5s ease;

    &.active {
      transform: translateX(10px);
    }

    .mode-name {
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .mode-description {
      font-size: 10px;
      color: var(--text-color);
      opacity: 0.7;
      transition: color 0.5s ease;
    }
  }
}
</style>
