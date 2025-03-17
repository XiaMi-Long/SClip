<script lang="ts" setup>
import { ref } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'

// 导入拆分后的组件
import ImageDisplaySection from './components/ImageDisplaySection.vue'
import AnimationSection from './components/AnimationSection.vue'
import WakeupSection from './components/WakeupSection.vue'
import HistoryLimitSection from './components/HistoryLimitSection.vue'
import FixedWindowSection from './components/FixedWindowSection.vue'
import IndicatorSection from './components/IndicatorSection.vue'
import TextStyleSection from './components/TextStyleSection.vue'

/**
 * SClip设置组件
 * 负责整合子组件并提供共享状态
 */

const setting = useConfigStore().getSetting

// 选中的图片显示模式
const selectedDisplayMode = ref<'auto' | 'contain' | 'cover'>(setting.imageSettings.displayMode)

// 是否启用图片微动画
const enableImageAnimation = ref(setting.imageSettings.enableAnimation)

// 是否每次打开应用时回到第一页
const jumpToFirstPage = ref(setting.appBehavior.jumpToFirstPage)

// 应用启动时加载的历史记录条数
const historyLimit = ref(setting.appBehavior.historyLimit || 50) // 默认值为50条

// 是否固定窗口
const isFixedWindow = ref(setting.appBehavior.isFixedWindow)

// 是否显示类型标识
const showTypeIndicator = ref(setting.appBehavior.showTypeIndicator)

// 是否显示长内容提示
const showLongContentTip = ref(setting.appBehavior.showLongContentTip)

// 是否启用文本样式
const enableTextStyle = ref(setting.clipboard.enableTextStyle)

// 文本样式缩放
const textStyleZoom = ref(setting.clipboard.textStyleZoom || 1)

// RTF文本缩放
const rtfTextZoom = ref(setting.clipboard.rtfTextZoom || 1)

// 超长文本显示上限
const longTextLimit = ref(setting.clipboard.longTextLimit || 400) // 默认值为400个字符
</script>

<template>
  <div class="sclip-settings">
    <div class="settings-header">
      <h2>SClip 内容显示</h2>
      <p class="subtitle">定制您的剪贴板内容显示方式</p>
    </div>

    <!-- 图片显示设置区域 -->
    <ImageDisplaySection v-model:display-mode="selectedDisplayMode" />

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 图片微动画设置区域 -->
    <AnimationSection v-model:enable-animation="enableImageAnimation" />

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 文本样式设置区域 -->
    <TextStyleSection v-model:enableTextStyle="enableTextStyle" v-model:textStyleZoom="textStyleZoom"
      v-model:rtfTextZoom="rtfTextZoom" v-model:longTextLimit="longTextLimit" />

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 应用行为设置区域标题 -->
    <div class="settings-header">
      <h2>应用行为设置</h2>
      <p class="subtitle">自定义应用的操作逻辑</p>
    </div>

    <!-- 唤醒回到首页设置 -->
    <WakeupSection v-model:jump-to-first-page="jumpToFirstPage" />

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 历史记录限制设置 -->
    <HistoryLimitSection v-model:history-limit="historyLimit" />

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 固定窗口设置 -->
    <FixedWindowSection v-model:is-fixed-window="isFixedWindow" />

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 标识和提示设置 -->
    <IndicatorSection v-model:show-type-indicator="showTypeIndicator" v-model:show-long-content-tip="showLongContentTip" />
  </div>
</template>

<style lang="scss" scoped>
.sclip-settings {
  max-width: 900px;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: 30px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 14px;
    color: var(--text-color);
    transition: color 0.5s ease;
    opacity: 0.7;
  }
}

.divider {
  height: 1px;
  background-color: var(--title-bar-bg);
  transition: background-color 0.5s;
  margin: 30px 0;
}
</style>
