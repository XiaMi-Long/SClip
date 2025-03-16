<script lang="ts" setup>
/**
 * 通用警告提示组件
 * 支持success、info、warning、error四种类型
 */
import { computed } from 'vue'

interface Props {
  /**
   * 提示类型
   */
  type: 'success' | 'info' | 'warning' | 'error'
  /**
   * 提示标题（可选）
   */
  title?: string
  /**
   * 提示内容
   */
  message: string
  /**
   * 是否可关闭
   */
  closable?: boolean
  /**
   * 是否显示图标
   */
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
  closable: false,
  showIcon: true
})

const emit = defineEmits(['close'])

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
  return `v-alert--${props.type}`
})

/**
 * 关闭通知
 */
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="v-alert" :class="typeClass">
    <div v-if="showIcon" class="v-alert-icon">
      <span class="icon">{{ typeIcon }}</span>
    </div>
    <div class="v-alert-content">
      <div v-if="title" class="v-alert-title">{{ title }}</div>
      <div class="v-alert-message">{{ message }}</div>
    </div>
    <div v-if="closable" class="v-alert-close" @click="handleClose">
      <span class="close-icon">×</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-alert {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  // 成功类型
  &.v-alert--success {
    background-color: rgba(52, 168, 83, 0.1);
    border: 1px solid rgba(52, 168, 83, 0.3);

    .v-alert-icon {
      color: #34a853;
    }

    .v-alert-title {
      color: #34a853;
    }
  }

  // 信息类型
  &.v-alert--info {
    background-color: rgba(66, 133, 244, 0.1);
    border: 1px solid rgba(66, 133, 244, 0.3);

    .v-alert-icon {
      color: #4285f4;
    }

    .v-alert-title {
      color: #4285f4;
    }
  }

  // 警告类型
  &.v-alert--warning {
    background-color: rgba(251, 188, 5, 0.1);
    border: 1px solid rgba(251, 188, 5, 0.3);

    .v-alert-icon {
      color: #fbbc05;
    }

    .v-alert-title {
      color: #fbbc05;
    }
  }

  // 错误类型
  &.v-alert--error {
    background-color: rgba(234, 67, 53, 0.1);
    border: 1px solid rgba(234, 67, 53, 0.3);

    .v-alert-icon {
      color: #ea4335;
    }

    .v-alert-title {
      color: #ea4335;
    }
  }
}

.v-alert-icon {
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

.v-alert-content {
  flex: 1;
  min-width: 0;
}

.v-alert-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 15px;
}

.v-alert-message {
  color: var(--text-color);
  opacity: 0.85;
}

.v-alert-close {
  margin-left: 12px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  .close-icon {
    font-size: 18px;
    font-weight: bold;
  }
}

// 在暗色模式下调整文本颜色
@media (prefers-color-scheme: dark) {
  .v-alert-message {
    opacity: 0.9;
  }
}
</style>
