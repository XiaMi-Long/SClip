<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { Message } from '@renderer/components/VMessage'

/**
 * 历史记录限制组件
 * 负责管理应用历史记录的限制设置
 */

const props = defineProps<{
  historyLimit: number
}>()

const emit = defineEmits<{
  (e: 'update:historyLimit', value: number): void
}>()

// 应用启动时加载的历史记录条数
const historyLimitValue = computed({
  get: () => props.historyLimit,
  set: (value) => emit('update:historyLimit', value)
})

// 预设的历史记录数量选项
const presetOptions = [20, 30, 50, 70, 100]

// 自定义输入值
const customValue = ref('')

// 动画显示的数字
const animatedNumber = ref(historyLimitValue.value)
const animatedMemory = ref(calculateMemoryUsage(historyLimitValue.value))

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion

/**
 * 计算内存占用大小
 * @param {number} limit - 历史记录条数
 * @returns {number} 内存占用大小(MB)
 */
function calculateMemoryUsage(limit: number): number {
  // 根据提供的数据，100条约为10MB，50条约为5MB，可以推断出线性关系,5.1MB是基本最低维持的内存占用
  return Math.max(limit * 0.1, 5.1)
}

/**
 * 执行数字动画
 * @param {number} startValue - 起始值
 * @param {number} endValue - 结束值
 * @param {(value: number) => void} updateFn - 更新函数
 * @param {number} duration - 动画持续时间(ms)
 */
function animateNumber(
  startValue: number,
  endValue: number,
  updateFn: (value: number) => void,
  duration: number = 500
): void {
  const startTime = Date.now()
  const difference = endValue - startValue

  function update() {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime

    if (elapsed >= duration) {
      updateFn(endValue)
      return
    }

    // 使用easeOutQuad缓动函数使动画更自然
    const progress = 1 - Math.pow(1 - elapsed / duration, 2)
    const currentValue = startValue + difference * progress

    updateFn(currentValue)
    requestAnimationFrame(update)
  }

  update()
}

// 监听historyLimitValue的变化，执行动画
watch(historyLimitValue, (newValue, oldValue) => {
  // 执行记录数量的动画
  animateNumber(oldValue, newValue, (value) => {
    animatedNumber.value = Math.round(value)
  })

  // 执行内存占用的动画
  const oldMemory = calculateMemoryUsage(oldValue)
  const newMemory = calculateMemoryUsage(newValue)
  animateNumber(oldMemory, newMemory, (value) => {
    animatedMemory.value = value
  })
})

/**
 * 选择预设的历史记录数量
 * @param {number} value - 预设值
 */
const selectPreset = (value: number): void => {
  historyLimitValue.value = value
  customValue.value = ''
  saveHistoryLimit(value)
}

/**
 * 应用自定义输入的历史记录数量
 */
const applyCustomValue = (): void => {
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

  if (value < 10) {
    Message.warning({
      title: '输入错误',
      message: '请输入大于10的正整数',
      duration: 2000
    })
    return
  }
  historyLimitValue.value = value
  saveHistoryLimit(value)
}

/**
 * 保存历史记录限制设置
 * @param {number} value - 历史记录数量
 */
const saveHistoryLimit = (value: number): void => {
  // 保存设置
  useConfigStore().setHistoryLimit(value)
  // 显示成功消息通知
  Message.success({
    title: '设置已保存',
    message: '历史记录限制设置已成功应用，下次启动时生效',
    duration: 2000
  })
}

/**
 * 处理自定义输入框的按键事件
 * @param {KeyboardEvent} event - 键盘事件
 */
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    applyCustomValue()
  }
}

/**
 * 格式化数字为一位小数
 * @param {number} value - 要格式化的数字
 * @returns {string} 格式化后的字符串
 */
function formatToOneDecimal(value: number): string {
  return value.toFixed(1)
}
</script>

<template>
  <div v-motion="enableFirstShowTransition" class="history-limit-section">
    <div class="section-title">
      <h3>历史记录限制</h3>
      <p class="subtitle">设置应用启动时加载的历史记录数量</p>
    </div>

    <!-- 历史记录限制功能区 -->
    <div class="history-limit">
      <div class="history-limit__preview">
        <div class="history-limit__preview__container">
          <div class="history-limit__preview__content">
            <div class="history-limit__preview__number">{{ animatedNumber }}</div>
            <div class="history-limit__preview__text">
              当前历史记录设置占用内存约 {{ formatToOneDecimal(animatedMemory) }}MB
            </div>
          </div>
        </div>
      </div>

      <div class="history-limit__toggle">
        <div class="history-limit__toggle__info">
          <div class="history-limit__toggle__title">历史记录数量</div>
          <div class="history-limit__toggle__description">设置应用启动时加载的历史记录条数</div>

          <div class="history-limit__toggle__presets">
            <div
              v-for="option in presetOptions"
              :key="option"
              class="preset-button"
              :class="{ active: historyLimitValue === option }"
              @click="selectPreset(option)"
            >
              {{ option }}
            </div>

            <div class="custom-input-container">
              <input
                v-model="customValue"
                type="number"
                min="1"
                placeholder="自定义"
                class="custom-input"
                @keydown="handleKeyDown"
              />
              <button class="apply-button" @click="applyCustomValue">应用</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 定义变量
$border-radius: 10px;
$transition-default: 0.5s ease;
$accent-color: var(--button-primary-bg);

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
.history-limit-section {
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

// 历史记录限制功能区样式
.history-limit {
  margin-bottom: 20px;

  &__preview {
    margin-bottom: 20px;

    &__container {
      width: 100%;
      height: 250px;
      padding: 20px;
      box-sizing: border-box;
      @include card-container-base;
      @include flex-center;
    }

    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 15px;
    }

    &__number {
      font-size: 48px;
      font-weight: 700;
      color: var(--text-color);
    }

    &__text {
      font-size: 16px;
      color: var(--text-color);
      opacity: 0.7;
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
      margin-bottom: 15px;
    }

    &__presets {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;

      .preset-button {
        padding: 6px 12px;
        border-radius: 6px;
        background-color: var(--title-bar-bg);
        color: var(--text-color);
        font-size: 14px;
        cursor: pointer;
        transition: all $transition-default;

        &:hover {
          background-color: var(--title-bar-bg);
        }

        &.active {
          background-color: $accent-color;
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
          transition: all $transition-default;

          &:focus {
            outline: none;
            border-color: $accent-color;
            box-shadow: 0 0 0 2px rgba($accent-color, 0.2);
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
          background-color: $accent-color;
          color: white;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all $transition-default;

          &:hover {
            background-color: var(--button-primary-hover-bg);
            opacity: 0.9;
          }
        }
      }
    }
  }
}
</style>
