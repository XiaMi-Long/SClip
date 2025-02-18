<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import settingImage from '@renderer/assets/image/setting.png'

const configStore = useConfigStore()
const isMac = computed(() => configStore.getSetting.system.platform === 'darwin')
const isMainWindow = computed(() => configStore.getWindowId === 'main')
const handleMinimize = () => window.titleBar.minimize()
const handleMaximize = () => window.titleBar.maximize()
const handleClose = () => window.titleBar.close()

const handleSetting = () => {
    window.browserWindow.openSetting()
}
</script>

<template>
    <div class="title-bar" :class="{ 'is-mac': isMac }">
        <!-- Mac 风格控制按钮 -->
        <div v-if="isMac" class="traffic-lights">
            <button class="traffic-light close" @click="handleClose">
            </button>
            <button class="traffic-light minimize" @click="handleMinimize">
            </button>
        </div>

        <!-- 工具区域 -->
        <div class="tools-area" :class="{ 'tools-area-mac': isMac, 'tools-area-windows': !isMac }">
            <button class="tool-button" @click="handleSetting" :class="isMainWindow ? 'button-show' : 'button-hidden'">
                <img :src="settingImage" alt="设置" class="tool-icon">
            </button>
        </div>

        <!-- Windows 风格控制按钮 -->
        <div v-if="!isMac" class="window-controls">
            <button class="control-button minimize" @click="handleMinimize">
                <svg width="11" height="11" viewBox="0 0 11 11">
                    <path d="M11,4.9v1.1H0V4.399h11V4.9z" fill="currentColor" />
                </svg>
            </button>
            <button class="control-button maximize" @click="handleMaximize">
                <svg t="1739776494510" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    p-id="9149" width="11" height="11" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path
                        d="M936.8 87.2V936H87.2V87.2h849.6m4.8-79.2H81.6C40.8 8 8 40.8 8 81.6v860c0 40.8 32.8 73.6 73.6 73.6h860c40.8 0 73.6-32.8 73.6-73.6V82.4c0.8-41.6-32-74.4-73.6-74.4 0.8 0 0 0 0 0z"
                        p-id="9150" fill="#666666">
                    </path>
                </svg>
            </button>
            <button class="control-button close" @click="handleClose">
                <svg width="11" height="11" viewBox="0 0 11 11">
                    <path
                        d="M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z"
                        fill="currentColor" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.title-bar {
    height: 32px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    -webkit-app-region: drag;
    user-select: none;
    position: relative;
    background-color: var(--system-theme);
}

/* Mac 样式 */
.traffic-lights {
    position: absolute;
    top: 12px;
    left: 13px;
    z-index: 100;
    -webkit-app-region: no-drag;
}

.traffic-light {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: background-color 0.2s;
}

/* 分别定位三个按钮 */
.traffic-light.close {
    left: 0;
    background: transparent;
}

.traffic-light.minimize {
    left: 20px;
    background: transparent;
}

.traffic-light.maximize {
    left: 40px;
    background: transparent;
}

/* 悬停效果 */
/* .traffic-light.close:hover {
    background: #ff4d4d;
}

.traffic-light.minimize:hover {
    background: #f6b31d;
}

.traffic-light.maximize:hover {
    background: #24b238;
} */

/* 图标样式 */
.traffic-light svg {
    width: 12px;
    height: 12px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.2s;
}

.traffic-light:hover svg {
    opacity: 0.4;
}

.traffic-light svg circle {
    fill: none;
    stroke: rgba(0, 0, 0, 0.5);
    stroke-width: 1;
}

/* 标题居中 */
.title-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.title {
    font-size: 13px;
    color: #333;
    font-weight: 500;
}

/* 深色模式 */
/* @media (prefers-color-scheme: dark) {
    .title-bar {
        background: rgba(32, 32, 32, 0.8);
    }
} */

/* Windows 样式 */
.window-controls {
    display: flex;
    position: absolute;
    right: 0;
    -webkit-app-region: no-drag;
}

.control-button {
    width: 40px;
    height: 32px;
    border: none;
    background: transparent;
    outline: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
}

.control-button:hover {
    background: rgba(0, 0, 0, 0.1);
    color: white;
}


.control-button.maximize:hover {
    background: transparent;
    color: #666;
}


/*
.close:hover {
    background: #e81123;
    color: white;
} */

/* 工具区域样式 */
.tools-area {
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
    -webkit-app-region: no-drag;
}

/* 工具按钮样式 */
.tool-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.2s;
}

.tool-button:hover {
    background-color: rgba(0, 0, 0, 0.06);
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

/* Mac下工具区域位于右侧 */
.tools-area-mac {
    right: 0;
}

/* Windows下工具区域位于左侧 */
.tools-area-windows {
    left: 0;
}
</style>