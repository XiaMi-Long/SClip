<script setup lang="ts">
import SwiperContainer from './swiper-container/index.vue'
import { useConfigStore } from '../../store/useConfigStore'

const configStore = useConfigStore()
</script>

<template>
    <div>
        <SwiperContainer :setting="configStore.getSetting" />
    </div>
</template>

<style scoped lang="scss"></style>