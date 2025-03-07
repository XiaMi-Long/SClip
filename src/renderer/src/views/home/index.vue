<script setup lang="ts">
import SwiperContainer from './swiper-container/index.vue'
</script>

<template>
  <div class="home-container">
    <SwiperContainer />
  </div>
</template>

<style scoped lang="scss">
.home-container {
  width: 100%;
  height: calc(100% - var(--title-bar-height));
}
</style>
