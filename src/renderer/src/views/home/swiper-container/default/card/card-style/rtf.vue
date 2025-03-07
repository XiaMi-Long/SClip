<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'

const props = defineProps<{
  clipboardOptions: ClipboardState
}>()

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (containerRef.value) {
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

            .rtf-content {
                word-wrap: break-word;
                zoom: ${useConfigStore().getSetting.rtfTextZoom}
            }

            img {
                max-width: 100%;
                height: auto;
            }
        `

    const content = document.createElement('div')
    content.className = 'rtf-content'
    content.innerHTML = props.clipboardOptions.meta.rtf_html

    shadow.appendChild(style)
    shadow.appendChild(content)
  }
})
</script>

<template>
  <div class="clipboard-card-text-container">
    <div ref="containerRef"></div>
  </div>
</template>

<style scoped lang="scss">
.clipboard-card-text-container {
  height: 90%;
  overflow: hidden;
}
</style>
