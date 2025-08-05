<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'
import VAlert from '@renderer/components/VAlert'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'

// 获取 i18n store
const i18nStore = useI18nStore()

const props = defineProps<{
  endenableDataDeduplication: boolean
}>()

const emit = defineEmits<{
  (e: 'update:endenableDataDeduplication', value: boolean): void
}>()

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="indicator-section">
    <div class="section-title">
      <h3>{{ i18nStore.t('setting.sclip.deduplication.title') }}</h3>
      <p class="subtitle">{{ i18nStore.t('setting.sclip.deduplication.subtitle') }}</p>
    </div>

    <!-- 演示区域 -->
    <div class="demo-area">
      <div class="demo-content">
        <div class="clipboard-item">
          <div class="item-content">{{ i18nStore.t('setting.sclip.indicator.sampleText') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
</style>
