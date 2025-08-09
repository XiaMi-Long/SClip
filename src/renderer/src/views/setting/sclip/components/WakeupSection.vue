<script lang="ts" setup>
import { computed } from 'vue'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { Message } from '@renderer/components/VMessage'
import VSwitch from '@renderer/components/VSwitch'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'

/**
 * 唤醒回到首页功能组件
 * 负责管理应用唤醒时的页面跳转行为
 */

// 获取 i18n store
const i18nStore = useI18nStore()

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
    title: i18nStore.t('common.save'),
    message: i18nStore.t('setting.sclip.wakeup.saveSuccess'),
    duration: 2000
  })
}
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="wakeup-section">
    <div class="section-title">
      <h3>{{ i18nStore.t('setting.sclip.wakeup.title') }}</h3>
      <p class="subtitle">{{ i18nStore.t('setting.sclip.wakeup.subtitle') }}</p>
    </div>

    <!-- 唤醒回到首页功能区 -->
    <div class="wakeup">
      <div class="wakeup__preview">
        <div class="wakeup__preview__container">
          <div class="wakeup__preview__container__cards">
            <!-- 使用v-motion指令代替CSS动画 -->
            <div v-motion="cardScrollMotion" class="wakeup__preview__container__cards__list">
              <div class="wakeup__preview__container__cards__list__item">
                {{ i18nStore.t('setting.sclip.wakeup.example1') }}
              </div>
              <div class="wakeup__preview__container__cards__list__item">
                {{ i18nStore.t('setting.sclip.wakeup.example2') }}
              </div>
              <div class="wakeup__preview__container__cards__list__item">
                {{ i18nStore.t('setting.sclip.wakeup.example3') }}
              </div>
              <div class="wakeup__preview__container__cards__list__item">
                {{ i18nStore.t('setting.sclip.wakeup.example4') }}
              </div>
              <div class="wakeup__preview__container__cards__list__item">
                {{ i18nStore.t('setting.sclip.wakeup.example5') }}
              </div>
              <div class="wakeup__preview__container__cards__list__item">
                {{ i18nStore.t('setting.sclip.wakeup.example6') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="toggle-option">
        <div class="option-info">
          <div class="option-title">
            {{ i18nStore.t('setting.sclip.wakeup.jumpToFirstPage') }}
          </div>
          <div class="option-description">
            {{ i18nStore.t('setting.sclip.wakeup.jumpToFirstPageDesc') }}
          </div>
        </div>
        <VSwitch v-model="jumpToFirstPageValue" @change="toggleJumpToFirstPage" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../common.scss';

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

// 整体部分样式
.wakeup-section {
  margin-bottom: 30px;
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
}
</style>
