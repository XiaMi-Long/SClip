<!-- 日志页面组件 -->
<script setup lang="ts">
/**
 * @module LogViewer
 * @description 日志查看页面，用于展示系统日志记录
 */
import { ref, reactive, onMounted } from 'vue'
import { invokeMain } from '@renderer/util/ipc.renderer.service'
import { formatDateTime } from '@renderer/util/common.fun'
import { useI18nStore } from '@renderer/store/useI18nStore'

// 获取 i18n store
const i18nStore = useI18nStore()

interface LogData {
  id?: number
  level: 'info' | 'warn' | 'error' | 'debug'
  module: string
  message: string
  data?: string
  created_at: number
}

interface PaginationState {
  currentPage: number
  pageSize: number
}

// 日志数据
const logs = ref<LogData[]>([])
const loading = ref(false)

// 分页配置
const pagination = reactive<PaginationState>({
  currentPage: 1,
  pageSize: 50 // 增加每页显示数量
})

/**
 * 获取日志数据
 * @description 从数据库获取日志数据，只获取warning和error级别
 */
const fetchLogs = async () => {
  loading.value = true
  try {
    // 构建查询参数，只获取warning和error级别的日志
    const queryParams = {
      level: 'warn,error', // 只获取warn和error级别的日志
      limit: pagination.pageSize,
      offset: (pagination.currentPage - 1) * pagination.pageSize
    }

    // 调用IPC服务获取日志
    const result = await invokeMain.getLogs(queryParams)
    logs.value = result.data
  } catch (error) {
    console.error('获取日志失败', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取日志数据
onMounted(() => {
  fetchLogs()
})
</script>

<template>
  <div class="log-viewer">
    <div class="log-viewer-header">
      <h2>{{ i18nStore.t('setting.log.title') }}</h2>
      <div class="log-viewer-subtitle">{{ i18nStore.t('setting.log.subtitle') }}</div>
    </div>

    <div class="log-container">
      <!-- 加载状态 -->
      <div v-if="loading && logs.length === 0" class="log-loading">
        <div class="loading-indicator"></div>
        <span>{{ i18nStore.t('setting.log.loading') }}</span>
      </div>

      <!-- 空状态 -->
      <div v-else-if="logs.length === 0" class="log-empty">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="48"
          height="48"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 6h-4a2 2 0 0 1-2-2V0" />
          <path d="M15 2H3a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
        <p>{{ i18nStore.t('setting.log.noLogs') }}</p>
        <span>{{ i18nStore.t('setting.log.systemNormal') }}</span>
      </div>

      <!-- 日志列表 -->
      <div v-else class="log-list">
        <div v-for="log in logs" :key="log.id" class="log-item" :class="log.level">
          <div class="log-item-header">
            <span class="log-level">{{
              log.level === 'warn'
                ? i18nStore.t('setting.log.warning')
                : i18nStore.t('setting.log.error')
            }}</span>
            <span class="log-module">{{ log.module }}</span>
            <span class="log-time">{{ formatDateTime(log.created_at) }}</span>
          </div>
          <div class="log-message">{{ log.message }}</div>
          <div v-if="log.data" class="log-data">
            <pre>{{ log.data }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../base.scss';

.log-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  transition: color 0.5s ease;
  padding: 0;
  gap: 10px;

  .log-container {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 20px;
    scrollbar-width: none;
  }

  // 加载状态
  .log-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: var(--text-color);
    transition: color 0.5s ease;

    .loading-indicator {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top-color: var(--button-primary-bg);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 12px;
    }
  }

  // 空状态
  .log-empty {
    text-align: center;
    padding: 40px 0;
    color: var(--text-color);
    transition: color 0.5s ease;

    svg {
      opacity: 0.4;
      margin-bottom: 16px;
    }

    p {
      font-size: 16px;
      margin: 0 0 8px 0;
    }

    span {
      font-size: 14px;
      opacity: 0.7;
    }
  }

  // 日志列表
  .log-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  // 日志项
  .log-item {
    background-color: var(--title-bar-bg);
    transition:
      background-color 0.5s ease,
      box-shadow 0.2s;
    border-radius: 8px;
    padding: 14px 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;

    &:hover {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    // 左侧彩色边框
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #faad14;
    }

    &.error::before {
      background-color: #ff4d4f;
    }
  }

  .log-item-header {
    display: flex;
    margin-bottom: 8px;
    font-size: 13px;
    align-items: center;
  }

  .log-level {
    font-weight: 500;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 8px;

    .log-item.warn & {
      background-color: rgba(250, 173, 20, 0.1);
      color: #faad14;
    }

    .log-item.error & {
      background-color: rgba(255, 77, 79, 0.1);
      color: #ff4d4f;
    }
  }

  .log-module {
    font-weight: 500;
    color: var(--text-color);
    transition: color 0.5s ease;
    margin-right: auto;
  }

  .log-time {
    color: var(--text-color);
    transition: color 0.5s ease;
    font-size: 12px;
  }

  .log-message {
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
  }

  .log-data {
    margin-top: 8px;
    background-color: var(--container-bg);
    transition: background-color 0.5s ease;
    border-radius: 4px;
    padding: 8px;
    overflow-x: auto;
    scrollbar-width: none;

    pre {
      margin: 0;
      font-family: 'SF Mono', SFMono-Regular, Consolas, monospace;
      font-size: 12px;
      white-space: pre-wrap;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
