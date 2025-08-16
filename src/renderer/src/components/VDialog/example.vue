<template>
  <div class="dialog-example">
    <h2>VDialog 组件使用示例</h2>

    <div class="button-group">
      <button @click="showInfoDialog">信息对话框</button>
      <button @click="showWarningDialog">警告对话框</button>
      <button @click="showErrorDialog">错误对话框</button>
      <button @click="showSuccessDialog">成功对话框</button>
      <button @click="showDangerDialog">危险操作对话框</button>
      <button @click="showCustomDialog">自定义对话框</button>
    </div>

    <!-- 信息对话框 -->
    <VDialog
      v-if="dialogs.info"
      ref="infoDialogRef"
      title="信息提示"
      message="这是一个信息对话框，用于显示一般信息。"
      type="info"
      @confirm="handleInfoConfirm"
      @cancel="handleInfoCancel"
      @close="dialogs.info = false"
    />

    <!-- 警告对话框 -->
    <VDialog
      v-if="dialogs.warning"
      ref="warningDialogRef"
      title="警告"
      message="这是一个警告对话框，请确认您的操作。"
      type="warning"
      @confirm="handleWarningConfirm"
      @cancel="handleWarningCancel"
      @close="dialogs.warning = false"
    />

    <!-- 错误对话框 -->
    <VDialog
      v-if="dialogs.error"
      ref="errorDialogRef"
      title="错误"
      message="操作失败，请检查后重试。"
      type="error"
      @confirm="handleErrorConfirm"
      @cancel="handleErrorCancel"
      @close="dialogs.error = false"
    />

    <!-- 成功对话框 -->
    <VDialog
      v-if="dialogs.success"
      ref="successDialogRef"
      title="成功"
      message="操作已成功完成！"
      type="success"
      :show-cancel="false"
      @confirm="handleSuccessConfirm"
      @close="dialogs.success = false"
    />

    <!-- 危险操作对话框 -->
    <VDialog
      v-if="dialogs.danger"
      ref="dangerDialogRef"
      title="确认删除"
      message="此操作不可撤销，确定要删除吗？"
      type="error"
      confirm-text="删除"
      :confirm-danger="true"
      @confirm="handleDangerConfirm"
      @cancel="handleDangerCancel"
      @close="dialogs.danger = false"
    />

    <!-- 自定义对话框 -->
    <VDialog
      v-if="dialogs.custom"
      ref="customDialogRef"
      title="自定义设置"
      message="是否要应用当前的自定义设置？"
      type="info"
      confirm-text="应用"
      cancel-text="取消"
      :mask-closable="true"
      @confirm="handleCustomConfirm"
      @cancel="handleCustomCancel"
      @close="dialogs.custom = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import VDialog from './VDialog.vue'

// 对话框显示状态
const dialogs = ref({
  info: false,
  warning: false,
  error: false,
  success: false,
  danger: false,
  custom: false
})

// 对话框引用
const infoDialogRef = ref()
const warningDialogRef = ref()
const errorDialogRef = ref()
const successDialogRef = ref()
const dangerDialogRef = ref()
const customDialogRef = ref()

// 显示各种对话框的方法
const showInfoDialog = () => {
  dialogs.value.info = true
}

const showWarningDialog = () => {
  dialogs.value.warning = true
}

const showErrorDialog = () => {
  dialogs.value.error = true
}

const showSuccessDialog = () => {
  dialogs.value.success = true
}

const showDangerDialog = () => {
  dialogs.value.danger = true
}

const showCustomDialog = () => {
  dialogs.value.custom = true
}

// 处理确认事件
const handleInfoConfirm = () => {
  console.log('信息对话框确认')
}

const handleWarningConfirm = () => {
  console.log('警告对话框确认')
}

const handleErrorConfirm = () => {
  console.log('错误对话框确认')
}

const handleSuccessConfirm = () => {
  console.log('成功对话框确认')
}

const handleDangerConfirm = () => {
  console.log('危险操作确认')
}

const handleCustomConfirm = () => {
  console.log('自定义设置应用')
}

// 处理取消事件
const handleInfoCancel = () => {
  console.log('信息对话框取消')
}

const handleWarningCancel = () => {
  console.log('警告对话框取消')
}

const handleErrorCancel = () => {
  console.log('错误对话框取消')
}

const handleDangerCancel = () => {
  console.log('危险操作取消')
}

const handleCustomCancel = () => {
  console.log('自定义设置取消')
}
</script>

<style lang="scss" scoped>
.dialog-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: var(--text-color, #333);
  }

  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      background-color: #4285f4;
      color: white;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background-color: #3367d6;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// 暗色模式适配
@media (prefers-color-scheme: dark) {
  .dialog-example h2 {
    color: var(--text-color-dark, #ffffff);
  }
}
</style>
