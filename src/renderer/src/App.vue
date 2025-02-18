<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
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

  window.appConfig.setWindowId((windowId: string) => {
    useConfigStore().setWindowId(windowId)
    console.log('当前窗口id：windowId', windowId)
  })

} catch (error) {
  console.error('初始化数据加载失败:', error)
}

const isShowTitleBar = computed(() => useConfigStore().getSetting.system)

onMounted(() => {
  const route = useRoute()
  console.log(`当前窗口路由: ${route.path}`)
})
</script>

<template>
  <div class="app-container">
    <TitleBar v-if="isShowTitleBar" />
    <RouterView />
  </div>
</template>
