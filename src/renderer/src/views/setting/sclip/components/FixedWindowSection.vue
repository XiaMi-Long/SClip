<script lang="ts" setup>
import { computed } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'

/**
 * 固定窗口设置组件
 * 负责管理应用窗口固定状态
 */

// 获取 i18n store
const i18nStore = useI18nStore()

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
    title: i18nStore.t('common.save'),
    message: i18nStore.t('setting.sclip.fixedWindow.saveSuccess'),
    duration: 2000
  })
}
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="fixed-window-section">
    <div class="section-title">
      <h3>{{ i18nStore.t('setting.sclip.fixedWindow.title') }}</h3>
      <p class="subtitle">{{ i18nStore.t('setting.sclip.fixedWindow.subtitle') }}</p>
    </div>

    <div class="toggle-option">
      <div class="option-info">
        <div class="option-title">
          {{ i18nStore.t('setting.sclip.fixedWindow.toggleTitle') }}
        </div>
        <div class="option-description">
          {{ i18nStore.t('setting.sclip.fixedWindow.toggleDesc') }}
        </div>
      </div>
      <VSwitch v-model="isFixedWindowValue" @change="toggleFixedWindow" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../common.scss';

// 定义变量
$border-radius: 10px;
$transition-default: 0.5s ease;

// 整体部分样式
.fixed-window-section {
  margin-bottom: 30px;
}
</style>
