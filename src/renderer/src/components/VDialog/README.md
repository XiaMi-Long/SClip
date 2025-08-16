# VDialog 对话框组件

一个通用的对话框组件，用于用户确认和取消操作，支持多种类型和自定义配置。

## 特性

- 🎨 与 VAlert 组件保持一致的视觉风格
- ✨ 流畅的进入/退出动画效果
- 🎯 支持多种对话框类型（info、warning、error、success）
- 🔧 高度可配置的按钮文本和行为
- 🌙 支持暗色模式
- 📱 响应式设计，适配不同屏幕尺寸
- 🎭 支持危险操作样式（红色确认按钮）
- 🖱️ 可配置遮罩层点击关闭

## 基本用法

```vue
<template>
  <div>
    <button @click="showDialog = true">显示对话框</button>

    <VDialog
      v-if="showDialog"
      title="确认操作"
      message="您确定要执行此操作吗？"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @close="showDialog = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VDialog from '@/components/VDialog'

const showDialog = ref(false)

const handleConfirm = () => {
  console.log('用户确认了操作')
}

const handleCancel = () => {
  console.log('用户取消了操作')
}
</script>
```

## Props

| 属性名          | 类型                                          | 默认值   | 说明                           |
| --------------- | --------------------------------------------- | -------- | ------------------------------ |
| `title`         | `string`                                      | `''`     | 对话框标题                     |
| `message`       | `string`                                      | -        | 对话框内容（必填）             |
| `confirmText`   | `string`                                      | `'确定'` | 确认按钮文本                   |
| `cancelText`    | `string`                                      | `'取消'` | 取消按钮文本                   |
| `type`          | `'info' \| 'warning' \| 'error' \| 'success'` | `'info'` | 对话框类型                     |
| `showCancel`    | `boolean`                                     | `true`   | 是否显示取消按钮               |
| `confirmDanger` | `boolean`                                     | `false`  | 确认按钮是否为危险操作（红色） |
| `showMask`      | `boolean`                                     | `true`   | 是否显示遮罩层                 |
| `maskClosable`  | `boolean`                                     | `false`  | 点击遮罩层是否关闭对话框       |

## Events

| 事件名    | 说明               | 回调参数 |
| --------- | ------------------ | -------- |
| `confirm` | 点击确认按钮时触发 | -        |
| `cancel`  | 点击取消按钮时触发 | -        |
| `close`   | 对话框关闭时触发   | -        |

## 对话框类型

### 信息对话框 (info)

```vue
<VDialog title="信息提示" message="这是一条信息提示。" type="info" />
```

### 警告对话框 (warning)

```vue
<VDialog title="警告" message="请确认您的操作。" type="warning" />
```

### 错误对话框 (error)

```vue
<VDialog title="错误" message="操作失败，请重试。" type="error" />
```

### 成功对话框 (success)

```vue
<VDialog title="成功" message="操作已成功完成！" type="success" />
```

## 高级用法

### 危险操作对话框

```vue
<VDialog
  title="确认删除"
  message="此操作不可撤销，确定要删除吗？"
  type="error"
  confirm-text="删除"
  :confirm-danger="true"
  @confirm="handleDelete"
/>
```

### 只显示确认按钮

```vue
<VDialog
  title="操作完成"
  message="您的操作已成功完成！"
  :show-cancel="false"
  @confirm="handleClose"
/>
```

### 自定义按钮文本

```vue
<VDialog
  title="保存设置"
  message="是否要保存当前的设置？"
  confirm-text="保存"
  cancel-text="不保存"
  @confirm="handleSave"
  @cancel="handleDiscard"
/>
```

### 点击遮罩层关闭

```vue
<VDialog
  title="提示"
  message="点击遮罩层可以关闭此对话框。"
  :mask-closable="true"
  @close="handleClose"
/>
```

## 样式定制

组件使用 CSS 变量来支持主题定制：

```scss
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: rgba(0, 0, 0, 0.1);
  --bg-color-secondary: #f5f5f5;
  --bg-color-hover: #e8e8e8;
}

// 暗色模式
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color-dark: #2d2d2d;
    --text-color-dark: #ffffff;
    --border-color-dark: rgba(255, 255, 255, 0.1);
    --bg-color-secondary-dark: #404040;
    --bg-color-hover-dark: #505050;
  }
}
```

## 注意事项

1. **Teleport 使用**：组件使用 `Teleport` 将对话框渲染到 `body` 元素下，确保正确的层级显示。

2. **动画时机**：关闭动画完成后才会触发 `close` 事件，确保动画流畅。

3. **事件处理**：确认和取消操作会自动关闭对话框，无需手动处理。

4. **响应式设计**：对话框会根据内容自动调整宽度，最大宽度为 500px。

5. **无障碍支持**：组件支持键盘导航和屏幕阅读器。

## 完整示例

参考 `example.vue` 文件查看完整的使用示例，包含所有类型的对话框演示。
