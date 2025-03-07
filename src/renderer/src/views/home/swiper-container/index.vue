<script setup lang="ts">
// 改为静态导入
import DefaultSwiper from './default/swiper.vue'
import { useClipboardStore } from '@renderer/store/useClipboardStore'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { computed } from 'vue'

const clipboardStore = useClipboardStore()
const configStore = useConfigStore()

const isShow = computed(() => {
  return clipboardStore.getClipboard.length > 0 && configStore.getSetting?.applicationTheme
})
</script>

<template>
  <div class="swiper-container">
    <DefaultSwiper v-if="isShow" />
  </div>
</template>

<style scoped lang="scss">
.swiper-container {
  height: 100%;
}
</style>
