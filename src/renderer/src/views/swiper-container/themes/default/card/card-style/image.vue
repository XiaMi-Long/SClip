<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
const props = defineProps<{
    clipboardOptions: ClipboardOptions
}>()

const clipboardCardImage = useTemplateRef('clipboardCardImage')

onMounted(() => {
    console.log(clipboardCardImage.value)
})
</script>

<template>
    <div class="clipboard-card-image-container">
        <img :src="props.clipboardOptions.content" alt="" class="clipboard-card-image" ref="clipboardCardImage">
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
    object-fit: cover;
}
</style>