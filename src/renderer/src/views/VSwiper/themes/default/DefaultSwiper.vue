<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSwiper } from './hooks'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Keyboard } from 'swiper/modules';
import { useSwiperStore } from '@renderer/store/useSwiperStore'
// 导入必要的样式
import 'swiper/css'
import 'swiper/css/pagination';
import 'swiper/css/keyboard';
// const { } = useSwiper()
const swiperStore = useSwiperStore()
const swiperParams = ref({
    keyboard: {
        enabled: true,
        onlyInViewport: false,
    },
    modules: [Pagination, Keyboard],
})

function initSwiper() {

}

onMounted(() => {
    initSwiper()
})
</script>

<template>
    <div>
        <Swiper v-bind="swiperParams">
            <SwiperSlide v-for="item in swiperStore.getSwiperLength" :key="item">12312</SwiperSlide>
        </Swiper>
    </div>

</template>

<style scoped lang="scss">
.swiper {
    width: 100vw;
    height: 100vh;
}
</style>
