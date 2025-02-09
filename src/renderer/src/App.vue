<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useClipboardStore } from './store/useClipboardStore'
import { useConfigStore } from './store/useConfigStore';


try {
  window.clipboard.setClipboardToRenderer((clipboardState: ClipboardState[]) => {
    useClipboardStore().pushClipboard(clipboardState)
  })
  window.setting.setSettingToRender((setting: Setting) => {
    useConfigStore().setSettingToRender(setting)
  })
} catch (error) {
  console.error('初始化数据加载失败:', error)
}


</script>

<template>
  <div>
    <RouterView />
  </div>
</template>
