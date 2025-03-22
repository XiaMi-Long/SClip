<script lang="ts" setup>
import { computed, watch, ref, onMounted } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'
import VAlert from '@renderer/components/VAlert'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'

/**
 * 文本样式设置组件
 * 负责管理是否启用文本样式的设置
 */

const props = defineProps<{
  enableTextStyle: boolean
  textStyleZoom: number
  rtfTextZoom: number
  longTextLimit?: number
}>()

const emit = defineEmits<{
  (e: 'update:enableTextStyle', value: boolean): void
  (e: 'update:textStyleZoom', value: number): void
  (e: 'update:rtfTextZoom', value: number): void
  (e: 'update:longTextLimit', value: number): void
}>()

// 是否启用文本样式
const enableTextStyleValue = computed({
  get: () => props.enableTextStyle,
  set: (value) => emit('update:enableTextStyle', value)
})

// 文本样式缩放
const textStyleZoomValue = computed({
  get: () => props.textStyleZoom,
  set: (value) => emit('update:textStyleZoom', value)
})

// RTF文本缩放
const rtfTextZoomValue = computed({
  get: () => props.rtfTextZoom,
  set: (value) => emit('update:rtfTextZoom', value)
})

// 超长文本显示上限
const longTextLimitValue = computed({
  get: () => props.longTextLimit || 400,
  set: (value) => emit('update:longTextLimit', value)
})

// 自定义输入值
const customValue = ref('')

// 检查当前值是否为预设值，如果不是则设置为自定义输入
const initCustomValue = () => {
  const currentValue = props.longTextLimit || 400
  if (!textLimitPresets.includes(currentValue)) {
    customValue.value = currentValue.toString()
  }
}

// 预设的缩放值
const zoomPresets = [0.3, 0.5, 0.7, 0.9, 1, 1.2, 1.4, 1.5]

// 预设的文本长度限制选项
const textLimitPresets = [200, 300, 400, 500, 600]

// 监听值的变化，当值变化时保存设置
watch(
  [enableTextStyleValue, textStyleZoomValue, rtfTextZoomValue, longTextLimitValue],
  () => {
    saveSettings()
    if (textStyleZoomValue.value) {
      initShadowDOM()
    }
  },
  { deep: true }
)

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion

// Shadow DOM 容器引用
const htmlContentRef = ref<HTMLElement | null>(null)

// 示例数据
const plainTextExample = {
  id: 1,
  content: `  public static destroyWindow(key: string): boolean {
    const window = this.browserWindows.get(key)
    if (window) {
      window.destroy()
      this.browserWindows.delete(key)
      return true
    }
    return false
  }`
}

const htmlTextExample = {
  id: 2,
  content: `<meta charset='utf-8'><div style="color: #333333;background-color: #ffffff;font-family: 'CodeNewRoman Nerd Font',Monaco,monospace, Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12.887999999999998px;line-height: 23px;white-space: pre;"><div><span style="color: #333333;">  </span><span style="color: #1313ec;">public</span><span style="color: #333333;"> </span><span style="color: #1313ec;">static</span><span style="color: #333333;"> </span><span style="color: #735c2c;">destroyWindow</span><span style="color: #333333;">(</span><span style="color: #0a1776;">key</span><span style="color: #000000;">:</span><span style="color: #333333;"> </span><span style="color: #2f7a90;">string</span><span style="color: #333333;">)</span><span style="color: #000000;">:</span><span style="color: #333333;"> </span><span style="color: #2f7a90;">boolean</span><span style="color: #333333;"> {</span></div><div><span style="color: #333333;">    </span><span style="color: #1313ec;">const</span><span style="color: #333333;"> </span><span style="color: #0a1776;">window</span><span style="color: #333333;"> </span><span style="color: #000000;">=</span><span style="color: #333333;"> </span><span style="color: #1313ec;">this</span><span style="color: #333333;">.</span><span style="color: #0a1776;">browserWindows</span><span style="color: #333333;">.</span><span style="color: #735c2c;">get</span><span style="color: #333333;">(</span><span style="color: #0a1776;">key</span><span style="color: #333333;">)</span></div><div><span style="color: #333333;">    </span><span style="color: #a510cb;">if</span><span style="color: #333333;"> (</span><span style="color: #0a1776;">window</span><span style="color: #333333;">) {</span></div><div><span style="color: #333333;">      </span><span style="color: #0a1776;">window</span><span style="color: #333333;">.</span><span style="color: #735c2c;">destroy</span><span style="color: #333333;">()</span></div><div><span style="color: #333333;">      </span><span style="color: #1313ec;">this</span><span style="color: #333333;">.</span><span style="color: #0a1776;">browserWindows</span><span style="color: #333333;">.</span><span style="color: #735c2c;">delete</span><span style="color: #333333;">(</span><span style="color: #0a1776;">key</span><span style="color: #333333;">)</span></div><div><span style="color: #333333;">      </span><span style="color: #a510cb;">return</span><span style="color: #333333;"> </span><span style="color: #1313ec;">true</span></div><div><span style="color: #333333;">    }</span></div><div><span style="color: #333333;">    </span><span style="color: #a510cb;">return</span><span style="color: #333333;"> </span><span style="color: #1313ec;">false</span></div><div><span style="color: #333333;">  }</span></div></div>`
}

/**
 * 保存设置并显示通知
 */
const saveSettings = (): void => {
  // 保存设置
  useConfigStore().setEnableTextStyle({
    enableTextStyle: enableTextStyleValue.value,
    textStyleZoom: textStyleZoomValue.value,
    rtfTextZoom: rtfTextZoomValue.value,
    longTextLimit: longTextLimitValue.value
  })

  // 显示成功消息通知
  Message.success({
    title: '设置已保存',
    message: '文本样式设置已成功应用，下次启动时生效',
    duration: 2000
  })
}

/**
 * 初始化Shadow DOM
 */
const initShadowDOM = () => {
  if (htmlContentRef.value) {
    let shadow: ShadowRoot

    // 检查是否已经有Shadow DOM
    if (htmlContentRef.value.shadowRoot) {
      // 如果已经有Shadow DOM，直接使用它
      shadow = htmlContentRef.value.shadowRoot

      // 清除现有内容
      while (shadow.firstChild) {
        shadow.removeChild(shadow.firstChild)
      }
    } else {
      // 如果没有Shadow DOM，创建一个新的
      // 清除之前的内容
      while (htmlContentRef.value.firstChild) {
        htmlContentRef.value.removeChild(htmlContentRef.value.firstChild)
      }

      // 创建Shadow DOM
      shadow = htmlContentRef.value.attachShadow({ mode: 'open' })
    }

    // 添加样式
    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
        height: 100%;
        overflow: auto;
      }

      /* 自定义滚动条样式 */
      :host::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      :host::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
      }

      :host::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        transition: background 0.2s ease;
      }

      :host::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }

      .html-content {
        font-size: 12px;
        line-height: 1.5;
        word-wrap: break-word;
        zoom: ${textStyleZoomValue.value};
      }
    `

    // 创建内容容器
    const content = document.createElement('div')
    content.className = 'html-content'
    content.innerHTML = htmlTextExample.content

    // 添加到Shadow DOM
    shadow.appendChild(style)
    shadow.appendChild(content)
  }
}

/**
 * 选择预设的文本长度限制
 * @param {number} value - 预设值
 */
const selectTextLimitPreset = (value: number): void => {
  longTextLimitValue.value = value
  customValue.value = ''
}

/**
 * 应用自定义输入的文本长度限制
 */
const applyCustomTextLimit = (): void => {
  if (!customValue.value) return

  const value = parseInt(customValue.value)
  if (isNaN(value) || value <= 0) {
    Message.error({
      title: '输入错误',
      message: '请输入有效的正整数',
      duration: 2000
    })
    return
  }

  if (value < 100) {
    Message.warning({
      title: '输入错误',
      message: '请输入大于100的正整数',
      duration: 2000
    })
    return
  }
  longTextLimitValue.value = value
}

/**
 * 处理自定义输入框的按键事件
 * @param {KeyboardEvent} event - 键盘事件
 */
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    applyCustomTextLimit()
  }
}

// 组件挂载后初始化Shadow DOM
onMounted(() => {
  initShadowDOM()
  initCustomValue()
})
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="text-style-section">
    <div class="section-title">
      <h3>文本样式设置</h3>
      <p class="subtitle">自定义文本内容的显示样式</p>
    </div>

    <!-- 演示区域 -->
    <div class="demo-area">
      <div class="demo-content">
        <div class="comparison-container">
          <!-- 左侧：纯文本 -->
          <div class="clipboard-item">
            <div class="item-header">纯文本</div>
            <div class="item-content plain-text">
              {{ plainTextExample.content }}
            </div>
          </div>

          <!-- 右侧：富文本 -->
          <div class="clipboard-item">
            <div class="item-header">文本样式</div>
            <div class="item-content html-text">
              <div ref="htmlContentRef"></div>
            </div>
          </div>
        </div>
      </div>
      <p class="demo-description">左侧为纯文本效果，右侧为启用文本样式效果</p>
    </div>

    <!-- 设置选项 -->
    <div class="settings-container">
      <!-- 启用文本样式 -->
      <div class="setting-info setting-item">
        <div class="setting-title-area">
          <div class="setting-title">启用文本样式</div>
          <div class="setting-description">
            启用后，复制的文本内容将保留原始格式，如粗体、斜体、颜色等
          </div>
        </div>
        <VSwitch v-model="enableTextStyleValue" />
      </div>

      <!-- 文本样式缩放 -->
      <div class="setting-item zoom-section">
        <div class="setting-title">文本样式缩放</div>
        <div class="zoom-buttons">
          <button
            v-for="zoom in zoomPresets"
            :key="zoom"
            :class="['zoom-button', { active: textStyleZoomValue === zoom }]"
            @click="textStyleZoomValue = zoom"
          >
            {{ zoom === 1 ? '100%' : zoom * 100 + '%' }}
          </button>
        </div>
      </div>

      <!-- RTF文本缩放 -->
      <div class="setting-item zoom-section">
        <div class="setting-title">RTF文本缩放</div>
        <div class="zoom-buttons">
          <button
            v-for="zoom in zoomPresets"
            :key="zoom"
            :class="['zoom-button', { active: rtfTextZoomValue === zoom }]"
            @click="rtfTextZoomValue = zoom"
          >
            {{ zoom === 1 ? '100%' : zoom * 100 + '%' }}
          </button>
        </div>
      </div>

      <div class="setting-item length-section">
        <div class="setting-title">超长文本显示上限</div>
        <div class="setting-description">
          设置文本内容显示的最大字符数，超过此限制将被截断并显示"..."按钮
        </div>

        <div class="text-limit-presets">
          <button
            v-for="limit in textLimitPresets"
            :key="limit"
            :class="['text-limit-button', { active: longTextLimitValue === limit }]"
            @click="selectTextLimitPreset(limit)"
          >
            {{ limit }}
          </button>

          <div class="custom-input-container">
            <input
              v-model="customValue"
              type="number"
              min="100"
              placeholder="自定义"
              class="custom-input"
              @keydown="handleKeyDown"
            />
            <button class="apply-button" @click="applyCustomTextLimit">应用</button>
          </div>
        </div>
      </div>
    </div>

    <VAlert
      type="warning"
      title="RTF格式说明"
      message="RTF格式通常来自Word、Excel等Office应用程序的复制内容。调整RTF缩放可以优化此类富文本的显示效果，使其更易于阅读。"
    />

    <VAlert
      type="info"
      title="提示"
      message="启用文本样式后，从Word、网页等应用复制的文本将保留原始格式。禁用后，所有文本将以纯文本形式显示。"
    />
  </div>
</template>

<style lang="scss" scoped>
// 定义变量
$border-radius: 10px;
$transition-default: 0.5s ease;

// 混合器
@mixin toggle-text {
  color: var(--text-color);
  opacity: 0.7;
  transition: color $transition-default;
}

// 整体部分样式
.text-style-section {
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

// 演示区域样式
.demo-area {
  margin-bottom: 20px;
  padding: 20px;
  background-color: var(--title-bar-bg);
  border-radius: $border-radius;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;

  .demo-content {
    margin-bottom: 10px;
    width: 100%;
    border-radius: 10px;
    background-color: var(--container-bg);
    box-sizing: border-box;
    position: relative;
    padding: 15px;
  }

  .demo-description {
    font-size: 14px;
    text-align: center;
    @include toggle-text;
  }
}

// 比较容器
.comparison-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;

  .clipboard-item {
    flex: 1;
    background-color: var(--container-bg);
    width: 50%;
    border-radius: $border-radius;
    padding: 15px;
    min-height: 120px;
    display: flex;
    flex-direction: column;

    .item-header {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      text-align: center;
      padding-bottom: 5px;
      border-bottom: 1px solid var(--text-color);
    }

    .item-content {
      font-size: 14px;
      line-height: 1.5;
      flex: 1;

      &.plain-text {
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      &.html-text {
        :deep(b) {
          font-weight: bold;
        }

        :deep(span) {
          display: inline;
        }
      }
    }
  }
}

// 设置选项样式
.settings-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: var(--title-bar-bg);
  border-radius: $border-radius;

  .setting-item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    &:not(:last-child) {
      padding-bottom: 20px;
      border-bottom: 1px solid var(--container-bg);
    }
  }

  .setting-info {
    display: flex;

    .setting-title-area {
      flex: 1;
    }
  }

  .setting-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
    color: var(--text-color);
    flex: 1;
  }

  .setting-description {
    font-size: 14px;
    @include toggle-text;
    flex: 1;
    margin-bottom: 15px;
  }

  .zoom-section {
    .setting-title {
      margin-bottom: 15px;
    }
  }

  .zoom-buttons {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .zoom-button {
      flex: 1;
      min-width: 60px;
      padding: 8px 0;
      border-radius: 4px;
      background-color: var(--container-bg);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      color: var(--text-color);
      margin: 0 4px;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        background-color: var(--button-primary-bg);
        opacity: 0.7;
      }

      &.active {
        background-color: var(--button-primary-bg);
        color: white;
      }
    }
  }

  .length-section {
    .text-limit-presets {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;

      .text-limit-button {
        padding: 6px 12px;
        border-radius: 6px;
        background-color: var(--container-bg);
        color: var(--text-color);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;

        &:hover {
          background-color: var(--button-primary-bg);
          opacity: 0.7;
        }

        &.active {
          background-color: var(--button-primary-bg);
          color: white;
        }
      }

      .custom-input-container {
        display: flex;
        align-items: center;
        gap: 8px;

        .custom-input {
          width: 80px;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid var(--title-bar-bg);
          background-color: var(--container-bg);
          color: var(--text-color);
          font-size: 14px;
          transition: all 0.3s ease;

          &:focus {
            outline: none;
            border-color: var(--button-primary-bg);
            box-shadow: 0 0 0 2px rgba(var(--button-primary-bg), 0.2);
          }

          &::placeholder {
            color: var(--text-color);
            opacity: 0.5;
          }

          /* 移除数字输入框的上下箭头 */
          &::-webkit-inner-spin-button,
          &::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          -moz-appearance: textfield;
        }

        .apply-button {
          padding: 6px 12px;
          border-radius: 6px;
          background-color: var(--button-primary-bg);
          color: white;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background-color: var(--button-primary-hover-bg);
            opacity: 0.9;
          }
        }
      }
    }
  }
}

// 警告和提示信息
VAlert {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
