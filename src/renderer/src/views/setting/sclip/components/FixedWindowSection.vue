<script lang="ts" setup>
import { computed } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'

/**
 * 固定窗口设置组件
 * 负责管理应用窗口固定状态
 */

const props = defineProps<{
  isFixedWindow: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isFixedWindow', value: boolean): void
}>()

// 是否固定窗口
const isFixedWindowValue = computed({
  get: () => props.isFixedWindow,
  set: (value) => emit('update:isFixedWindow', value)
})

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion

/**
 * 切换窗口固定状态
 * @param {boolean} value - 开关状态
 */
const toggleFixedWindow = (value: boolean): void => {
  isFixedWindowValue.value = value
  // 保存设置
  useConfigStore().setIsFixedWindow(value)
  // 显示成功消息通知
  Message.success({
    title: '设置已保存',
    message: '窗口固定设置已成功应用',
    duration: 2000
  })
}
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="fixed-window-section">
    <div class="section-title">
      <h3>固定窗口</h3>
      <p class="subtitle">设置应用主窗口是否固定在屏幕上</p>
    </div>

    <div class="fixed-window__toggle">
      <div class="fixed-window__toggle__info">
        <div class="fixed-window__toggle__title">固定窗口</div>
        <div class="fixed-window__toggle__description">
          启用后主窗口将固定在屏幕上，不会自动隐藏
        </div>
      </div>
      <VSwitch v-model="isFixedWindowValue" @change="toggleFixedWindow" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 定义变量
$border-radius: 10px;
$transition-default: 0.5s ease;

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
.fixed-window-section {
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

// 固定窗口功能区样式
.fixed-window__toggle {
  @include toggle-base;

  &__info {
    flex: 1;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  &__description {
    font-size: 14px;
    @include toggle-text;
  }
}
</style>
