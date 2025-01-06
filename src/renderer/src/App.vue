<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useClipboardStore } from './store/useClipboardStore'
import { useConfigStore } from './store/useConfigStore';

onMounted(() => {
  window.clipboard.getClipboard((lastCopy: ClipboardState) => {
    console.log(lastCopy);
    useClipboardStore().pushClipboard(lastCopy)
  })
  window.setting.getSetting((setting: Setting) => {
    useConfigStore().setSetting(setting)
  })
})

</script>

<template>
  <div>
    <RouterView />
  </div>
</template>
