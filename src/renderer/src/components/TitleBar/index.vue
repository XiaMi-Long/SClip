<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import settingImage from '@renderer/assets/image/setting.png'
import affixImage from '@renderer/assets/image/affix.png'
import { sendToMain } from '@renderer/util/ipc.renderer.service'

const configStore = useConfigStore()
// 是否是mac系统
const isMac = computed(() => configStore.getSetting.system.platform === 'darwin')
// 是否是主窗口，如果不是主窗口，则不显示设置相关按钮
const isMainWindow = computed(() => configStore.getWindowId === 'main')
// 是否固定窗口
const isAffix = computed(() => configStore.getSetting.appBehavior.isFixedWindow)

const handleMinimize = () => sendToMain.minimize()
// const handleMaximize = () => sendToMain.maximize()
const handleClose = () => sendToMain.close()
const handleSetting = () => sendToMain.openSetting()
const handleAffix = () => configStore.setIsFixedWindow(!isAffix.value)
</script>

<template>
  <div class="title-bar" :class="{ 'title-bar-mac': isMac, 'title-bar-win': !isMac }">
    <!-- Mac 风格控制按钮 -->
    <div v-if="isMac" class="mac-traffic-lights">
      <button class="mac-traffic-light mac-close" @click="handleClose"></button>
      <button class="mac-traffic-light mac-minimize" @click="handleMinimize"></button>
    </div>

    <!-- 工具区域 -->
    <div class="tools-area" :class="{ 'mac-tools-area': isMac, 'win-tools-area': !isMac }">
      <!-- 固定按钮 -->
      <button
        class="tool-button tool-button-affix"
        :class="[
          isMainWindow ? 'setting-button-show' : 'setting-button-hidden',
          isAffix ? 'affix-button-true' : 'affix-button-false'
        ]"
        @click="handleAffix"
      >
        <img :src="affixImage" alt="固定" class="tool-icon" />
      </button>

      <!-- 设置按钮 -->
      <button
        class="tool-button tool-button-setting"
        :class="[isMainWindow ? 'setting-button-show' : 'setting-button-hidden']"
        @click="handleSetting"
      >
        <img :src="settingImage" alt="设置" class="tool-icon" />
      </button>
    </div>

    <!-- Windows 风格控制按钮 -->
    <div v-if="!isMac" class="win-controls">
      <button class="win-control-button win-minimize" @click="handleMinimize">
        <svg width="8" height="8" viewBox="0 0 11 11">
          <path d="M11,4.9v1.1H0V4.399h11V4.9z" fill="currentColor" />
        </svg>
      </button>
      <button class="win-control-button win-maximize">
        <svg width="8" height="8" viewBox="0 0 1024 1024">
          <path
            d="M936.8 87.2V936H87.2V87.2h849.6m4.8-79.2H81.6C40.8 8 8 40.8 8 81.6v860c0 40.8 32.8 73.6 73.6 73.6h860c40.8 0 73.6-32.8 73.6-73.6V82.4c0.8-41.6-32-74.4-73.6-74.4z"
            fill="#666666"
          />
        </svg>
      </button>
      <button class="win-control-button win-close" @click="handleClose">
        <svg width="8" height="8" viewBox="0 0 11 11">
          <path
            d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 基础变量
$traffic-light-size: 12px;
$control-button-size: 46px; // 增大按钮尺寸
$control-button-height: 32px; // 控制按钮高度
$tool-button-size: 32px; // 工具按钮尺寸
$tool-button-height: 32px; // 工具按钮高度
$border-radius: 6px;

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin button-base {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }
}

// 主容器样式
.title-bar {
  height: var(--title-bar-height);
  backdrop-filter: blur(8px);
  @include flex-center;
  -webkit-app-region: drag;
  user-select: none;
  position: relative;
  border-bottom: 1px solid var(--title-bar-bg);
  background-color: var(--title-bar-bg);
  transition: all 0.5s;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;

  &-mac {
    justify-content: start;
  }

  &-win {
    justify-content: end;
  }
}

// macOS 样式
.mac {
  &-traffic-lights {
    position: absolute;
    top: 12px;
    left: 13px;
    z-index: 100;
    -webkit-app-region: no-drag;
  }

  &-traffic-light {
    position: absolute;
    width: $traffic-light-size;
    height: $traffic-light-size;
    border-radius: 50%;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    @include button-base;

    &.mac-close {
      left: 0;
      background: transparent;
    }

    &.mac-minimize {
      left: 20px;
      background: transparent;
    }

    svg {
      width: $traffic-light-size;
      height: $traffic-light-size;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover svg {
      opacity: 0.4;
    }
  }

  &-tools-area {
    right: 0;
  }
}

// Windows 样式
.win {
  &-controls {
    display: flex;
    position: absolute;
    right: 0;
    top: 0; // 从顶部开始
    height: 100%; // 占满高度
    -webkit-app-region: no-drag;
    gap: 0; // 移除间隙
    color: var(--text-color);
    transition: color 0.5s;
  }

  &-control-button {
    @include flex-center;
    @include button-base;
    width: $control-button-size;
    height: 100%; // 占满父容器高度
    border-radius: 0; // 移除圆角
    flex: 0 0 auto;
    color: inherit;

    svg {
      opacity: 0.7;
      width: 10px;
      height: 10px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }

    &.win-minimize:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }

    &.win-maximize {
      cursor: not-allowed;

      &:hover {
        background-color: rgba(0, 0, 0, 0.06);
      }
    }

    &.win-close {
      &:hover {
        background-color: #e81123; // 关闭按钮悬浮时的红色背景

        svg {
          opacity: 1;
          fill: white; // 悬浮时图标变白
        }
      }
    }
  }

  &-tools-area {
    left: 0;
  }
}

// 工具区域通用样式
.tools-area {
  height: 100%;
  position: absolute;
  @include flex-center;
  // padding: 0 8px;
  -webkit-app-region: no-drag;
}

.tool-button {
  @include flex-center;
  @include button-base;
  width: $tool-button-size;
  height: $tool-button-size;
  border-radius: $border-radius;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
}

.tool-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.tool-button:hover .tool-icon {
  opacity: 1;
  transform: rotate(30deg);
}

// 设置按钮显示/隐藏
.setting-button {
  &-show {
  }

  &-hidden {
    display: none;
  }
}

// 固定按钮是否选中
.affix-button-true {
  .tool-icon {
    opacity: 1;
    filter: brightness(2);
  }
}

.affix-button-false {
}
</style>
