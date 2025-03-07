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
    <Transition name="fade">
      <DefaultSwiper v-if="isShow" />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.swiper-container {
  height: 100%;

  // 过渡动画样式
  .fade-enter-active,
  .fade-leave-active {
    transition: transform 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: translateY(10px);
  }

  .fade-enter-to,
  .fade-leave-from {
    transform: translateY(0);
  }
}
</style>
