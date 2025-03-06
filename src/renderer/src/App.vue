<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import TitleBar from './components/TitleBar/index.vue'
import { useClipboardStore } from './store/useClipboardStore'
import { useConfigStore } from './store/useConfigStore'
import { switchThemeMode } from './util/system.theme'
import { listenFromMain, invokeMain } from './util/ipc.renderer.service'

try {
  // 监听剪贴板数据更新
  listenFromMain.onClipboardUpdate((clipboardState: ClipboardState[]) => {
    useClipboardStore().pushClipboard(clipboardState)
  })

  // 监听应用配置更新
  listenFromMain.onAppSettingUpdate(async (setting: Setting) => {
    console.log('setting', setting)

    useConfigStore().setSetting(setting)
    if (setting.applicationTheme === 'system') {
      const isDark = await invokeMain.getNativeThemeShouldUseDarkColors()
      switchThemeMode(isDark ? 'dark' : 'light')
    } else {
      switchThemeMode(setting.applicationTheme)
    }
  })

  // 监听窗口ID更新
  listenFromMain.onWindowIdUpdate((windowId: string) => {
    useConfigStore().setWindowId(windowId)
  })

  // 监听系统主题变化
  listenFromMain.onNativeThemeUpdate((isDarkMode: boolean) => {
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
