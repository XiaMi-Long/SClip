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

const endenableDataDeduplicationValue = computed({
  get: () => props.endenableDataDeduplication,
  set: (value) => emit('update:endenableDataDeduplication', value)
})

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion

const cardListScrollMotion = {
  first: {
    initial: {
      x: 0,
      y: 0,
      opacity: 1
    },
    visible: {
      // 第一个卡片：位置1 -> 位置2 -> 位置3
      x: [0],
      y: [0],
      opacity: [1],
      transition: {
        duration: 6000,
        repeat: Infinity,
        repeatType: 'loop'
      }
    }
  }
}

const toggleEndenableDataDeduplication = (value: boolean): void => {
  endenableDataDeduplicationValue.value = value
  // 保存设置
  useConfigStore().setEndenableDataDeduplication(value)
  // 显示成功消息通知
  Message.success({
    title: i18nStore.t('common.save'),
    message: i18nStore.t('setting.sclip.deduplication.saveSuccess'),
    duration: 2000
  })
}
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="indicator-section">
    <div class="section-title">
      <h3>{{ i18nStore.t('setting.sclip.deduplication.title') }}</h3>
      <p class="subtitle">{{ i18nStore.t('setting.sclip.deduplication.subtitle') }}</p>
    </div>

    <!-- 演示区域 -->
    <div class="demo-area">
      <!-- <div v-motion="cardScrollMotion" class="wakeup__preview__container__cards__list"> -->
      <div class="preview-container-cards-list">
        <div class="preview-container-cards-list-item">
          {{ i18nStore.t('setting.sclip.deduplication.example1') }}
        </div>
        <div class="preview-container-cards-list-item">
          {{ i18nStore.t('setting.sclip.deduplication.example2') }}
        </div>
        <div class="preview-container-cards-list-item">
          {{ i18nStore.t('setting.sclip.deduplication.example3') }}
        </div>
      </div>
    </div>

    <div class="toggle-option">
      <div class="option-info">
        <div class="option-title">
          {{ i18nStore.t('setting.sclip.deduplication.enable') }}
        </div>
        <div class="option-description">
          {{ i18nStore.t('setting.sclip.deduplication.enableDesc') }}
        </div>
      </div>
      <VSwitch
        v-model="endenableDataDeduplicationValue"
        @change="toggleEndenableDataDeduplication"
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
    }
  }
}

// 演示区域样式
.demo-area {
  margin-bottom: 30px;
  height: 400px;
  background-color: var(--title-bar-bg);
  border-radius: $border-radius;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
}

$card-width: 240px;
$card-height: 380px;
$border-radius: 10px;
// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-container-cards-list {
  width: calc($card-width);
  height: calc($card-height);
  display: flex;
  gap: 5px;
  flex-direction: column;
  flex-wrap: wrap;
  will-change: transform, opacity;
  box-sizing: border-box;

  .preview-container-cards-list-item {
    width: calc($card-width);
    height: calc($card-height / 3 - 4px);
    @include flex-center;
    background-color: var(--container-bg);
    flex-direction: column;
    border-radius: $border-radius;
  }
}
</style>
