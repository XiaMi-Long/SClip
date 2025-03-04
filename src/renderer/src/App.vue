<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import TitleBar from './components/TitleBar/index.vue'
import { useClipboardStore } from './store/useClipboardStore'
import { useConfigStore } from './store/useConfigStore'
import { switchThemeMode } from './util/system.theme'

try {
  window.clipboard.setClipboardToRenderer((clipboardState: ClipboardState[]) => {
    useClipboardStore().pushClipboard(clipboardState)
  })

  window.appConfig.getAppSetting(async (setting: Setting) => {
    console.log('setting', setting)

    useConfigStore().setSetting(setting)
    if (setting.applicationTheme === 'system') {
      const isDark = await window.systemTheme.getNativeThemeShouldUseDarkColors()
      switchThemeMode(isDark ? 'dark' : 'light')
    } else {
      switchThemeMode(setting.applicationTheme)
    }
  })

  window.appConfig.setWindowId((windowId: string) => {
    useConfigStore().setWindowId(windowId)
  })

  window.systemTheme.sendNativeThemeUpdated((isDarkMode: boolean) => {
    console.log(useConfigStore().getSetting)

    if (useConfigStore().getSetting.applicationTheme === 'system') {
      switchThemeMode(isDarkMode ? 'dark' : 'light')
    }
  })
} catch (error) {
  console.error('初始化数据加载失败:', error)
}

const isShowTitleBar = computed(() => useConfigStore().getSetting.system)
</script>

<template>
  <div class="app-container">
    <TitleBar v-if="isShowTitleBar" />
    <RouterView />
  </div>
</template>

<style lang="scss">
.app-container {
  width: 100vw;
  height: 100vh;
}

#app {
  border-radius: 8px;
  overflow: hidden;
  height: 100vh;
  background: var(--container-bg);
  /* 使用你的主题背景色 */
}

/* Windows下特殊处理 */
@media screen and (-ms-high-contrast: active),
(-ms-high-contrast: none) {
  #app {
    border: 1px solid transparent;
    /* 防止Windows下边缘锯齿 */
  }
}
</style>
