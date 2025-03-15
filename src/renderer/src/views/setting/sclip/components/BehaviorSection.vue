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

    <!-- 唤醒回到首页功能区 -->
    <div class="wakeup">
      <div class="wakeup__preview">
        <div class="wakeup__preview__container">
          <div class="wakeup__preview__container__cards">
            <!-- 使用v-motion指令代替CSS动画 -->
            <div v-motion="cardScrollMotion" class="wakeup__preview__container__cards__list">
              <div class="wakeup__preview__container__cards__list__item">春风拂面</div>
              <div class="wakeup__preview__container__cards__list__item">月光如水</div>
              <div class="wakeup__preview__container__cards__list__item">花开有声</div>
              <div class="wakeup__preview__container__cards__list__item">云淡风轻</div>
              <div class="wakeup__preview__container__cards__list__item">静听雨落</div>
              <div class="wakeup__preview__container__cards__list__item">星河璀璨</div>
            </div>
          </div>
        </div>
      </div>

      <div class="wakeup__toggle">
        <div class="wakeup__toggle__info">
          <div class="wakeup__toggle__title">唤醒回到首页</div>
          <div class="wakeup__toggle__description">每次唤醒应用时自动回到第一页</div>
        </div>
        <VSwitch v-model="jumpToFirstPageValue" @change="toggleJumpToFirstPage" />
      </div>
    </div>

    <!-- 历史记录限制功能区 -->
    <div class="history-limit">
      <div class="history-limit__preview">
        <div class="history-limit__preview__container">
          <div class="history-limit__preview__container__list">
            <div
              v-for="i in 100"
              :key="i"
              class="history-limit__preview__container__list__item"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 定义变量
$card-width: 250px;
$card-height: 380px;
$border-radius: 10px;
$transition-default: 0.5s ease;

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin card-container-base {
  background-color: var(--title-bar-bg);
  transition: background-color $transition-default;
  border-radius: $border-radius;
}

@mixin toggle-base {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: rgba(var(--rgb-text-color, 0, 0, 0), 0.03);
  transition: background-color $transition-default;
  border-radius: $border-radius;
  margin-bottom: 15px;
}

@mixin toggle-text {
  color: var(--text-color);
  opacity: 0.7;
  transition: color $transition-default;
}

// 整体部分样式
.behavior-section {
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

// 唤醒回到首页功能区样式
.wakeup {
  margin-bottom: 20px;

  &__preview {
    margin-bottom: 20px;

    &__container {
      width: 100%;
      height: 400px;
      @include card-container-base;
      @include flex-center;

      &__cards {
        width: $card-width;
        height: $card-height;
        @include card-container-base;
        padding: 3px;
        box-sizing: border-box;
        overflow: hidden;

        &__list {
          width: calc($card-width * 2);
          height: 100%;
          display: flex;
          gap: 5px;
          flex-direction: column;
          flex-wrap: wrap;
          will-change: transform, opacity;

          &__item {
            width: calc($card-width - 6px);
            height: calc($card-height / 3 - 7px);
            @include flex-center;
            background-color: var(--container-bg);
            flex-direction: column;
            border-radius: $border-radius;
          }
        }
      }
    }
  }

  &__toggle {
    @include toggle-base;

    &__info {
      flex: 1;
    }

    &__title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    &__description {
      font-size: 14px;
      @include toggle-text;
    }
  }
}

// 历史记录限制功能区样式
.history-limit {
  margin-bottom: 20px;

  &__preview {
    margin-bottom: 20px;

    &__container {
      width: 100%;
      height: 250px;
      padding: 20px;
      @include card-container-base;

      &__list {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;

        &__item {
          border: 1px solid var(--container-bg);
          border-radius: 5px;
          width: 50px;
          height: 25px;
        }
      }
    }
  }
}
</style>
