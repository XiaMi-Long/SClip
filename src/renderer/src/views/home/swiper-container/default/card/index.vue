<script setup lang="ts">
import { ref, computed } from 'vue'
import TextCard from './card-container-component/Text.vue'
import ImageCard from './card-container-component/Image.vue'
import RtfCard from './card-container-component/Rtf.vue'

const props = defineProps<{
  clipboardOptions: ClipboardState
}>()

const cardStyle = ref({
  text: 'clipboard-card',
  image: 'clipboard-card image-type-card',
  html: 'clipboard-card html-type-card'
})
const cardType = computed(() => {
  return cardStyle.value[props.clipboardOptions.type]
})
</script>

<template>
  <div class="clipboard-card-container">
    <div v-if="props?.clipboardOptions?.type" v-once :class="cardType">
      <template v-if="props?.clipboardOptions?.type === 'text'">
        <TextCard :clipboard-options="props.clipboardOptions" />
      </template>
      <template v-if="props?.clipboardOptions?.type === 'image'">
        <ImageCard :clipboard-options="props.clipboardOptions" />
      </template>
      <template v-if="props?.clipboardOptions?.type === 'rtf'">
        <RtfCard :clipboard-options="props.clipboardOptions" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.clipboard-card-container {
  // 计算高度：(362px - 15px margin) / 3 cards ≈ 115px
  height: 100%;
  box-sizing: border-box;

  // 内容布局
  display: flex;
  flex-direction: column;

  // 确保内容不会溢出
  overflow: hidden;

  cursor: pointer;

  color: #3c3c43;

  font-size: 12px;

  border-radius: 5px;

  justify-content: center;
  align-items: center;
}

// 卡片样式
.clipboard-card {
  height: 95%;
  width: 95%;
  background-color: var(--title-bar-bg);
  backdrop-filter: blur(10px);
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  color: var(--text-color);
  transition:
    color 0.5s ease,
    background-color 0.5s ease;
  // padding: 10px;
}

// 图片类型卡片
.image-type-card {
  // padding: 2px 0px;
  // height: 100%;
}
</style>
