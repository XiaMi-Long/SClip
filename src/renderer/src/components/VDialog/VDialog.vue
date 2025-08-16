<script lang="ts" setup>
/**
 * 通用对话框组件
 * 支持确认和取消操作，带有动画效果
 */
import { computed, nextTick, onMounted, ref } from 'vue'

interface Props {
  /**
   * 对话框标题
   */
  title?: string
  /**
   * 对话框内容
   */
  message: string
  /**
   * 确认按钮文本
   */
  confirmText?: string
  /**
   * 取消按钮文本
   */
  cancelText?: string
  /**
   * 对话框类型
   */
  type?: 'info' | 'warning' | 'error' | 'success'
  /**
   * 是否显示取消按钮
   */
  showCancel?: boolean
  /**
   * 确认按钮是否危险操作（红色）
   */
  confirmDanger?: boolean
  /**
   * 是否显示遮罩层
   */
  showMask?: boolean
  /**
   * 点击遮罩层是否关闭
   */
  maskClosable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  confirmText: '确定',
  cancelText: '取消',
  type: 'info',
  showCancel: true,
  confirmDanger: false,
  showMask: true,
  maskClosable: false
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const visible = ref(false)
const dialogRef = ref<HTMLElement>()

/**
 * 根据类型返回对应的图标符号
 */
const typeIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return '✓'
    case 'warning':
      return '⚠️'
    case 'error':
      return '✕'
    case 'info':
    default:
      return 'ℹ'
  }
})

/**
 * 根据类型返回对应的CSS类
 */
const typeClass = computed(() => {
  return `v-dialog--${props.type}`
})

/**
 * 确认操作
 */
const handleConfirm = () => {
  emit('confirm')
  close()
}

/**
 * 取消操作
 */
const handleCancel = () => {
  emit('cancel')
  close()
}

/**
 * 关闭对话框
 */
const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300) // 等待动画完成
}

/**
 * 点击遮罩层
 */
const handleMaskClick = () => {
  if (props.maskClosable) {
    close()
  }
}

/**
 * 阻止事件冒泡
 */
const handleDialogClick = (e: Event) => {
  e.stopPropagation()
}

/**
 * 显示对话框
 */
const show = () => {
  visible.value = true
}

// 暴露方法给父组件
defineExpose({
  show,
  close
})

onMounted(() => {
  // 自动显示
  nextTick(() => {
    show()
  })
})
</script>

<template>
  <Teleport to="body">
    <Transition name="v-dialog-fade">
      <div v-if="visible" class="v-dialog-wrapper" @click="handleMaskClick">
        <Transition name="v-dialog-zoom">
          <div
            v-if="visible"
            ref="dialogRef"
            class="v-dialog"
            :class="typeClass"
            @click="handleDialogClick"
          >
            <!-- 图标区域 -->
            <div class="v-dialog-icon">
              <span class="icon">{{ typeIcon }}</span>
            </div>

            <!-- 内容区域 -->
            <div class="v-dialog-content">
              <div v-if="title" class="v-dialog-title">{{ title }}</div>
              <div class="v-dialog-message">{{ message }}</div>
            </div>

            <!-- 按钮区域 -->
            <div class="v-dialog-actions">
              <button
                v-if="showCancel"
                class="v-dialog-btn v-dialog-btn--cancel"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                class="v-dialog-btn v-dialog-btn--confirm"
                :class="{ 'v-dialog-btn--danger': confirmDanger }"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.v-dialog-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.v-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 400px;
  max-width: 500px;
  padding: 24px;
  border-radius: 12px;
  background-color: var(--bg-color, #ffffff);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));

  // 信息类型
  &.v-dialog--info {
    .v-dialog-icon {
      color: #4285f4;
    }

    .v-dialog-title {
      color: #4285f4;
    }
  }

  // 成功类型
  &.v-dialog--success {
    .v-dialog-icon {
      color: #34a853;
    }

    .v-dialog-title {
      color: #34a853;
    }
  }

  // 警告类型
  &.v-dialog--warning {
    .v-dialog-icon {
      color: #fbbc05;
    }

    .v-dialog-title {
      color: #fbbc05;
    }
  }

  // 错误类型
  &.v-dialog--error {
    .v-dialog-icon {
      color: #ea4335;
    }

    .v-dialog-title {
      color: #ea4335;
    }
  }
}

.v-dialog-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  .icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    border-radius: 50%;
    background-color: rgba(66, 133, 244, 0.1);
  }
}

.v-dialog-content {
  text-align: center;
  margin-bottom: 24px;
}

.v-dialog-title {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--text-color, #333);
}

.v-dialog-message {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color, #666);
  opacity: 0.85;
}

.v-dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.v-dialog-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  // 取消按钮
  &.v-dialog-btn--cancel {
    background-color: var(--container-bg, #f5f5f5);
    color: var(--text-color, #666);
  }

  // 确认按钮
  &.v-dialog-btn--confirm {
    background-color: var(--button-primary-bg);
    color: white;
  }
}

// 动画效果
.v-dialog-fade-enter-active,
.v-dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.v-dialog-fade-enter-from,
.v-dialog-fade-leave-to {
  opacity: 0;
}

.v-dialog-zoom-enter-active,
.v-dialog-zoom-leave-active {
  transition: all 0.3s ease;
}

.v-dialog-zoom-enter-from,
.v-dialog-zoom-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

// 暗色模式适配
@media (prefers-color-scheme: dark) {
  .v-dialog {
    background-color: var(--bg-color-dark, #2d2d2d);
    border-color: var(--border-color-dark, rgba(255, 255, 255, 0.1));
  }

  .v-dialog-title {
    color: var(--text-color-dark, #ffffff);
  }

  .v-dialog-message {
    color: var(--text-color-dark, #cccccc);
  }

  .v-dialog-btn--cancel {
    background-color: var(--bg-color-secondary-dark, #404040);
    color: var(--text-color-dark, #cccccc);
    border-color: var(--border-color-dark, rgba(255, 255, 255, 0.2));

    &:hover {
      background-color: var(--bg-color-hover-dark, #505050);
    }
  }
}
</style>
