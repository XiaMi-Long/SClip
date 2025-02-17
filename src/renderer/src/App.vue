<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import TitleBar from './components/TitleBar/index.vue'
import { useClipboardStore } from './store/useClipboardStore'
import { useConfigStore } from './store/useConfigStore';
import { initSystemTheme } from './util/system.theme';

try {
  window.clipboard.setClipboardToRenderer((clipboardState: ClipboardState[]) => {
    useClipboardStore().pushClipboard(clipboardState)
  })

  window.appConfig.getAppSetting((setting: Setting) => {
    useConfigStore().setSetting(setting)

    initSystemTheme()
  })

} catch (error) {
  console.error('初始化数据加载失败:', error)
}

const isShowTitleBar = computed(() => useConfigStore().getSetting.system)
</script>

<template>
  <div>
    <TitleBar v-if="isShowTitleBar" />
    <RouterView />
  </div>
</template>
