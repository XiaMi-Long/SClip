<script lang="ts" setup>
import { ref } from 'vue'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { Message } from '@renderer/components/VMessage'
import VDialog from '@renderer/components/VDialog'

// 获取 i18n store
const i18nStore = useI18nStore()
const configStore = useConfigStore()
const setting = configStore.getSetting

const markTop = ref('-100%')
const showRestartDialog = ref(false)
const selectedEffectsBgColor = ref(setting.clipboardCardStyle.effects.cardBgColor)
const pendingCardStyle = ref<'default' | 'effects'>(
  setting.currentCardStyle as 'default' | 'effects'
)
const currentCardStyle = ref(setting.currentCardStyle)

const handleClick = (value: 'default' | 'effects') => {
  pendingCardStyle.value = value
  showRestartDialog.value = true
}

const handleConfirmRestart = () => {
  // 显示重启提示对话框
  markTop.value = '0'
  setTimeout(() => {
    currentCardStyle.value = pendingCardStyle.value
    configStore.setCardStyle(currentCardStyle.value)
    // 显示成功消息通知
    Message.success({
      title: i18nStore.t('common.save'),
      message: i18nStore.t('setting.cardStyle.saveSuccess'),
      duration: 2000
    })
    markTop.value = '-100%'
  }, 1000)
}

const handleCancelRestart = () => {}

// 预设颜色选项 - 10个时尚色系（一半浅色一半深色）
const colorPresets = ref([
  { name: '经典', color: '#494949' }, // 默认颜色放在最前面
  { name: '薄荷绿', color: '#7FDBDA' }, // 浅色
  { name: '珊瑚粉', color: '#FF6B6B' }, // 深色
  { name: '天空蓝', color: '#74B9FF' }, // 浅色
  { name: '深紫罗兰', color: '#6C5CE7' }, // 深色
  { name: '奶油黄', color: '#FDCB6E' }, // 浅色
  { name: '深青绿', color: '#00B894' }, // 深色
  { name: '淡玫瑰', color: '#FD79A8' }, // 浅色
  { name: '深蓝灰', color: '#2D3436' }, // 深色
  { name: '浅薰衣草', color: '#A29BFE' } // 浅色
])

const handleColorInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.value) {
    selectedEffectsBgColor.value = target.value
    configStore.setCardStyleBgColor(target.value)
    // 显示成功消息通知
    Message.success({
      title: i18nStore.t('common.save'),
      message: i18nStore.t('setting.cardStyle.saveSuccess'),
      duration: 2000
    })
  }
}

// 处理预设颜色点击
const handlePresetClick = (color: string) => {
  selectedEffectsBgColor.value = color
  configStore.setCardStyleBgColor(color)
  // 显示成功消息通知
  Message.success({
    title: i18nStore.t('common.save'),
    message: i18nStore.t('setting.cardStyle.saveSuccess'),
    duration: 2000
  })
}
</script>

<template>
  <div class="card-style-settings">
    <div class="settings-header">
      <h2>{{ i18nStore.t('setting.cardStyle.contentDisplay') }}</h2>
      <p class="subtitle">{{ i18nStore.t('setting.cardStyle.customizeContentDisplay') }}</p>
    </div>

    <!-- 分隔线 -->
    <div class="divider"></div>

    <div class="section-title">
      <h3>{{ i18nStore.t('setting.cardStyle.title') }}</h3>
      <p class="subtitle">{{ i18nStore.t('setting.cardStyle.subtitle') }}</p>
    </div>

    <!-- 卡片样式选择区域 -->
    <div class="card-style-preview">
      <div class="card-style-preview__container">
        <!-- 遮罩 -->
        <div
          class="mask"
          :style="{
            top: markTop
          }"
        ></div>

        <!-- default -->
        <div v-if="currentCardStyle === 'default'" class="default-list">
          <div class="default-list__item">
            <svg
              viewBox="0 0 84 84"
              width="100%"
              height="80%"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="22" y="-11" width="44" height="33" rx="2" fill="#ecedef" />
              <rect x="22" y="24" width="44" height="33" rx="2" fill="#ecedef" />
              <rect x="22" y="59" width="44" height="33" rx="2" fill="#ecedef" />
            </svg>
          </div>
        </div>

        <!-- effects -->
        <div v-if="currentCardStyle === 'effects'" class="effects-list">
          <div class="effects-list__item">
            <svg
              viewBox="0 0 64 64"
              width="100%"
              height="100%"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity=".5"
                d="M43 17.735a2 2 0 0 1 1.717-1.98l10-1.429A2 2 0 0 1 57 16.306v27.388a2 2 0 0 1-2.283 1.98l-10-1.429A2 2 0 0 1 43 42.265v-24.53Zm-22 0a2 2 0 0 0-1.717-1.98l-10-1.429A2 2 0 0 0 7 16.306v27.388a2 2 0 0 0 2.283 1.98l10-1.429A2 2 0 0 0 21 42.265v-24.53Z"
                :fill="selectedEffectsBgColor + '99'"
              />
              <rect x="16" y="9" width="32" height="46" rx="2" :fill="selectedEffectsBgColor" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- effects颜色配置区域 -->
    <div class="toggle-option">
      <div class="option-info">
        <div class="option-title">
          {{ i18nStore.t('setting.cardStyle.colorPickerTitle') }}
        </div>
        <div class="option-description">
          {{ i18nStore.t('setting.cardStyle.colorPickerDesc') }}
        </div>
      </div>
      <input
        type="color"
        class="color-input"
        :value="selectedEffectsBgColor"
        @input="handleColorInput"
      />
    </div>

    <!-- 颜色推荐区域 -->
    <div class="toggle-option">
      <div class="color-preset-container">
        <div
          v-for="preset in colorPresets"
          :key="preset.name"
          class="color-preset-item"
          @click="handlePresetClick(preset.color)"
        >
          <div class="color-preview" :style="{ backgroundColor: preset.color }"></div>
          <span class="color-name">{{ preset.name }}</span>
        </div>
      </div>
    </div>

    <!-- 按钮区域 -->
    <div class="card-style-button">
      <!-- Default 按钮 -->
      <div
        class="style-button"
        :class="{ active: currentCardStyle === 'default' }"
        @click="handleClick('default')"
      >
        <div class="style-button__icon">
          <svg
            viewBox="0 0 84 84"
            width="84"
            height="84"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="24" y="11" width="40" height="20" rx="2" fill="#fff" />
            <rect x="24" y="33" width="40" height="20" rx="2" fill="#fff" />
            <rect x="24" y="55" width="40" height="20" rx="2" fill="#fff" />
          </svg>
        </div>
        <div class="style-button__text">{{ i18nStore.t('setting.cardStyle.default') }}</div>
      </div>

      <!-- Effects 按钮 -->
      <div
        class="style-button"
        :class="{ active: currentCardStyle === 'effects' }"
        @click="handleClick('effects')"
      >
        <div class="style-button__icon">
          <svg
            viewBox="0 0 64 64"
            width="64"
            height="64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity=".5"
              d="M43 17.735a2 2 0 0 1 1.717-1.98l10-1.429A2 2 0 0 1 57 16.306v27.388a2 2 0 0 1-2.283 1.98l-10-1.429A2 2 0 0 1 43 42.265v-24.53Zm-22 0a2 2 0 0 0-1.717-1.98l-10-1.429A2 2 0 0 0 7 16.306v27.388a2 2 0 0 0 2.283 1.98l10-1.429A2 2 0 0 0 21 42.265v-24.53Z"
              fill="#fff"
            />
            <rect x="19" y="11" width="26" height="38" rx="2" fill="#fff" />
          </svg>
        </div>
        <div class="style-button__text">
          {{ i18nStore.t('setting.cardStyle.transitionEffects') }}
        </div>
      </div>
    </div>

    <!-- 重启提示对话框 -->
    <VDialog
      v-if="showRestartDialog"
      message="更改此配置，需重启才可生效"
      type="warning"
      confirm-text="确定"
      cancel-text="取消"
      @confirm="handleConfirmRestart"
      @cancel="handleCancelRestart"
      @close="showRestartDialog = false"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '../base.scss';

// 定义变量
$border-radius: 10px;
$transition-default: 0.5s ease;

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin card-container-base {
  background-color: var(--title-bar-bg);
  transition: background-color $transition-default;
  border-radius: $border-radius;
}

.card-style-preview {
  position: relative;
  margin-bottom: 20px;

  .card-style-preview__container {
    position: relative;
    width: 100%;
    height: 400px;
    zoom: 1;
    background-color: var(--title-bar-bg);
    border-radius: 10px;
    overflow: hidden;
    @include card-container-base;
    @include flex-center;

    .mask {
      &::after {
        content: 'SClip';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        font-weight: bold;
        color: white;
        opacity: 1;
      }
      position: absolute;
      // top: -100%;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--button-primary-bg);
      z-index: 1;
      transition: top 1s ease;
    }

    .mask-move {
    }

    .default-list {
      width: 250px;
      height: 380px;
      @include card-container-base;
      padding: 3px;
      box-sizing: border-box;
      overflow: hidden;
      @include flex-center;

      &__item {
        width: calc(250px - 6px);
        height: calc(380px - 6px);
        @include flex-center;
        background-color: var(--container-bg);
        flex-direction: column;
        border-radius: $border-radius;
        padding: 20px;
        box-sizing: border-box;
      }
    }

    .effects-list {
      width: 250px;
      height: 380px;
      @include card-container-base;
      padding: 3px;
      box-sizing: border-box;
      overflow: hidden;
      @include flex-center;

      &__item {
        width: calc(250px - 6px);
        height: calc(380px - 6px);
        @include flex-center;
        background-color: var(--container-bg);
        flex-direction: column;
        border-radius: $border-radius;
        padding: 20px;
        box-sizing: border-box;
      }
    }
  }
}

.card-style-button {
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
  flex-wrap: wrap;
  justify-content: center;

  .style-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    background-color: #2a2c2d;
    text-align: center;
    backdrop-filter: blur(10px);
    backdrop-saturate: 200%;
    font-size: 14px;
    line-height: 1.4;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 80px;
    height: 80px;
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      // background-color: #2a2c2d;
    }

    &.active {
      background-color: var(--button-primary-bg);
    }

    &__icon {
      width: 48px;
      height: 48px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    &__text {
      font-weight: 500;
      line-height: 1.2;
    }
  }
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  background-color: transparent;
  margin-right: 15px;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
}

.color-preset-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .color-preset-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;
    padding: 10px 6px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--button-primary-bg);
      transform: translateY(-2px);
    }

    .color-preview {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .color-name {
      font-size: 12px;
      color: var(--text-secondary);
      text-align: center;
      line-height: 1.2;
      transition: color 0.3s ease;
    }
  }
}
</style>
