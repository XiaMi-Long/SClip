<script lang="ts" setup>
/**
 * 趣味功能设置组件
 * 包含 Mac 状态栏设置等功能
 */
import { ref, computed } from 'vue'
import { VSwitch } from '@renderer/components/VSwitch'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'
import { Message } from '@renderer/components/VMessage'
import { VAlert } from '@renderer/components/VAlert'
// 获取配置存储
const configStore = useConfigStore()

// 获取 i18n store
const i18nStore = useI18nStore()

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
    title: i18nStore.t('common.save'),
    message: i18nStore.t('setting.fun.saveSuccess'),
    duration: 2000
  })
}

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="fun-settings">
    <div class="settings-header">
      <h2>{{ i18nStore.t('setting.fun.title') }}</h2>
      <p class="subtitle">{{ i18nStore.t('setting.fun.subtitle') }}</p>
    </div>

    <!-- Mac 状态栏设置区域 -->
    <div class="mac-statusbar-section">
      <div class="section-title">
        <h3>{{ i18nStore.t('setting.fun.macStatusBar') }}</h3>
        <p class="subtitle">{{ i18nStore.t('setting.fun.macStatusBarDesc') }}</p>
      </div>

      <!-- 状态栏预览区域 -->
      <div class="statusbar-preview">
        <div class="statusbar-preview__container">
          <div class="statusbar-preview__content">
            <div class="statusbar-preview__windows">
              <div class="statusbar-title">{{ i18nStore.t('setting.fun.windowsStyle') }}</div>
              <div class="windows-controls">
                <div class="control minimize">—</div>
                <div class="control maximize">□</div>
                <div class="control close">×</div>
              </div>
            </div>
            <div class="statusbar-preview__mac">
              <div class="statusbar-title">{{ i18nStore.t('setting.fun.macStyle') }}</div>
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
          <div class="statusbar-toggle__title">
            {{ i18nStore.t('setting.fun.enableMacStatusBar') }}
          </div>
          <div class="statusbar-toggle__description">
            {{ i18nStore.t('setting.fun.restartRequired') }}
          </div>
        </div>
        <VSwitch v-if="isWindows" v-model="forceMacStatusBar" @change="toggleMacStatusBar" />
      </div>
    </div>

    <VAlert
      v-if="!isWindows"
      :show-icon="true"
      type="warning"
      :title="i18nStore.t('setting.fun.noteTitle')"
      :message="i18nStore.t('setting.fun.macSystemNote')"
      class="clipboard-alert"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '../base.scss';
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
