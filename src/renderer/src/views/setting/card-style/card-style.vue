<script lang="ts" setup>
import { useI18nStore } from '@renderer/store/useI18nStore'

// 获取 i18n store
const i18nStore = useI18nStore()
</script>

<template>
  <div class="sclip-settings">
    <div class="settings-header">
      <h2>{{ i18nStore.t('setting.cardStyle.title') }}</h2>
      <p class="subtitle">{{ i18nStore.t('setting.cardStyle.subtitle') }}</p>
    </div>

    <!-- 分隔线 -->
    <div class="divider"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '../base.scss';
</style>
