<script lang="ts" setup>
/**
 * 快捷键设置组件
 * 包含不可更改和可更改的快捷键设置
 */
import { ref, computed, onBeforeUnmount } from 'vue'
import VAlert from '@renderer/components/VAlert'
import { Message } from '@renderer/components/VMessage'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useI18nStore } from '@renderer/store/useI18nStore'
import { firstShowTransitionMotion } from '@renderer/util/common.fun'

// 快捷键类型
interface Shortcut {
  id: string
  name: string
  keys: string
  description: string
  editable: boolean
}

// 首次显示动画
const enableFirstShowTransition = firstShowTransitionMotion

// 检测当前操作系统
const isMac = computed(() => {
  return useConfigStore().getSetting.system.isMac
})

const shortcut = computed(() => {
  return useConfigStore().getSetting.shortcut
})

// 获取 i18n store
const i18nStore = useI18nStore()

// 不可更改的快捷键列表
const fixedShortcuts: Shortcut[] = [
  {
    id: 'moveUp',
    name: i18nStore.t('setting.keyboard.moveUp'),
    keys: 'W/↑',
    description: i18nStore.t('setting.keyboard.moveUpDesc'),
    editable: false
  },
  {
    id: 'moveDown',
    name: i18nStore.t('setting.keyboard.moveDown'),
    keys: 'S/↓',
    description: i18nStore.t('setting.keyboard.moveDownDesc'),
    editable: false
  },
  {
    id: 'nextPage',
    name: i18nStore.t('setting.keyboard.nextPage'),
    keys: 'D/→',
    description: i18nStore.t('setting.keyboard.nextPageDesc'),
    editable: false
  },
  {
    id: 'prevPage',
    name: i18nStore.t('setting.keyboard.prevPage'),
    keys: 'A/←',
    description: i18nStore.t('setting.keyboard.prevPageDesc'),
    editable: false
  },
  {
    id: 'pin',
    name: i18nStore.t('setting.keyboard.pin'),
    keys: 'E',
    description: i18nStore.t('setting.keyboard.pinDesc'),
    editable: false
  },
  {
    id: 'delete',
    name: i18nStore.t('setting.keyboard.delete'),
    keys: 'Q',
    description: i18nStore.t('setting.keyboard.deleteDesc'),
    editable: false
  }
]

// 可更改的快捷键
const editableShortcuts = ref<Shortcut[]>([
  {
    id: 'toggleApp',
    name: i18nStore.t('setting.keyboard.toggleApp'),
    keys: isMac.value
      ? shortcut.value.appVisibleShortcut.mac
      : shortcut.value.appVisibleShortcut.windows,
    description: i18nStore.t('setting.keyboard.toggleAppDesc'),
    editable: true
  }
])

// 当前正在编辑的快捷键ID
const editingShortcutId = ref('')

// 当前正在记录的按键
const recordingKeys = ref<string[]>([])

// 动画定时器
const animationTimers = ref<number[]>([])

/**
 * 组件卸载前清除所有定时器
 */
onBeforeUnmount(() => {
  animationTimers.value.forEach((timer) => clearTimeout(timer))
})

/**
 * 开始编辑快捷键
 * @param {string} id - 快捷键ID
 */
const startEditing = (id: string): void => {
  editingShortcutId.value = id
  recordingKeys.value = []

  // 将当前键值解析为数组
  const currentShortcut = editableShortcuts.value.find((s) => s.id === id)
  if (currentShortcut && currentShortcut.keys) {
    recordingKeys.value = currentShortcut.keys.split('+')
  }

  // 添加按键监听
  window.addEventListener('keydown', recordKeyPress)
}

/**
 * 记录按键
 * @param {KeyboardEvent} event - 键盘事件
 */
const recordKeyPress = (event: KeyboardEvent): void => {
  event.preventDefault()
  console.log(event.key)

  const key = getKeyName(event)
  if (!key) return

  // 如果按下Escape键，取消编辑
  if (key === 'Escape') {
    stopEditing()
    return
  }

  // 如果是功能键，添加到列表中
  if (isModifierKey(key)) {
    if (!recordingKeys.value.includes(key)) {
      recordingKeys.value.push(key)
    }
  } else {
    // 如果是普通键，添加到列表末尾
    if (!recordingKeys.value.includes(key)) {
      recordingKeys.value = [...recordingKeys.value.filter(isModifierKey), key]
    }
  }
}

/**
 * 停止编辑并保存快捷键
 */
const stopEditing = (): void => {
  window.removeEventListener('keydown', recordKeyPress)

  // 如果有有效的快捷键组合，则保存
  if (recordingKeys.value.length > 0 && editingShortcutId.value) {
    // 将数组转换为字符串格式
    editableShortcuts.value[0].keys = recordingKeys.value.join('+')
  }

  editingShortcutId.value = ''
}

/**
 * 应用-快捷键设置
 */
const applyShortcutSettings = (): void => {
  const keys = editableShortcuts.value[0].keys
  useConfigStore().setShortcut(keys)
  // 显示成功消息通知
  Message.success({
    title: i18nStore.t('common.save'),
    message: i18nStore.t('setting.keyboard.saveSuccess'),
    duration: 2000
  })
}

/**
 * 重置为默认快捷键
 */
const resetToDefault = (): void => {
  editableShortcuts.value[0].keys = isMac.value
    ? shortcut.value.appVisibleShortcut.macDefaultShortcuts
    : shortcut.value.appVisibleShortcut.windowsDefaultShortcuts
  useConfigStore().setShortcut(editableShortcuts.value[0].keys)
  // 显示信息消息通知
  Message.info({
    message: i18nStore.t('setting.keyboard.resetSuccess'),
    duration: 2000
  })
}

/**
 * 获取按键名称
 * @param {KeyboardEvent} event - 键盘事件
 * @returns {string} 按键名称
 */
const getKeyName = (event: KeyboardEvent): string => {
  // 特殊键映射
  if (event.key === ' ') return 'Space'
  if (event.key === 'Control') return 'Ctrl'
  // 确保在 Windows 上 Meta 键（Windows 键）显示为 Win，在 Mac 上显示为 Cmd
  if (event.key === 'Meta') return isMac.value ? 'Cmd' : 'Win'
  // 另外特别处理 Windows 键
  if (event.key === 'OS' || event.key === 'Win') return 'Win'
  if (event.key === 'ArrowUp') return '↑'
  if (event.key === 'ArrowDown') return '↓'
  if (event.key === 'ArrowLeft') return '←'
  if (event.key === 'ArrowRight') return '→'

  // 普通键返回大写形式
  if (event.key.length === 1) return event.key.toUpperCase()

  // 其他键直接返回
  return event.key
}

/**
 * 判断是否为修饰键
 * @param {string} key - 按键名称
 * @returns {boolean} 是否为修饰键
 */
const isModifierKey = (key: string): boolean => {
  return ['Ctrl', 'Alt', 'Shift', 'Cmd', 'Win'].includes(key)
}

/**
 * 清除单个快捷键
 */
const clearShortcut = (): void => {
  if (editingShortcutId.value) {
    recordingKeys.value = []
  }
}
</script>

<template>
  <div class="keyboard-settings">
    <div class="settings-header">
      <h2>{{ i18nStore.t('setting.keyboard.title') }}</h2>
      <p class="subtitle">{{ i18nStore.t('setting.keyboard.subtitle') }}</p>
    </div>

    <!-- 不可更改的快捷键 -->
    <div class="shortcuts-section">
      <h3>{{ i18nStore.t('setting.keyboard.defaultShortcuts') }}</h3>
      <p class="section-description">{{ i18nStore.t('setting.keyboard.defaultShortcutsDesc') }}</p>

      <div class="shortcuts-container">
        <div v-for="shortcut in fixedShortcuts" :key="shortcut.id" class="shortcut-item">
          <!-- 快捷键动画演示 -->
          <div class="shortcut-animation">
            <div :class="`animation-${shortcut.id}`">
              <template v-if="shortcut.id === 'moveUp'">
                <div class="animation-item move-up"></div>
              </template>
              <template v-else-if="shortcut.id === 'moveDown'">
                <div class="animation-item move-down"></div>
              </template>
              <template v-else-if="shortcut.id === 'nextPage'">
                <div class="animation-item move-right"></div>
              </template>
              <template v-else-if="shortcut.id === 'prevPage'">
                <div class="animation-item move-left"></div>
              </template>
              <template v-else-if="shortcut.id === 'pin'">
                <div class="animation-item pin-item">
                  <div class="pin-icon"></div>
                </div>
              </template>
              <template v-else-if="shortcut.id === 'delete'">
                <div class="animation-item delete-item">X</div>
              </template>
            </div>
          </div>

          <div class="shortcut-info">
            <div class="shortcut-name">{{ i18nStore.t(`setting.keyboard.${shortcut.id}`) }}</div>
            <div class="shortcut-description">
              {{ i18nStore.t(`setting.keyboard.${shortcut.id}Desc`) }}
            </div>
          </div>

          <div class="shortcut-keys-container">
            <div class="key-badge">{{ shortcut.keys }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 可更改的快捷键 -->
    <div v-motion="enableFirstShowTransition" class="shortcuts-section">
      <h3>{{ i18nStore.t('setting.keyboard.customShortcuts') }}</h3>
      <p class="section-description">{{ i18nStore.t('setting.keyboard.customShortcutsDesc') }}</p>

      <div class="shortcuts-container">
        <div
          v-for="shortcut in editableShortcuts"
          :key="shortcut.id"
          class="shortcut-item custom-shortcut-item"
        >
          <div class="shortcut-info">
            <div class="shortcut-name">{{ i18nStore.t(`setting.keyboard.${shortcut.id}`) }}</div>
            <div class="shortcut-description">
              {{ i18nStore.t(`setting.keyboard.${shortcut.id}Desc`) }}
            </div>
          </div>

          <div v-if="editingShortcutId === shortcut.id" class="shortcut-edit-controls">
            <div class="edit-instructions">
              {{ i18nStore.t('setting.keyboard.editInstructions') }}
            </div>
            <div class="key-recording-area">
              <template v-if="recordingKeys.length > 0">
                <div class="key-combination">
                  <div class="key-badge">
                    {{ recordingKeys.join('+') }}
                  </div>
                </div>
              </template>
              <div v-else class="recording-prompt">
                {{ i18nStore.t('setting.keyboard.waitingForInput') }}
              </div>
            </div>
            <div class="edit-actions">
              <button class="action-button cancel-button" @click="stopEditing">
                {{ i18nStore.t('common.cancel') }}
              </button>
              <button class="action-button clear-button" @click="clearShortcut">
                {{ i18nStore.t('setting.keyboard.clear') }}
              </button>
              <button class="action-button save-button" @click="stopEditing">
                {{ i18nStore.t('common.save') }}
              </button>
            </div>
          </div>

          <div v-else class="shortcut-keys editable" @click="startEditing(shortcut.id)">
            <div v-if="shortcut.keys" class="key-badge">
              {{ shortcut.keys }}
            </div>
            <div v-else class="no-shortcut">{{ i18nStore.t('setting.keyboard.notSet') }}</div>
            <div class="edit-hint">{{ i18nStore.t('setting.keyboard.clickToEdit') }}</div>
          </div>
        </div>

        <!-- 提示信息 Alert -->
        <div v-if="!isMac" class="shortcut-alerts">
          <VAlert
            :show-icon="true"
            type="warning"
            :title="i18nStore.t('setting.keyboard.noteTitle')"
            :message="i18nStore.t('setting.keyboard.noteMessage')"
            class="clipboard-alert"
          />
        </div>
      </div>
    </div>

    <!-- 底部按钮区域 -->
    <div class="action-buttons">
      <button class="reset-button" @click="resetToDefault">
        {{ i18nStore.t('setting.keyboard.resetToDefault') }}
      </button>
      <button class="apply-button" @click="applyShortcutSettings">
        {{ i18nStore.t('common.apply') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../base.scss';
$title-font-size: 20px;
$subtitle-font-size: 13px;
$section-title-font-size: 16px;
$text-font-size: 14px;
$animation-size: 36px;
$animation-color: var(--button-primary-bg);

.shortcuts-section {
  margin-bottom: 30px;

  h3 {
    font-size: $section-title-font-size;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .section-description {
    font-size: $subtitle-font-size;
    opacity: 0.8;
    margin-bottom: 15px;
  }
}

.shortcuts-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--container-bg);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.shortcut-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid rgba(128, 128, 128, 0.1);
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(128, 128, 128, 0.05);
  }
}

.custom-shortcut-item {
  flex-direction: column;
  align-items: flex-start;
}

// 快捷键动画区域
.shortcut-animation {
  width: $animation-size;
  height: $animation-size;
  margin-right: 15px;
  background-color: rgba(128, 128, 128, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;

  .animation-item {
    position: absolute;
    background-color: $animation-color;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .move-up {
    animation: moveUpAnimation 2s infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .move-down {
    animation: moveDownAnimation 2s infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .move-left {
    animation: moveLeftAnimation 2s infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .move-right {
    animation: moveRightAnimation 2s infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .pin-item {
    width: 14px;
    height: 14px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pinAnimation 2s infinite;
    display: flex;
    align-items: center;
    justify-content: center;

    .pin-icon {
      width: 6px;
      height: 6px;
      background-color: white;
      border-radius: 50%;
    }
  }

  .delete-item {
    width: 20px;
    height: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: deleteAnimation 2s infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: 14px;
  }
}

@keyframes moveUpAnimation {
  0%,
  100% {
    transform: translate(-50%, -50%);
  }

  50% {
    transform: translate(-50%, -120%);
  }
}

@keyframes moveDownAnimation {
  0%,
  100% {
    transform: translate(-50%, -50%);
  }

  50% {
    transform: translate(-50%, 50%);
  }
}

@keyframes moveLeftAnimation {
  0%,
  100% {
    transform: translate(-50%, -50%);
  }

  50% {
    transform: translate(-120%, -50%);
  }
}

@keyframes moveRightAnimation {
  0%,
  100% {
    transform: translate(-50%, -50%);
  }

  50% {
    transform: translate(50%, -50%);
  }
}

@keyframes pinAnimation {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.3);
  }
}

@keyframes deleteAnimation {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.3;
  }
}

.shortcut-info {
  flex: 1;
  margin-left: 5px;

  .shortcut-name {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .shortcut-description {
    font-size: 12px;
    opacity: 0.7;
  }
}

.shortcut-keys-container {
  display: flex;
  align-items: center;
}

.key-badge {
  padding: 4px 8px;
  background-color: rgba(128, 128, 128, 0.1);
  border: 1px solid rgba(128, 128, 128, 0.2);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-width: 28px;
  position: relative;
}

.shortcut-keys {
  display: flex;
  gap: 6px;

  &.editable {
    cursor: pointer;
    position: relative;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px dashed rgba(128, 128, 128, 0.3);
    width: 100%;
    box-sizing: border-box;
    min-height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;

    .edit-hint {
      position: absolute;
      top: -8px;
      right: 8px;
      font-size: 11px;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover {
      background-color: rgba(128, 128, 128, 0.1);

      .edit-hint {
        opacity: 1;
      }
    }
  }
}

.key-combination {
  display: flex;
  gap: 6px;
  align-items: center;
}

.shortcut-edit-controls {
  background-color: rgba(66, 133, 244, 0.05);
  border: 1px solid var(--button-primary-bg);
  border-radius: 8px;
  padding: 12px;
  margin-left: 15px;
  min-width: 240px;

  .edit-instructions {
    font-size: 12px;
    margin-bottom: 8px;
    color: var(--text-color);
    opacity: 0.8;
  }

  .key-recording-area {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(128, 128, 128, 0.2);
    border-radius: 6px;
    padding: 8px 12px;
    min-height: 38px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .recording-prompt {
    color: #4285f4;
    font-style: italic;
    font-size: 12px;
  }

  .edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;

    .action-button {
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;
      color: var(--text-color);
    }

    .cancel-button {
      background-color: transparent;
      border: 1px solid rgba(128, 128, 128, 0.3);

      &:hover {
        background-color: rgba(128, 128, 128, 0.1);
      }
    }

    .clear-button {
      background-color: transparent;
      border: 1px solid rgba(128, 128, 128, 0.3);

      &:hover {
        background-color: rgba(128, 128, 128, 0.1);
      }
    }

    .save-button {
      background-color: var(--button-primary-bg);
      color: white;

      &:hover {
        background-color: var(--button-primary-bg);
      }
    }
  }
}

.no-shortcut {
  font-style: italic;
  opacity: 0.6;
  font-size: 12px;
}

// Alert提示样式
.shortcut-alerts {
  margin-top: 15px;

  .clipboard-alert {
    margin-top: 10px;
  }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.reset-button {
  padding: 8px 15px;
  background-color: transparent;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(128, 128, 128, 0.1);
  }
}

.apply-button {
  background-color: var(--button-primary-bg);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--button-primary-bg);
  }

  &:active {
    background-color: var(--button-primary-bg);
  }
}

@media (max-width: 768px) {
  .shortcut-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .shortcut-animation {
    margin-bottom: 10px;
  }

  .shortcut-info {
    margin-bottom: 10px;
    margin-left: 0;
  }

  .shortcut-keys-container,
  .shortcut-keys.editable,
  .shortcut-edit-controls {
    align-self: stretch;
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
