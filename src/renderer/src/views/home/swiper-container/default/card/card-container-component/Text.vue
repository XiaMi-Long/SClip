<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue'
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
  <div class="clipboard-card-text-container">
    <template v-if="hasHtmlContent()">
      <div ref="containerRef"></div>
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
</style>
