<script setup lang="ts">
import { onMounted, useTemplateRef, ref } from 'vue'

const props = defineProps<{
    clipboardOptions: ClipboardState
}>()

const clipboardCardImage = useTemplateRef('clipboardCardImage')
const objectFit = ref<'contain' | 'cover'>('cover')

// 设置宽高比阈值
const RATIO_THRESHOLD = {
    MIN: 0.5,    // 高度是宽度的2倍以上认为是过长
    MAX: 2       // 宽度是高度的2倍以上认为是过宽
}

/**
 * 处理图片加载完成事件
 */
const handleImageLoad = () => {
    const img = clipboardCardImage.value
    if (img) {
        // 获取图片原始尺寸
        const { naturalWidth, naturalHeight } = img
        // 计算宽高比
        const ratio = naturalWidth / naturalHeight

        // 根据宽高比判断显示方式
        if (ratio < RATIO_THRESHOLD.MIN) {
            // 过长的竖图
            objectFit.value = 'contain'
        } else if (ratio > RATIO_THRESHOLD.MAX) {
            // 过宽的横图
            objectFit.value = 'contain'
        } else {
            // 正常比例的图片
            objectFit.value = ratio < 1 ? 'contain' : 'cover'
        }

        console.log(`图片尺寸: ${naturalWidth}x${naturalHeight}, 宽高比: ${ratio.toFixed(2)}, 显示方式: ${objectFit.value}`)
    }
}

onMounted(() => {
    const img = clipboardCardImage.value
    if (img) {
        if (img.complete) {
            handleImageLoad()
        }
        img.addEventListener('load', handleImageLoad)
    }
})
</script>

<template>
    <div class="clipboard-card-image-container">
        <img :src="props.clipboardOptions.content" alt="" class="clipboard-card-image" ref="clipboardCardImage"
            :style="{ objectFit }">
    </div>
</template>

<style scoped lang="scss">
.clipboard-card-image-container {
    width: 100%;
    height: 100%;
}

.clipboard-card-image {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}
</style>