<script lang="ts" setup>
/**
 * 通用消息通知组件
 * 支持success、info、warning、error四种类型
 * 显示在页面中央，带有过渡动画
 */
import { computed, ref, onMounted } from 'vue'

interface Props {
  /**
   * 消息类型
   */
  type: 'success' | 'info' | 'warning' | 'error'
  /**
   * 消息标题（可选）
   */
  title?: string
  /**
   * 消息内容
   */
  message: string
  /**
   * 显示时长(毫秒)，默认3000ms
   */
  duration?: number
  /**
   * 是否显示图标
   */
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
  duration: 3000,
  showIcon: true
})

const emit = defineEmits(['close'])

const visible = ref(false)

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
  return `v-message--${props.type}`
})

/**
 * 关闭消息通知
 */
const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300) // 等待动画结束
}

/**
 * 组件挂载后显示消息，并设置自动关闭定时器
 */
onMounted(() => {
  // 下一帧显示，以便触发过渡动画
  setTimeout(() => {
    visible.value = true
  }, 20)

  // 设置自动关闭
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})

// 暴露方法给父组件
defineExpose({
  close
})
</script>

<template>
  <Transition name="message-fade">
    <div v-if="visible" class="v-message-wrapper">
      <div class="v-message" :class="typeClass">
        <div v-if="showIcon" class="v-message-icon">
          <span class="icon">{{ typeIcon }}</span>
        </div>
        <div class="v-message-content">
          <div v-if="title" class="v-message-title">{{ title }}</div>
          <div class="v-message-text">{{ message }}</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.v-message-wrapper {
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none; // 允许点击穿透
}

.v-message {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  min-width: 240px;
  pointer-events: auto; // 恢复点击事件
  backdrop-filter: blur(8px);

  // 成功类型
  &.v-message--success {
    background-color: rgba(52, 168, 83, 0.7);
    border: 1px solid rgba(52, 168, 83, 0.3);
    color: #fff;

    .v-message-icon {
      color: #fff;
    }

    .v-message-title {
      color: #fff;
    }
  }

  // 信息类型
  &.v-message--info {
    background-color: rgba(66, 133, 244, 0.7);
    border: 1px solid rgba(66, 133, 244, 0.3);
    color: #fff;

    .v-message-icon {
      color: #fff;
    }

    .v-message-title {
      color: #fff;
    }
  }

  // 警告类型
  &.v-message--warning {
    background-color: rgba(251, 188, 5, 0.7);
    border: 1px solid rgba(251, 188, 5, 0.3);
    color: #fff;

    .v-message-icon {
      color: #fff;
    }

    .v-message-title {
      color: #fff;
    }
  }

  // 错误类型
  &.v-message--error {
    background-color: rgba(234, 67, 53, 0.7);
    border: 1px solid rgba(234, 67, 53, 0.3);
    color: #fff;

    .v-message-icon {
      color: #fff;
    }

    .v-message-title {
      color: #fff;
    }
  }
}

.v-message-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;

  .icon {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
  }
}

.v-message-content {
  flex: 1;
  min-width: 0;
}

.v-message-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 15px;
}

.v-message-text {
  opacity: 0.95;
}

// 过渡动画
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-50% - 30px));
}
</style>
