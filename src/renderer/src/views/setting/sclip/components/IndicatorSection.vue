<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'
import VAlert from '@renderer/components/VAlert'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'

/**
 * 标识和提示设置组件
 * 负责管理内容类型标识和长内容提示的显示
 */

// 获取 i18n store
const i18nStore = useI18nStore()

const props = defineProps<{
  showTypeIndicator: boolean
  showLongContentTip: boolean
}>()

const emit = defineEmits<{
  (e: 'update:showTypeIndicator', value: boolean): void
  (e: 'update:showLongContentTip', value: boolean): void
}>()

// 是否显示类型标识
const showTypeIndicatorValue = computed({
  get: () => props.showTypeIndicator,
  set: (value) => emit('update:showTypeIndicator', value)
})

// 是否显示长内容提示
const showLongContentTipValue = computed({
  get: () => props.showLongContentTip,
  set: (value) => emit('update:showLongContentTip', value)
})

// 监听值的变化，当值变化时保存设置
watch(
  [showTypeIndicatorValue, showLongContentTipValue],
  () => {
    saveSettings()
  },
  { deep: true }
)

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion

// 类型标识动画
const showTypeMotion = {
  initial: {
    opacity: 0,
    y: 60
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1]
    }
  },
  leave: {
    opacity: 0,
    y: 60,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
}

/**
 * 保存设置并显示通知
 */
const saveSettings = (): void => {
  // 保存设置
  useConfigStore().setShowTypeIndicator({
    showTypeIndicator: showTypeIndicatorValue.value,
    showLongContentTip: showLongContentTipValue.value
  })

  // 显示成功消息通知
  Message.success({
    title: i18nStore.t('common.save'),
    message: i18nStore.t('setting.sclip.indicator.saveSuccess'),
    duration: 2000
  })
}
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="indicator-section">
    <div class="section-title">
      <h3>{{ i18nStore.t('setting.sclip.indicator.title') }}</h3>
      <p class="subtitle">{{ i18nStore.t('setting.sclip.indicator.subtitle') }}</p>
    </div>

    <!-- 演示区域 -->
    <div class="demo-area">
      <div class="demo-content">
        <div class="clipboard-item">
          <div class="item-content">{{ i18nStore.t('setting.sclip.indicator.sampleText') }}</div>
          <div v-if="showTypeIndicatorValue" v-motion="showTypeMotion" class="type-indicator">
            Doc
          </div>
          <div v-if="showLongContentTipValue" v-motion="showTypeMotion" class="long-content-tip">
            Max
          </div>
        </div>
      </div>
      <p class="demo-description">{{ i18nStore.t('setting.sclip.indicator.previewDesc') }}</p>
    </div>

    <!-- 设置选项 -->
    <div class="settings-container">
      <div class="toggle-option">
        <div class="option-info">
          <div class="option-title">
            {{ i18nStore.t('setting.sclip.indicator.typeIndicator') }}
          </div>
          <div class="option-description">
            {{ i18nStore.t('setting.sclip.indicator.typeIndicatorDesc') }}
          </div>
        </div>
        <VSwitch v-model="showTypeIndicatorValue" />
      </div>

      <div class="toggle-option">
        <div class="option-info">
          <div class="option-title">
            {{ i18nStore.t('setting.sclip.indicator.longContentTip') }}
          </div>
          <div class="option-description">
            {{ i18nStore.t('setting.sclip.indicator.longContentTipDesc') }}
          </div>
        </div>
        <VSwitch v-model="showLongContentTipValue" />
      </div>

      <VAlert
        type="info"
        :title="i18nStore.t('setting.sclip.indicator.tipTitle')"
        :message="i18nStore.t('setting.sclip.indicator.tipMessage')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../common.scss';

// 定义变量
$border-radius: 10px;
$transition-default: 0.5s ease;
$indicator-size: 1.5em;
$indicator-padding: 0.3em;

@mixin toggle-text {
  color: var(--text-color);
  opacity: 0.7;
  transition: color $transition-default;
}

// 整体部分样式
.indicator-section {
  margin-bottom: 30px;
}

// 演示区域样式
.demo-area {
  margin-bottom: 30px;
  padding: 20px;
  background-color: var(--title-bar-bg);
  border-radius: $border-radius;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;

  .demo-content {
    margin-bottom: 10px;
    width: 244px;
    height: 120px;
    border-radius: 10px;
    background-color: var(--container-bg);
    box-sizing: border-box;
    position: relative;
    padding: 15px;
  }

  .demo-description {
    font-size: 14px;
    text-align: center;
    @include toggle-text;
  }
}

// 剪贴板内容项样式
.clipboard-item {
  background-color: var(--container-bg);
  border-radius: $border-radius;
  min-height: 100px;
  display: flex;
  align-items: center;

  .item-content {
    font-size: 14px;
    line-height: 1.5;
  }

  .type-indicator,
  .long-content-tip {
    position: absolute;
    bottom: 5%;
    right: 5%;
    width: $indicator-size;
    height: $indicator-size;
    padding: $indicator-padding;
    background-color: var(--button-primary-bg);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;

    &:not(:last-child) {
      right: calc(10px + #{$indicator-size * 1.5} + 5px);
      // transform: translateX(10px);
    }
  }

  .type-indicator {
    img {
      width: 100%;
      height: 100%;
    }
  }
}

// 设置选项样式
.settings-container {
}
</style>
