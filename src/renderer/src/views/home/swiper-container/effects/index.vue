<script setup lang="ts">
import { ref } from 'vue'
import { useStyles } from './hook'
import NoData from '../components/no-data/index.vue'
import TextCard from '../components/card-container-component/Text.vue'
import ImageCard from '../components/card-container-component/Image.vue'
import RtfCard from '../components/card-container-component/Rtf.vue'
import CardBadge from './CardBadge.vue'

const { getters, getCardStyle } = useStyles()

const cardStyle = ref({
  text: 'clipboard-card',
  image: 'clipboard-card image-type-card',
  html: 'clipboard-card html-type-card'
})

const cardType = (type: string) => {
  return cardStyle.value[type]
}
</script>

<template>
  <div class="card-swiper-container">
    <NoData v-if="getters.getAllCards.value.length === 0"></NoData>

    <div v-if="getters.getAllCards.value.length" class="card-swiper-wrapper">
      <div
        v-for="(item, index) in getters.getAllCards.value"
        :key="item.id"
        class="card-item"
        :style="getCardStyle(index)"
        :data-index="index"
      >
        <div v-if="item" :class="cardType(item.type)">
          <template v-if="item?.type === 'text'">
            <TextCard :clipboard-options="item" />
          </template>
          <template v-if="item?.type === 'image'">
            <ImageCard :clipboard-options="item" />
          </template>
          <template v-if="item?.type === 'rtf'">
            <RtfCard :clipboard-options="item" />
          </template>
        </div>
      </div>
    </div>

    <div class="barge-container">
      <CardBadge
        :card="getters.getActiveCard.value"
        :show-type-indicator="true"
        :show-long-content-tip="true"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-swiper-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // 设置 3D 透视效果
  perspective: 1000px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-swiper-wrapper {
  position: relative;
  width: 180px;
  height: 250px;
  // 保持 3D 变换
  transform-style: preserve-3d;

  // overflow: hidden;
}

.card-item {
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  zoom: 0.8;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  white-space: normal; /* 允许自动换行 */
  word-wrap: break-word; /* 长单词换行 */
  word-break: break-word; /* 在单词内换行 */
  text-align: center; /* 文字居中对齐 */
  padding: 5px; /* 添加内边距，避免文字贴边 */
  box-sizing: border-box; /* 确保padding不会影响总宽高 */
  border-radius: 10px;
  // 平滑过渡效果
  transition: all 0.5s ease;
  cursor: pointer;
  backface-visibility: hidden;
}

// 卡片样式
.clipboard-card {
  width: 100%;
  height: 100%;
  // padding: 10px;
}

.barge-container {
  width: 100px;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  // background-color: rgba(0, 0, 0, 0.5);
  background-color: var(--title-bar-bg);
  border-radius: 10px;
  z-index: 10;
}
</style>
