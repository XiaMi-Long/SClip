<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useClipboardStore } from './store/useClipboardStore'
import { useConfigStore } from './store/useConfigStore';

onMounted(() => {
  window.clipboard.setClipboard((clipboardState: ClipboardState[]) => {
    useClipboardStore().pushClipboard(clipboardState)
  })
  window.setting.setSetting((setting: Setting) => {
    useConfigStore().setSetting(setting)
  })
})

</script>

<template>
  <div>
    <RouterView />
  </div>
</template>
