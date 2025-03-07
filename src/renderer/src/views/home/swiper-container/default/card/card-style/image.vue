<script setup lang="ts">
import { onMounted, useTemplateRef, ref, computed } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'

const props = defineProps<{
  clipboardOptions: ClipboardState
}>()

const clipboardCardImage = useTemplateRef('clipboardCardImage')
const objectFit = ref<'contain' | 'cover'>('cover')

// 设置宽高比阈值
const RATIO_THRESHOLD = {
  MIN: 0.5,
  MAX: 2
}

// 生成 -10 到 10 之间的随机数
const getRandomPosition = () => Math.random() * 20 - 18

// 定义浮动动画
const imgMotion = ref({
  initial: {
    scale: 1.1,
    x: 0,
    y: 0
  },
  visible: {
    // 使用 visible 实现持续动画
    scale: 1.1,
    x: 0, // 初始值
    y: 0, // 初始值
    transition: {
      duration: 6000,
      repeat: Infinity,
      repeatType: 'reverse', // 反向重复
      ease: 'easeInOut'
    }
  }
})

/**
 * 处理图片加载完成事件
 */
const handleImageLoad = () => {
  const img = clipboardCardImage.value
  if (img) {
    // 获取图片原始尺寸
    const { naturalWidth, naturalHeight } = img
    // 计算宽高比
    const ratio = naturalWidth / naturalHeight

    // 根据宽高比判断显示方式
    if (ratio < RATIO_THRESHOLD.MIN) {
      // 过长的竖图
      objectFit.value = 'contain'
    } else if (ratio > RATIO_THRESHOLD.MAX) {
      // 过宽的横图
      objectFit.value = 'contain'
    } else {
      // 正常比例的图片
      objectFit.value = ratio < 1 ? 'contain' : 'cover'
    }

    console.log(
      `图片尺寸: ${naturalWidth}x${naturalHeight}, 宽高比: ${ratio.toFixed(2)}, 显示方式: ${objectFit.value}`
    )
  }
}

const enableAnimation = computed(() => {
  return useConfigStore().getSetting.imageSettings.enableAnimation ? imgMotion.value : {}
})
const imageDisplayMode = computed(() => {
  return useConfigStore().getSetting.imageSettings.displayMode
})

onMounted(() => {
  const img = clipboardCardImage.value
  if (img) {
    if (img.complete) {
      handleImageLoad()
    }
    // 如果图片显示模式为自动，则监听图片加载完成事件
    img.addEventListener(
      'load',
      imageDisplayMode.value === 'auto'
        ? handleImageLoad
        : () => {
            console.log('图片加载完成')
          }
    )

    // 动态更新 x 和 y 的值
    imgMotion.value.visible.x = getRandomPosition()
    imgMotion.value.visible.y = getRandomPosition()
  }

  // 如果图片显示模式为自动，则监听图片加载完成事件
  if (imageDisplayMode.value !== 'auto') {
    objectFit.value = imageDisplayMode.value
  }
})
</script>

<template>
  <div class="clipboard-card-image-container">
    <!-- {{ props.clipboardOptions.content }} -->
    <img
      ref="clipboardCardImage"
      v-motion="enableAnimation"
      :src="props.clipboardOptions.content"
      alt=""
      class="clipboard-card-image"
      :style="{ objectFit }"
    />
  </div>
</template>

<style scoped lang="scss">
.clipboard-card-image-container {
  width: 100%;
  height: 100%;
  overflow: hidden; // 防止放大后溢出
}

.clipboard-card-image {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  will-change: transform; // 优化动画性能
}
</style>
