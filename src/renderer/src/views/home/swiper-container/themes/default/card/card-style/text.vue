<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    clipboardOptions: ClipboardState
}>()


</script>

<template>
    <div class="clipboard-card-text-container">
        <!-- {{ props.clipboardOptions }} -->
        <!-- <br> -->
        {{ props.clipboardOptions.content }}
    </div>
</template>

<style scoped lang="scss">
.clipboard-card-text-container {
    height: 90%;
    overflow: hidden;
    white-space: pre;
    word-wrap: break-word;
}
</style>