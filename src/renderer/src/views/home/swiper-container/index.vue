<script setup lang="ts">
// 改为静态导入
import DefaultSwiper from './default/swiper.vue'
import EffectsSwiper from './effects/index.vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { computed } from 'vue'

const configStore = useConfigStore()

const isShow = computed(() => {
  return configStore.getSetting?.applicationTheme
})
</script>

<template>
  <div class="swiper-container">
    <DefaultSwiper v-if="isShow" />
    <!-- <EffectsSwiper v-if="isShow" /> -->
  </div>
</template>

<style scoped lang="scss">
.swiper-container {
  height: 100%;
}
</style>
