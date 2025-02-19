<script setup lang="ts">
import SwiperContainer from './swiper-container/index.vue'
import { useConfigStore } from '../../store/useConfigStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="home-container">
    <SwiperContainer :setting="configStore.getSetting" />
  </div>
</template>

<style scoped lang="scss">
.home-container {
  width: 100%;
  height: calc(100% - var(--title-bar-height));
}
</style>
