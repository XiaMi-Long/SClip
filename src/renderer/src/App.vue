<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useClipboardStore } from './store/useClipboardStore'

onMounted(() => {
  window.clipboard.getClipboard((lastCopy) => {
    console.log(lastCopy);

    useClipboardStore().pushClipboard(lastCopy)
  })
})

</script>

<template>
  <div>
    <RouterView />
  </div>
</template>
