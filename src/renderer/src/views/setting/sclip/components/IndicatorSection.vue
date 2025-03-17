<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'
import VAlert from '@renderer/components/VAlert'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'

/**
 * 标识和提示设置组件
 * 负责管理内容类型标识和长内容提示的显示
 */

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
    title: '设置已保存',
    message: '显示设置已成功应用，下次启动时生效',
    duration: 2000
  })
}
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="indicator-section">
    <div class="section-title">
      <h3>内容标识与提示</h3>
      <p class="subtitle">自定义剪贴板内容的标识和提示显示方式</p>
    </div>

    <!-- 演示区域 -->
    <div class="demo-area">
      <div class="demo-content">
        <div class="clipboard-item">
          <div class="item-content">这是一段示例文本内容，用于展示标识和提示的效果</div>
          <div v-if="showTypeIndicatorValue" v-motion="showTypeMotion" class="type-indicator">
            Doc
          </div>
          <div v-if="showLongContentTipValue" v-motion="showTypeMotion" class="long-content-tip">
            Max
          </div>
        </div>
      </div>
      <p class="demo-description">实时预览标识和提示的显示效果</p>
    </div>

    <!-- 设置选项 -->
    <div class="settings-container">
      <div class="setting-toggle">
        <div class="setting-info">
          <div class="setting-title">内容类型标识</div>
          <div class="setting-description">在内容右下角显示类型图标，帮助快速识别内容类型</div>
        </div>
        <VSwitch v-model="showTypeIndicatorValue" />
      </div>

      <div class="setting-toggle">
        <div class="setting-info">
          <div class="setting-title">长内容提示</div>
          <div class="setting-description">当内容超出显示范围时，显示提示标记</div>
        </div>
        <VSwitch v-model="showLongContentTipValue" />
      </div>

      <VAlert
        type="info"
        title="提示"
        message="Max表示内容长度超出显示范围，Doc表示内容类型为文档（Word、Excel、PPT等），txt表示内容类型为文本"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 定义变量
$border-radius: 10px;
$transition-default: 0.5s ease;
$indicator-size: 1.5em;
$indicator-padding: 0.3em;

// 混合器
@mixin toggle-base {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: var(--title-bar-bg);
  transition: background-color $transition-default;
  border-radius: $border-radius;
  margin-bottom: 15px;
}

@mixin toggle-text {
  color: var(--text-color);
  opacity: 0.7;
  transition: color $transition-default;
}

// 整体部分样式
.indicator-section {
  margin-bottom: 30px;

  .section-title {
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .subtitle {
      font-size: 14px;
      @include toggle-text;
    }
  }
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
  .setting-toggle {
    @include toggle-base;

    .setting-info {
      flex: 1;
    }

    .setting-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .setting-description {
      font-size: 14px;
      @include toggle-text;
    }
  }
}
</style>
