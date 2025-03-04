<script lang="ts" setup>
import { useConfigStore } from '../../../store/useConfigStore'

/**
 * 主题设置组件
 * 包含主题选择和强调色设置
 */
import { ref } from 'vue'

// 主题类型
interface Theme {
  id: ThemeMode
  name: string
  description: string
}

// 颜色类型
interface Color {
  id: string
  hex: string
}

// 主题选项
const themes: Theme[] = [
  {
    id: 'light',
    name: '亮色模式',
    description: '明亮的界面主题'
  },
  {
    id: 'dark',
    name: '暗色模式',
    description: '深色的界面主题'
  },
  {
    id: 'system',
    name: '系统偏好',
    description: '跟随系统设置自动切换'
  }
]

// 强调色选项
const accentColors: Color[] = [
  { id: 'blue', hex: '#4285F4' },
  { id: 'red', hex: '#EA4335' },
  { id: 'green', hex: '#34A853' },
  { id: 'yellow', hex: '#FBBC05' },
  { id: 'purple', hex: '#9C27B0' }
]

const checkIconMotion = {
  initial: { opacity: 0, scale: 0.6 },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 500,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
}

// 当前选中的主题和强调色
const selectedTheme = ref(useConfigStore().getSetting.applicationTheme)
const selectedAccentColor = ref('blue')
const customColorInput = ref('')
// 动画开启状态
const showAnimations = ref(true)

/**
 * 选择主题
 * @param {string} themeId - 主题ID
 */
const selectTheme = async (themeId: ThemeMode): Promise<void> => {
  console.log('selectTheme', themeId)

  selectedTheme.value = themeId
  useConfigStore().setApplicationTheme(themeId)
}

/**
 * 选择强调色
 * @param {string} colorId - 颜色ID
 */
const selectAccentColor = (colorId: string): void => {
  selectedAccentColor.value = colorId
}

/**
 * 切换动画开关
 */
const toggleAnimations = (): void => {
  showAnimations.value = !showAnimations.value
}
</script>

<template>
  <div class="theme-settings">
    <div class="settings-header">
      <h2>主题</h2>
      <p class="subtitle">选择您的风格或自定义主题</p>
    </div>

    <!-- 主题选择区域 -->
    <div class="theme-section">
      <div class="theme-options">
        <!-- 主题卡片 - 使用v-for循环渲染不同主题选项 -->
        <div
          v-for="theme in themes"
          :key="theme.id"
          class="theme-card"
          :class="{ active: selectedTheme === theme.id }"
          @click="selectTheme(theme.id)"
        >
          <!-- 主题预览窗口 -->
          <div class="theme-preview" :class="theme.id">
            <!-- 仿Mac窗口控制按钮 -->
            <div class="window-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <!-- 窗口内容模拟 -->
            <div class="window-content">
              <div class="content-block"></div>
              <div class="content-layout">
                <div class="content-sidebar"></div>
                <div class="content-main">
                  <div class="content-item"></div>
                  <div class="content-item"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 主题信息和选择状态 -->
          <div class="theme-info">
            <div
              v-if="selectedTheme === theme.id"
              v-motion="checkIconMotion"
              class="check-icon-wrapper"
            >
              <div class="check-icon">✓</div>
            </div>
            <div class="theme-text" :class="{ active: selectedTheme === theme.id }">
              <div class="theme-name">{{ theme.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 强调色选择区域 - 左右整体布局 -->
    <div class="accent-section">
      <!-- 左侧：标题和说明 -->
      <div class="section-title">
        <h3>强调色</h3>
        <p class="subtitle">使用系统或自定义强调色</p>
      </div>

      <!-- 右侧：颜色选择区域（垂直排列） -->
      <div class="color-selection">
        <!-- 预设颜色选项 -->
        <div class="preset-colors">
          <div
            v-for="color in accentColors"
            :key="color.id"
            class="color-circle"
            :style="{ backgroundColor: color.hex }"
            :class="{ active: selectedAccentColor === color.id }"
            @click="selectAccentColor(color.id)"
          >
            <div v-if="selectedAccentColor === color.id" class="check-icon">✓</div>
          </div>
        </div>

        <!-- 自定义颜色输入 -->
        <div class="custom-color">
          <div class="color-input-container">
            <div class="color-label">自定义颜色</div>
            <input
              v-model="customColorInput"
              type="text"
              placeholder="#4146F8"
              class="color-input"
            />
            <div
              class="color-circle color-preview"
              :style="{ backgroundColor: customColorInput }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 动画设置区域 - 左右布局 -->
    <div class="animation-section">
      <div class="animation-info">
        <h3>显示动画</h3>
        <p class="subtitle">启用或禁用界面动画</p>
      </div>

      <div class="toggle-container">
        <div class="toggle" @click="toggleAnimations">
          <div class="toggle-track" :class="{ active: showAnimations }">
            <div class="toggle-indicator"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 主题卡片尺寸变量 - 可根据需要调整
$theme-card-width: 230px; // 卡片宽度
$theme-card-preview-height: 150px; // 预览区域高度

// 整体更小的字体尺寸
$title-font-size: 20px;
$subtitle-font-size: 13px;
$section-title-font-size: 16px;
$text-font-size: 14px;

.theme-settings {
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
    transition: color 0.5s;
  }
}

// 分隔线样式
.divider {
  height: 1px;
  background-color: var(--title-bar-bg);
  transition: background-color 0.5s;
  margin: 30px 0;
}

// 主题选择部分
.theme-section {
  margin-bottom: 20px;
}

.theme-options {
  display: grid;
  // 使用变量控制卡片大小
  grid-template-columns: repeat(auto-fill, minmax($theme-card-width, 1fr));
  gap: 16px;
  margin-top: 15px;
}

.theme-card {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition:
    border-color 0.3s,
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    filter: brightness(1.05);
  }

  &.active {
    // border-color: var(--accent-color, #4146f8);
  }
}

.theme-preview {
  // 使用变量控制预览区域高度
  height: $theme-card-preview-height;
  padding: 10px;

  &.light {
    background-color: #f5f5f7;
  }

  &.dark {
    background-color: #1e1e1e;
  }

  &.system {
    background: linear-gradient(135deg, #f5f5f7 50%, #1e1e1ed9 50%);
  }
}

.window-dots {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &:nth-child(1) {
      background-color: #ff5f56;
    }

    &:nth-child(2) {
      background-color: #ffbd2e;
    }

    &:nth-child(3) {
      background-color: #27c93f;
    }
  }
}

.window-content {
  height: calc(100% - 16px);
  display: flex;
  flex-direction: column;
  gap: 6px;

  .content-block {
    height: 16px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.1);

    .dark & {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .content-layout {
    flex: 1;
    display: flex;
    gap: 6px;
  }

  .content-sidebar {
    width: 30%;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.05);

    .dark & {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .content-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .content-item {
    height: 24px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.05);

    .dark & {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}

.theme-info {
  display: flex;
  align-items: center;
  padding: 10px;
  height: 45px;
  box-sizing: border-box;
  background-color: var(--title-bar-bg);
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  position: relative;
}

.check-icon-wrapper {
  width: 24px;
  height: 24px;
  // margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  .check-icon {
    width: 22px;
    height: 22px;
    background-color: var(--accent-color, #4146f8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    font-weight: bold;
  }
}

.theme-text {
  transition: transform 0.5s;
  .theme-name {
    font-weight: 500;
    font-size: $text-font-size;
  }

  .theme-description {
    font-size: $subtitle-font-size;
    color: var(--text-color);
    transition: color 0.3s;
    margin-top: 2px;
  }

  &.active {
    transform: translateX(10px);
  }
}

// 强调色部分
.accent-section {
  margin-bottom: 20px;
  // 修改为整体左右布局
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .section-title {
    margin-bottom: 0;
    flex: 1;

    h3 {
      font-size: $section-title-font-size;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .subtitle {
      font-size: $subtitle-font-size;
      color: var(--text-secondary, #666);
    }
  }
}

// 右侧颜色选择区域
.color-selection {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 280px;
}

// 预设颜色选择
.preset-colors {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.color-circle {
  width: 30px; // 调小颜色圆圈
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: scale(1.05);
  }

  &.active {
    border-color: var(--border-color, #d1d1d1);
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px var(--accent-color, #4146f8);
  }

  .check-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    font-size: 12px;
  }
}

.custom-color {
  .color-label {
    font-size: $subtitle-font-size;
    margin-bottom: 6px;
    text-align: right;
  }

  .color-input-container {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-end;
  }

  .color-input {
    width: 120px;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--border-color, #d1d1d1);
    font-family: monospace;
    font-size: $subtitle-font-size;

    &:focus {
      outline: none;
      border-color: var(--accent-color, #4146f8);
      box-shadow: 0 0 0 2px rgba(65, 70, 248, 0.2);
    }
  }

  .color-preview {
    margin: 0;
    cursor: default;
  }
}

// 动画设置部分
.animation-section {
  // 保持左右布局，但调整一下样式以保持一致性
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .animation-info {
    flex: 1;

    h3 {
      font-size: $section-title-font-size;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .subtitle {
      font-size: $subtitle-font-size;
      color: var(--text-secondary, #666);
    }
  }
}

.toggle-container {
  margin-right: 0;
  padding-top: 4px;
}

.toggle {
  display: inline-block;
  cursor: pointer;

  .toggle-track {
    width: 46px;
    height: 24px;
    border-radius: 34px;
    background-color: #ccc;
    position: relative;
    transition: background-color 0.3s;

    &.active {
      background-color: var(--accent-color, #4146f8);
    }
  }

  .toggle-indicator {
    position: absolute;
    left: 2px;
    top: 2px;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    .toggle-track.active & {
      transform: translateX(22px);
    }
  }
}
</style>
