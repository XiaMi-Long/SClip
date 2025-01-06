<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Keyboard } from 'swiper/modules';
import VClipboardCard from "./card/index.vue"
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useSwiperStore } from '@renderer/store/useSwiperStore'
import { useClipboardStore } from '@renderer/store/useClipboardStore'
// 导入必要的样式
import 'swiper/css'
import 'swiper/css/pagination';
import 'swiper/css/keyboard';
// const { } = useSwiper()
const configStore = useConfigStore()
const swiperStore = useSwiperStore()
const clipboardStore = useClipboardStore()
const swiperParams = ref({
    keyboard: {
        enabled: true,
        onlyInViewport: false,
    },
    modules: [Pagination, Keyboard],
})
onMounted(() => {
    console.log(configStore.getSetting);

})
</script>

<template>
    <div>
        <Swiper v-bind="swiperParams">
            <!-- 循环swiper长度 -->
            <SwiperSlide v-for="(swiper_item, swiper_index) in swiperStore.getSwiperLength" :key="swiper_index">

                <div class="clipboard-list">

                    <!-- 循环swiper内部card长度 -->
                    <template v-for="(card_item, card_index) in configStore.getSetting.swiperShowCount">

                        <!-- 注释计算方式：swiper_index * configStore.swiperConfig.swiperShowCount + card_index -->
                        <VClipboardCard
                            :clipboardOptions="clipboardStore.getClipboard[swiper_index * configStore.getSetting.swiperShowCount + card_index]" />

                    </template>

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
