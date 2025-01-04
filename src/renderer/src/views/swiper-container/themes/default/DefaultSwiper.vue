<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSwiper } from './hooks'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Keyboard } from 'swiper/modules';
import VClipboardCard from '../../../../components/VClipboardCard/index.vue'
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
            <SwiperSlide v-for="item in swiperStore.getSwiperLength" :key="item">
                <div class="clipboard-list">
                    <VClipboardCard types="text" />
                </div>
            </SwiperSlide>
        </Swiper>
    </div>

</template>

<style scoped lang="scss">
.swiper {
    height: 100vh;

    .clipboard-list {
        height: 100vh;
        width: 100vw;
        box-sizing: border-box;
        padding: 5px;
    }
}
</style>
