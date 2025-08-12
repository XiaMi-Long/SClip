<script lang="ts" setup>
import { computed } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'

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
  <div class="indicator-section">
    <div class="section-title">
      <h3>{{ i18nStore.t('setting.sclip.deduplication.title') }}</h3>
      <p class="subtitle">{{ i18nStore.t('setting.sclip.deduplication.subtitle') }}</p>
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
</style>
