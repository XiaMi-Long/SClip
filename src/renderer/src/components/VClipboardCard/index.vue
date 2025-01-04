<script setup lang="ts">
import { IClipboardCardProps } from './types'

const props = defineProps<IClipboardCardProps>()
</script>

<template>
    <div>
        <div class="clipboard-card">
            {{ props.types }}
        </div>
        <div class="clipboard-card">
            {{ props.types }}
        </div>
        <div class="clipboard-card">
            {{ props.types }}
        </div>

    </div>

</template>

<style scoped lang="scss">
// 卡片样式
.clipboard-card {
    // 计算高度：(362px - 15px margin) / 3 cards ≈ 115px
    height: 137px;
    padding: 10px;

    box-sizing: border-box;
    box-shadow: 0 2px 4px rgb(132 132 132 / 10%);

    // 内容布局
    display: flex;
    flex-direction: column;

    // 确保内容不会溢出
    overflow: hidden;

    cursor: pointer;

    color: #3c3c43;
}

// 图片类型卡片
.image-type-card {
    padding: 0px;
    height: 117px;
}
</style>
