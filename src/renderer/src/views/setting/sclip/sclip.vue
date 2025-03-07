<script lang="ts" setup>
import { ref, computed } from 'vue'
import { isDarkMode } from '../../../util/system.theme'
import SettingPreviewLight from '../../../assets/image/setting-preview-light.jpg'
import SettingPreviewDark from '../../../assets/image/setting-preview-dark.jpg'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'

/**
 * SClip设置组件
 * 包含图片显示设置和应用操作逻辑设置
 */

// 图片显示模式类型
interface ImageDisplayMode {
  id: 'auto' | 'contain' | 'cover'
  name: string
  description: string
}

const displayModeImage = computed(() => {
  return isDarkMode.value ? SettingPreviewDark : SettingPreviewLight
})

// 图片显示模式选项
const displayModes: ImageDisplayMode[] = [
  {
    id: 'auto',
    name: '自动选择',
    description: '根据图片比例自动选择最佳显示方式，兼顾美观和清晰度'
  },
  {
    id: 'contain',
    name: '完整显示',
    description: '确保图片完整显示，可能留有空白，方便快速定位所需内容'
  },
  {
    id: 'cover',
    name: '裁剪填充',
    description: '填满区域，可能裁剪部分图片内容，保持图片清晰度'
  }
]

const setting = useConfigStore().getSetting

// 选中的图片显示模式
const selectedDisplayMode = ref<'auto' | 'contain' | 'cover'>(setting.imageSettings.displayMode)

// 是否启用图片微动画
const enableImageAnimation = ref(setting.imageSettings.enableAnimation)

// 是否每次打开应用时回到第一页
const jumpToFirstPage = ref(true)

// 过渡动画
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

// 生成 -10 到 10 之间的随机数
const getRandomPosition = () => Math.random() * 20 - 18

// 图片浮动动画
const imgMotion = {
  initial: {
    scale: 1.1,
    x: 0,
    y: 0
  },
  enter: {
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

// 卡片滚动动画 - 使用v-Motion实现，根据需求调整
const cardScrollMotion = {
  initial: {
    x: 0,
    opacity: 1
  },
  enter: {
    // 调整位移和透明度的关键帧序列
    x: [0, -250, -250, -250, -250, 0, 0],
    opacity: [1, 1, 0, 0, 1, 1, 1],
    transition: {
      // 整体时长调整为8秒
      duration: 8000,
      repeat: Infinity,
      repeatType: 'loop',
      // 调整时间点：
      // 0%: 初始状态
      // 15%: 完成位移(-250)
      // 25%: 开始淡出(opacity: 0)
      // 50%: 保持透明状态2秒
      // 55%: 快速显示出来
      // 65%: 快速位移回原位(只用10%的时间)
      // 100%: 保持初始状态直至结束(35%的时间，约3秒)
      times: [0, 0.15, 0.25, 0.5, 0.55, 0.65, 1],
      // 为不同阶段设置不同的缓动函数
      // 注意：缓动函数数组长度必须是值数组长度减1
      ease: ['easeOut', 'linear', 'linear', 'easeOut', 'easeOut', 'linear']
    }
  }
}

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
  // 这里可以添加保存设置的逻辑
  useConfigStore().setImageSettings({
    displayMode: modeId
  })
  // 显示成功消息通知
  Message.success({
    title: '设置已保存',
    message: '图片显示模式设置已成功应用，下次打开应用时生效',
    duration: 2000
  })
}

/**
 * 切换图片微动画开关
 */
const toggleImageAnimation = (value: boolean): void => {
  enableImageAnimation.value = value
  // 这里可以添加保存设置的逻辑
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

/**
 * 切换是否回到第一页的设置
 */
const toggleJumpToFirstPage = (value: boolean): void => {
  jumpToFirstPage.value = value
  // 这里可以添加保存设置的逻辑
}
</script>

<template>
  <div class="sclip-settings">
    <div class="settings-header">
      <h2>SClip 内容显示</h2>
      <p class="subtitle">定制您的剪贴板内容显示方式</p>
    </div>

    <!-- 图片显示设置区域 -->
    <div class="image-display-section">
      <div class="section-title">
        <h3>图片显示方式</h3>
        <p class="subtitle">选择如何在卡片中显示图片内容</p>
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
              :src="displayModeImage"
              :style="{ objectFit: getDisplayModeFit(mode.id) }"
              alt="预览图"
              :class="'preview-image preview-image-' + mode.id"
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

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 图片微动画设置区域 -->
    <div class="animation-section">
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
            :style="{ objectFit: 'cover' }"
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

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 应用操作逻辑设置区域 -->
    <div class="behavior-section">
      <div class="section-title">
        <h3>应用行为</h3>
        <p class="subtitle">自定义应用的操作逻辑</p>
      </div>

      <div class="wakeup-preview">
        <div class="preview-container">
          <div class="preview-card-container">
            <!-- 使用v-motion指令代替CSS动画 -->
            <div v-motion="cardScrollMotion" class="card-container">
              <div class="card-item">春风拂面</div>
              <div class="card-item">月光如水</div>
              <div class="card-item">花开有声</div>
              <div class="card-item">云淡风轻</div>
              <div class="card-item">静听雨落</div>
              <div class="card-item">星河璀璨</div>
            </div>
          </div>
        </div>
      </div>

      <div class="toggle-option">
        <div class="option-info">
          <div class="option-title">唤醒回到首页</div>
          <div class="option-description">每次唤醒应用时自动回到第一页</div>
        </div>
        <VSwitch v-model="jumpToFirstPage" @change="toggleJumpToFirstPage" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sclip-settings {
  max-width: 900px;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: 30px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 14px;
    color: var(--text-color);
    transition: color 0.5s ease;
    opacity: 0.7;
  }
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

.display-mode-options {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .display-mode-options {
    flex-direction: column;
  }
}

.display-mode-card {
  flex: 1;
  background-color: rgba(var(--rgb-text-color, 0, 0, 0), 0.03);
  transition: background-color 0.5s ease;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }

  &.active {
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
  }
}

.mode-info {
  padding: 15px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.check-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--accent-color, #4285f4);
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

.divider {
  height: 1px;
  background-color: var(--title-bar-bg);
  transition: background-color 0.5s;
  margin: 30px 0;
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
}

.option-info {
  flex: 1;
}

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

.animation-section,
.behavior-section {
  margin-bottom: 30px;
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
  }
}

$card-width: 250px;
$card-height: 380px;

.wakeup-preview {
  margin-bottom: 20px;

  .preview-container {
    width: 100%;
    height: 400px;
    background-color: var(--title-bar-bg);
    transition: background-color 0.5s ease;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .preview-card-container {
      width: $card-width;
      height: $card-height;
      background-color: var(--title-bar-bg);
      transition: background-color 0.5s ease;
      border-radius: 10px;
      padding: 3px;
      box-sizing: border-box;
      overflow: hidden;

      .card-container {
        width: calc($card-width * 2);
        height: 100%;
        display: flex;
        gap: 5px;
        flex-direction: column;
        flex-wrap: wrap;
        will-change: transform, opacity;

        .card-item {
          width: calc($card-width - 6px);
          height: calc($card-height / 3 - 7px);
          display: flex;
          background-color: var(--container-bg);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }
      }
    }
  }
}

// 移除不再需要的CSS scroll动画
// @keyframes scroll {
//   0% {
//     transform: translateX(0) translateY(0);
//     opacity: 1;
//   }
//
//   15% {
//     transform: translateX(-$card-width) translateY(0);
//     opacity: 1;
//   }
//
//   25% {
//     transform: translateX(-$card-width) translateY(0);
//     opacity: 1;
//   }
//
//   35% {
//     transform: translateX(-$card-width) translateY(0);
//     opacity: 0;
//   }
//
//   45% {
//     transform: translateX(-$card-width) translateY(0);
//     opacity: 0.6;
//   }
//
//   65% {
//     transform: translateX(-$card-width) translateY(0);
//     opacity: 1;
//   }
//
//   80% {
//     transform: translateX(0) translateY(0);
//   }
//
//   100% {
//     transform: translateX(0) translateY(0);
//   }
// }
</style>
