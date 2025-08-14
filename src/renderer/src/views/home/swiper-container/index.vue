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

const currentCardStyle = computed(() => {
  return configStore.getSetting?.currentCardStyle
})
</script>

<template>
  <div class="swiper-container">
    <DefaultSwiper v-if="currentCardStyle === 'default' && isShow" />
    <EffectsSwiper v-if="currentCardStyle === 'effects' && isShow" />
  </div>
</template>

<style scoped lang="scss">
.swiper-container {
  height: 100%;
}
</style>
