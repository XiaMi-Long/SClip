<script setup lang="ts">
import { onMounted, ref, toRaw, computed } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'

const props = defineProps<{
  clipboardOptions: ClipboardState
}>()

const displayContent = ref('')
const containerRef = ref<HTMLElement | null>(null)
const configStore = useConfigStore()

const enableTextStyle = () => {
  return configStore.getSetting.clipboard.enableTextStyle
}

const longTextLimit = () => {
  return configStore.getSetting.clipboard.longTextLimit
}

const hasHtmlContent = () => {
  return (
    props.clipboardOptions.clipboardTypes.includes('text/html') &&
    props.clipboardOptions.meta.htmlContent &&
    enableTextStyle()
  )
}

const content = () => {
  if (!hasHtmlContent()) {
    if (props.clipboardOptions.content.length > longTextLimit()) {
      displayContent.value = props.clipboardOptions.content.slice(0, longTextLimit()) + '...'
    } else {
      displayContent.value = toRaw(props.clipboardOptions.content)
    }
  }
}

/**
 * 判断是否是颜色值
 * @returns {boolean} 是否是颜色值
 */
const isColorValue = () => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(props.clipboardOptions.content)
}

/**
 * 计算颜色值对应的CSS变量
 */
const colorStyle = computed(() => {
  if (!isColorValue()) return {}

  // 直接使用原始内容，而不是displayContent
  const color = props.clipboardOptions.content
  return {
    '--color-value': color,
    '--color-value-rgb': hexToRgb(color),
    '--color-value-alpha': `${color}20`, // 20%透明度
    '--color-value-alpha-light': `${color}10` // 10%透明度
  }
})

/**
 * 将十六进制颜色转换为RGB格式
 */
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

onMounted(() => {
  content()

  if (hasHtmlContent() && containerRef.value) {
    const shadow = containerRef.value.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: block;
        height: 100%;
        overflow: overlay;
      }

      /* 自定义滚动条样式 */
      :host::-webkit-scrollbar {
        width: 0px;
        height: 0px;
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
        word-wrap: break-word;
      }

      img {
        max-width: 100%;
        height: auto;
      }
    `

    const content = document.createElement('div')
    content.className = 'html-content'
    content.innerHTML = props.clipboardOptions.meta.htmlContent as string

    shadow.appendChild(style)
    shadow.appendChild(content)
  }
})
</script>

<template>
  <div
    class="clipboard-card-text-container"
    :class="{ 'color-value-container': isColorValue() }"
    :style="colorStyle"
  >
    <template v-if="hasHtmlContent()">
      <div ref="containerRef"></div>
    </template>
    <template v-else-if="isColorValue()">
      <div class="color-value">{{ displayContent }}</div>
    </template>
    <template v-else>
      <div class="plain-text">{{ displayContent }}</div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.clipboard-card-text-container {
  height: 90%;
  overflow: hidden;
}

.plain-text {
  white-space: pre;
  word-wrap: break-word;
  user-select: none;
}

.color-value-container {
  position: relative;
  background: radial-gradient(
    circle,
    rgba(var(--color-value-rgb), 1) 0%,
    rgba(var(--color-value-rgb), 0.7) 100%
  );
  border-radius: 8px;
}

.color-value {
  position: relative;
  z-index: 1;
  text-align: center;
  font-weight: bold;
  font-size: 1.2em;
  color: #fff;
  text-shadow: 0 0 10px rgba(var(--color-value-rgb), 0.5);
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
