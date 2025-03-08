<script lang="ts" setup>
import { computed } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'
/**
 * 应用操作逻辑设置组件
 * 负责管理应用行为设置
 */

const props = defineProps<{
  jumpToFirstPage: boolean
}>()

const emit = defineEmits<{
  (e: 'update:jumpToFirstPage', value: boolean): void
}>()

// 是否每次打开应用时回到第一页
const jumpToFirstPageValue = computed({
  get: () => props.jumpToFirstPage,
  set: (value) => emit('update:jumpToFirstPage', value)
})

// 卡片滚动动画 - 使用v-Motion实现，根据需求调整
const cardScrollMotion = {
  initial: {
    x: 0,
    opacity: 1
  },
  visible: {
    // 调整位移和透明度的关键帧序列
    x: [0, -250, -250, -250, -250, 0, 0],
    opacity: [1, 1, 0, 0, 1, 1, 1],
    transition: {
      // 整体时长调整为8秒
      duration: 8000,
      repeat: Infinity,
      repeatType: 'loop',
      // 调整时间点：
      // 0%: 初始状态
      // 15%: 完成位移(-250)
      // 25%: 开始淡出(opacity: 0)
      // 50%: 保持透明状态2秒
      // 55%: 快速显示出来
      // 65%: 快速位移回原位(只用10%的时间)
      // 100%: 保持初始状态直至结束(35%的时间，约3秒)
      times: [0, 0.15, 0.25, 0.5, 0.55, 0.65, 1],
      // 为不同阶段设置不同的缓动函数
      // 注意：缓动函数数组长度必须是值数组长度减1
      ease: ['easeOut', 'linear', 'linear', 'easeOut', 'easeOut', 'linear']
    }
  }
}

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion

/**
 * 切换是否回到第一页的设置
 * @param {boolean} value - 开关状态
 */
const toggleJumpToFirstPage = (value: boolean): void => {
  jumpToFirstPageValue.value = value
  // 保存设置
  useConfigStore().setJumpToFirstPage(value)
  // 显示成功消息通知
  Message.success({
    title: '设置已保存',
    message: '唤醒回到首页设置已成功应用，已经生效',
    duration: 2000
  })
}
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="behavior-section">
    <div class="section-title">
      <h3>应用行为</h3>
      <p class="subtitle">自定义应用的操作逻辑</p>
    </div>

    <div class="wakeup-preview">
      <div class="preview-container">
        <div class="preview-card-container">
          <!-- 使用v-motion指令代替CSS动画 -->
          <div v-motion="cardScrollMotion" class="card-container">
            <div class="card-item">春风拂面</div>
            <div class="card-item">月光如水</div>
            <div class="card-item">花开有声</div>
            <div class="card-item">云淡风轻</div>
            <div class="card-item">静听雨落</div>
            <div class="card-item">星河璀璨</div>
          </div>
        </div>
      </div>
    </div>

    <div class="toggle-option">
      <div class="option-info">
        <div class="option-title">唤醒回到首页</div>
        <div class="option-description">每次唤醒应用时自动回到第一页</div>
      </div>
      <VSwitch v-model="jumpToFirstPageValue" @change="toggleJumpToFirstPage" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.behavior-section {
  margin-bottom: 30px;
}

.section-title {
  margin-bottom: 20px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .subtitle {
    font-size: 14px;
    color: var(--text-color);
    opacity: 0.7;
    transition: color 0.5s ease;
  }
}

$card-width: 250px;
$card-height: 380px;

.wakeup-preview {
  margin-bottom: 20px;

  .preview-container {
    width: 100%;
    height: 400px;
    background-color: var(--title-bar-bg);
    transition: background-color 0.5s ease;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .preview-card-container {
      width: $card-width;
      height: $card-height;
      background-color: var(--title-bar-bg);
      transition: background-color 0.5s ease;
      border-radius: 10px;
      padding: 3px;
      box-sizing: border-box;
      overflow: hidden;

      .card-container {
        width: calc($card-width * 2);
        height: 100%;
        display: flex;
        gap: 5px;
        flex-direction: column;
        flex-wrap: wrap;
        will-change: transform, opacity;

        .card-item {
          width: calc($card-width - 6px);
          height: calc($card-height / 3 - 7px);
          display: flex;
          background-color: var(--container-bg);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }
      }
    }
  }
}

.toggle-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: rgba(var(--rgb-text-color, 0, 0, 0), 0.03);
  transition: background-color 0.5s ease;
  border-radius: 10px;
  margin-bottom: 15px;

  .option-info {
    flex: 1;

    .option-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .option-description {
      font-size: 14px;
      color: var(--text-color);
      opacity: 0.7;
      transition: color 0.5s ease;
    }
  }
}
</style>
