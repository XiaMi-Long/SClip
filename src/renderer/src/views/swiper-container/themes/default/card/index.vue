<script setup lang="ts">
import { ref, computed } from 'vue'
import TextCard from './card-style/text.vue'
import ImageCard from './card-style/image.vue'
const props = defineProps<{
    clipboardOptions: ClipboardOptions
}>()

const cardStyle = ref({
    text: 'clipboard-card',
    image: 'clipboard-card image-type-card',
    html: 'clipboard-card html-type-card',
})
const cardType = computed(() => {
    return cardStyle.value[props.clipboardOptions.type]
})


</script>
ß
<template>
    <div class="clipboard-card-container">
        <div v-if="props?.clipboardOptions?.type" :class="cardType">
            <template v-if="props?.clipboardOptions?.type === 'text'">
                <TextCard :clipboardOptions="props.clipboardOptions" />
            </template>
            <template v-if="props?.clipboardOptions?.type === 'image'">
                <ImageCard :clipboardOptions="props.clipboardOptions" />
            </template>
        </div>
    </div>


</template>

<style scoped lang="scss">
.clipboard-card-container {
    // 计算高度：(362px - 15px margin) / 3 cards ≈ 115px
    height: 137px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgb(132 132 132 / 10%);

    // 内容布局
    display: flex;
    flex-direction: column;

    // 确保内容不会溢出
    overflow: hidden;

    cursor: pointer;

    color: #3c3c43;

    font-size: 14px;

    border-radius: 5px;
}

// 卡片样式
.clipboard-card {
    height: 100vh;
    padding: 10px;
}

// 图片类型卡片
.image-type-card {
    padding: 0px;
    height: 100%;
}
</style>
