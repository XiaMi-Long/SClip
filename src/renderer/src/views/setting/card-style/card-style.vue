<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { useConfigStore } from '@renderer/store/useConfigStore'

// 获取 i18n store
const i18nStore = useI18nStore()
const configStore = useConfigStore()
const setting = configStore.getSetting

const currentCardStyle = ref(setting.currentCardStyle)

// 监听卡片样式变化并更新配置
watch(currentCardStyle, (newValue) => {
  configStore.setSetting({
    ...setting,
    currentCardStyle: newValue
  })
})
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
        <!-- default -->
        <div v-if="currentCardStyle === 'default'" class="default-list">
          <div class="default-list__item">default</div>
          <div class="default-list__item">default</div>
          <div class="default-list__item">default</div>
        </div>

        <!-- effects -->
        <div v-if="currentCardStyle === 'effects'" class="effects-list">
          <div class="effects-list__item">effects</div>
          <div class="effects-list__item">effects</div>
          <div class="effects-list__item">effects</div>
        </div>
      </div>
    </div>

    <!-- 按钮区域 -->
    <div class="card-style-button">
      <!-- Default 按钮 -->
      <div
        class="style-button"
        :class="{ active: currentCardStyle === 'default' }"
        @click="currentCardStyle = 'default'"
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
        @click="currentCardStyle = 'effects'"
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
  .card-style-preview__container {
    width: 100%;
    height: 400px;
    zoom: 1;
    background-color: var(--title-bar-bg);
    border-radius: 10px;
    @include card-container-base;
    @include flex-center;

    .default-list {
      width: 250px;
      height: 380px;
      @include card-container-base;
      padding: 3px;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      gap: 5px;
      flex-direction: column;
      flex-wrap: wrap;

      &__item {
        width: calc(250px - 6px);
        height: calc(380px / 3 - 7px);
        @include flex-center;
        background-color: var(--container-bg);
        flex-direction: column;
        border-radius: $border-radius;
      }
    }

    .effects-list {
      width: 250px;
      height: 380px;
      @include card-container-base;
      padding: 3px;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      gap: 5px;
      flex-direction: column;
      flex-wrap: wrap;

      &__item {
        width: calc(250px - 6px);
        height: calc(380px / 3 - 7px);
        @include flex-center;
        background-color: var(--container-bg);
        flex-direction: column;
        border-radius: $border-radius;
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
</style>
