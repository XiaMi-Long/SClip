<script lang="ts" setup>
import { useConfigStore } from '../../../store/useConfigStore'
import { useI18nStore } from '../../../store/useI18nStore'

/**
 * 主题设置组件
 * 包含主题选择和强调色设置
 */
import { ref, computed } from 'vue'

// 获取 i18n store
const i18nStore = useI18nStore()

// 主题类型
interface Theme {
  id: ThemeMode
  name: string
  description: string
}

// 颜色类型
interface ColorOption {
  id: string
  type: 'solid' | 'gradient'
  value: string
  gradient?: {
    from: string
    to: string
    direction: string
  }
}

// 主题选项
const themes: Theme[] = [
  {
    id: 'light',
    name: i18nStore.t('setting.theme.light'),
    description: i18nStore.t('setting.theme.lightDesc')
  },
  {
    id: 'dark',
    name: i18nStore.t('setting.theme.dark'),
    description: i18nStore.t('setting.theme.darkDesc')
  },
  {
    id: 'system',
    name: i18nStore.t('setting.theme.system'),
    description: i18nStore.t('setting.theme.systemDesc')
  }
]

// 预设纯色选项
const solidColors: ColorOption[] = [
  { id: 'blue', type: 'solid', value: '#4285f4' }, // 默认蓝色
  { id: 'red', type: 'solid', value: '#ea4335' }, // 红色
  { id: 'green', type: 'solid', value: '#34a853' }, // 绿色
  { id: 'purple', type: 'solid', value: '#8e44ad' }, // 紫色
  { id: 'orange', type: 'solid', value: '#ff9800' }, // 橙色
  { id: 'teal', type: 'solid', value: '#009688' }, // 蓝绿色
  { id: 'pink', type: 'solid', value: '#e91e63' }, // 粉色
  { id: 'indigo', type: 'solid', value: '#3f51b5' }, // 靛蓝色
  // 添加新的单色
  { id: 'color1', type: 'solid', value: '#c5e3f6' },
  { id: 'color2', type: 'solid', value: '#fc5c9c' },
  { id: 'color3', type: 'solid', value: '#fccde2' },
  { id: 'color4', type: 'solid', value: '#fcefee' },
  { id: 'color5', type: 'solid', value: '#581b98' },
  { id: 'color6', type: 'solid', value: '#9c1de7' },
  { id: 'color7', type: 'solid', value: '#f3558e' },
  { id: 'color8', type: 'solid', value: '#faee1c' },
  { id: 'color9', type: 'solid', value: '#482ff7' },
  { id: 'color10', type: 'solid', value: '#2d6cdf' },
  { id: 'color11', type: 'solid', value: '#46c3db' },
  { id: 'color12', type: 'solid', value: '#f3f169' },
  { id: 'color13', type: 'solid', value: '#a7ff83' },
  { id: 'color14', type: 'solid', value: '#17b978' },
  { id: 'color15', type: 'solid', value: '#086972' },
  { id: 'color16', type: 'solid', value: '#085f63' }
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
const selectedApplicationPrimaryColor = ref(useConfigStore().getSetting.applicationPrimaryColor)

// 计算属性：所有颜色选项（将选中的颜色移到第一位）
const allColorOptions = computed(() => {
  // 只使用纯色
  const allColors = [...solidColors]

  // 找到当前选中的颜色
  const selectedColorIndex = allColors.findIndex((color) => {
    if (color.type === 'solid') {
      return color.value === selectedApplicationPrimaryColor.value
    }
    return false
  })

  // 如果找到选中的颜色，将其移到第一位
  if (selectedColorIndex !== -1) {
    const selectedColor = allColors[selectedColorIndex]
    // 创建新数组，将选中的颜色放在第一位
    return [
      selectedColor,
      ...allColors.slice(0, selectedColorIndex),
      ...allColors.slice(selectedColorIndex + 1)
    ]
  }

  return allColors
})

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
 * @param {ColorOption} color - 颜色选项
 */
const selectColor = (color: ColorOption): void => {
  // 对于纯色，直接使用颜色值
  if (color.type === 'solid') {
    selectedApplicationPrimaryColor.value = color.value
    useConfigStore().setApplicationPrimaryColor(color.value)
  }
}

/**
 * 检查颜色是否被选中
 * @param {ColorOption} color - 颜色选项
 * @returns {boolean} 是否选中
 */
const isColorSelected = (color: ColorOption): boolean => {
  if (color.type === 'solid') {
    return color.value === selectedApplicationPrimaryColor.value
  } else if (color.type === 'gradient' && color.gradient) {
    return color.gradient.from === selectedApplicationPrimaryColor.value
  }
  return false
}

/**
 * 处理颜色输入变化
 * @param {Event} e - 输入事件
 */
const handleColorInput = (e: Event): void => {
  const target = e.target as HTMLInputElement
  if (target && target.value) {
    selectColor({ id: 'custom', type: 'solid', value: target.value })
  }
}
</script>

<template>
  <div class="theme-settings">
    <div class="settings-header">
      <h2>{{ i18nStore.t('setting.theme.title') }}</h2>
      <p class="subtitle">{{ i18nStore.t('setting.theme.subtitle') }}</p>
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

    <!-- 强调色设置区域 -->
    <div class="accent-color-section">
      <div class="section-title">
        <h3>{{ i18nStore.t('setting.theme.accentColor') }}</h3>
        <p class="subtitle">{{ i18nStore.t('setting.theme.accentColorDesc') }}</p>
      </div>

      <!-- 颜色选择区域 -->
      <div class="color-options-container">
        <transition-group name="color-move" tag="div" class="color-options-wrapper">
          <template v-for="color in allColorOptions" :key="color.id">
            <div
              class="color-card"
              :class="{ active: isColorSelected(color) }"
              @click="selectColor(color)"
            >
              <div class="color-preview" :style="{ background: color.value }"></div>
            </div>
            <!-- <div v-if="(index + 1) % 8 === 0 && index !== allColorOptions.length - 1" class="color-divider"
              :key="`divider-${index}`"></div> -->
          </template>
        </transition-group>
      </div>

      <div class="custom-color-section">
        <div class="section-title">
          <h3>{{ i18nStore.t('setting.theme.customAccentColor') }}</h3>
        </div>
        <div class="color-picker-container">
          <input
            type="color"
            class="color-input"
            :value="selectedApplicationPrimaryColor"
            @input="handleColorInput"
          />
          <div
            class="color-preview-large"
            :style="{ background: selectedApplicationPrimaryColor }"
          ></div>
          <div class="color-value">{{ selectedApplicationPrimaryColor }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../base.scss';
// 主题卡片尺寸变量 - 可根据需要调整
$theme-card-width: 230px; // 卡片宽度
$theme-card-preview-height: 150px; // 预览区域高度
$color-card-width: 180px; // 颜色卡片宽度
$color-card-height: 120px; // 颜色卡片高度

// 整体更小的字体尺寸
$title-font-size: 20px;
$subtitle-font-size: 13px;
$section-title-font-size: 16px;
$text-font-size: 14px;

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
    background-color: var(--button-primary-bg);
    transition: background-color 0.5s;
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

// 强调色设置部分
.accent-color-section {
  margin-bottom: 30px;

  .section-title {
    margin-bottom: 20px;

    h3 {
      font-size: $section-title-font-size;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .subtitle {
      font-size: $subtitle-font-size;
      color: var(--text-color);
      opacity: 0.7;
    }
  }
}

.color-options-container {
  width: 100%;
  overflow: hidden;
}

.color-options-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(46px, 1fr));
  gap: 16px;
  width: 100%;
}

// 添加过渡动画样式
.color-move {
  transition: all 0.5s ease;
}

.color-divider {
  grid-column: 1 / -1;
  height: 1px;
  background-color: var(--title-bar-bg);
  margin: 8px 0;
  transition: all 0.5s ease;
}

.color-card {
  border-radius: 8px;
  overflow: hidden;
  // border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(5px);
  }

  .color-preview {
    width: 46px;
    height: 46px;
    border-radius: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .check-icon-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .color-info {
    padding: 10px;
    text-align: center;

    .color-type {
      font-size: 12px;
      opacity: 0.7;
      margin-bottom: 2px;
    }

    .color-value {
      font-size: 12px;
      font-family: monospace;
    }
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

// 自定义颜色选择器样式
.custom-color-section {
  margin-bottom: 40px;

  h3 {
    font-size: $section-title-font-size;
    font-weight: 500;
    margin-bottom: 15px;
  }
}

.color-picker-container {
  display: flex;
  align-items: center;
  background-color: var(--container-bg);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(128, 128, 128, 0.1);
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  background-color: transparent;
  margin-right: 15px;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
}

.color-preview-large {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-right: 15px;
}

.color-value {
  font-family: monospace;
  font-size: 14px;
  background-color: rgba(128, 128, 128, 0.1);
  padding: 5px 10px;
  border-radius: 6px;
  text-transform: uppercase;
}

// 响应式调整
@media (max-width: 768px) {
  .color-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .color-options {
    grid-template-columns: 1fr;
  }
}
</style>
