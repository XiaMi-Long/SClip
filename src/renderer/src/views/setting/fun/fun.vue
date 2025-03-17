<script lang="ts" setup>
/**
 * 趣味功能设置组件
 * 包含 Mac 状态栏设置等功能
 */
import { ref, computed } from 'vue'
import { VSwitch } from '@renderer/components/VSwitch'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'
import { Message } from '@renderer/components/VMessage'
import { VAlert } from '@renderer/components/VAlert'
// 获取配置存储
const configStore = useConfigStore()

// 是否是 Windows 系统
const isWindows = computed(() => !configStore.setting.system?.isMac)

// 是否强制使用 Mac 状态栏
const forceMacStatusBar = ref(configStore.setting.forceMacStatusBar || false)

/**
 * 切换 Mac 状态栏设置
 * @param {boolean} value - 是否启用 Mac 状态栏
 */
const toggleMacStatusBar = (value: boolean): void => {
    forceMacStatusBar.value = value

    // 保存设置
    saveMacStatusBarSetting(value)
}

/**
 * 保存 Mac 状态栏设置
 * @param {boolean} value - 是否启用 Mac 状态栏
 */
const saveMacStatusBarSetting = (value: boolean): void => {
    // 调用 store 方法保存设置
    configStore.setForceMacStatusBar(value)

    // 显示成功消息通知
    Message.success({
        title: '设置已保存',
        message: '状态栏样式设置已成功应用，立即生效',
        duration: 2000
    })
}

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion
</script>

<template>
    <div v-motion="enableFirstShowTransition" class="fun-settings">
        <div class="settings-header">
            <h2>趣味功能</h2>
            <p class="subtitle">自定义应用的特殊功能和外观</p>
        </div>

        <!-- Mac 状态栏设置区域 -->
        <div class="mac-statusbar-section">
            <div class="section-title">
                <h3>Mac 风格状态栏</h3>
                <p class="subtitle">在 Windows 上使用 Mac 风格的窗口控制按钮</p>
            </div>

            <!-- 状态栏预览区域 -->
            <div class="statusbar-preview">
                <div class="statusbar-preview__container">
                    <div class="statusbar-preview__content">
                        <div class="statusbar-preview__windows">
                            <div class="statusbar-title">Windows 风格</div>
                            <div class="windows-controls">
                                <div class="control minimize">—</div>
                                <div class="control maximize">□</div>
                                <div class="control close">×</div>
                            </div>
                        </div>
                        <div class="statusbar-preview__mac">
                            <div class="statusbar-title">Mac 风格</div>
                            <div class="mac-controls">
                                <div class="control close"></div>
                                <div class="control minimize"></div>
                                <div class="control maximize"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 状态栏切换区域 -->
            <div class="statusbar-toggle">
                <div class="statusbar-toggle__info">
                    <div class="statusbar-toggle__title">启用 Mac 风格状态栏</div>
                    <div class="statusbar-toggle__description">
                        将窗口控制按钮从 Windows 风格切换为 Mac 风格，重启应用后生效
                    </div>
                </div>
                <VSwitch v-if="isWindows" v-model="forceMacStatusBar" @change="toggleMacStatusBar" />
            </div>
        </div>


        <VAlert v-if="!isWindows" :show-icon="true" type="warning" title="注意事项" message="您正在使用 Mac 系统，无需设置 Mac 风格状态栏。"
            class="clipboard-alert" />
    </div>
</template>

<style lang="scss" scoped>
$title-font-size: 20px;
$subtitle-font-size: 13px;
$section-title-font-size: 16px;
$text-font-size: 14px;
$border-radius: 10px;
$transition-default: 0.5s ease;
$accent-color: var(--button-primary-bg);

// 混合器
@mixin flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

@mixin card-container-base {
    background-color: var(--title-bar-bg);
    transition: background-color $transition-default;
    border-radius: $border-radius;
}

@mixin toggle-base {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background-color: var(--title-bar-bg);
    transition: background-color $transition-default;
    border-radius: $border-radius;
    margin-bottom: 15px;
}

@mixin toggle-text {
    color: var(--text-color);
    opacity: 0.7;
    transition: color $transition-default;
}

// 整体部分样式
.fun-settings {
    color: var(--text-color);
    transition: color 0.5s;
    font-size: $text-font-size;
    max-width: 900px;
    margin: 0 auto;
}

.settings-header {
    margin-bottom: 25px;

    h2 {
        font-size: $title-font-size;
        font-weight: 600;
        margin-bottom: 4px;
    }

    .subtitle {
        font-size: $subtitle-font-size;
        color: var(--text-color);
        opacity: 0.8;
    }
}

// Mac 状态栏设置区域样式
.mac-statusbar-section {
    margin-bottom: 30px;

    .section-title {
        margin-bottom: 20px;

        h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .subtitle {
            font-size: 14px;
            @include toggle-text;
        }
    }
}

// 状态栏预览区域样式
.statusbar-preview {
    margin-bottom: 20px;

    &__container {
        width: 100%;
        height: 250px;
        padding: 20px;
        box-sizing: border-box;
        @include card-container-base;
        @include flex-center;
    }

    &__content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        gap: 20px;
    }

    &__windows,
    &__mac {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 15px;
        border-radius: 8px;
        background-color: var(--container-bg);
    }

    .statusbar-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 15px;
    }

    // Windows 控制按钮样式
    .windows-controls {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
        max-width: 300px;
        height: 30px;
        background-color: var(--title-bar-bg);
        border-radius: 4px 4px 0 0;

        .control {
            width: 46px;
            height: 30px;
            @include flex-center;
            font-size: 16px;
            cursor: default;

            &.minimize {
                color: #888;
            }

            &.maximize {
                color: #888;
            }

            &.close {
                color: #888;
            }
        }
    }

    // Mac 控制按钮样式
    .mac-controls {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        padding-left: 12px;
        width: 100%;
        max-width: 300px;
        height: 30px;
        background-color: var(--title-bar-bg);
        border-radius: 4px 4px 0 0;

        .control {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            cursor: default;

            &.close {
                background-color: #ff5f57;
            }

            &.minimize {
                background-color: #ffbd2e;
            }

            &.maximize {
                background-color: #28c940;
            }
        }
    }
}

// 状态栏切换区域样式
.statusbar-toggle {
    @include toggle-base;

    &__info {
        flex: 1;
    }

    &__title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 5px;
    }

    &__description {
        font-size: 14px;
        @include toggle-text;
    }
}

// Mac 系统提示信息样式
.mac-notice {
    padding: 20px;
    background-color: var(--title-bar-bg);
    border-radius: $border-radius;
    text-align: center;
    font-size: 16px;
    color: var(--text-color);
    opacity: 0.8;
}

// 响应式调整
@media (max-width: 768px) {
    .statusbar-preview {
        &__content {
            flex-direction: column;
        }
    }
}
</style>
