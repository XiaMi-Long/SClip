<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    clipboardOptions: ClipboardOptions
}>()
const clipboardOptions = ref(props.clipboardOptions)
</script>

<template>
    <div>
        {{ props.clipboardOptions }}
        {{ props.clipboardOptions.content }}
    </div>
</template>

<style scoped lang="scss"></style>