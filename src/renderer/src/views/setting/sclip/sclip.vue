<script lang="ts" setup>
import { ref } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'

// 导入拆分后的组件
import ImageDisplaySection from './components/ImageDisplaySection.vue'
import AnimationSection from './components/AnimationSection.vue'
import BehaviorSection from './components/BehaviorSection.vue'

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
const jumpToFirstPage = ref(true)
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

    <!-- 应用操作逻辑设置区域 -->
    <BehaviorSection v-model:jump-to-first-page="jumpToFirstPage" />
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
