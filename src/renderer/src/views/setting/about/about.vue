<script lang="ts" setup>
/**
 * 关于页面组件
 * 包含软件版本信息、检查更新按钮和贡献者展示
 */
import { ref, computed } from 'vue'
import Avatar1 from '@renderer/assets/image/avatar1.jpeg'
import Avatar2 from '@renderer/assets/image/avatar2.jpeg'
import { useConfigStore } from '@renderer/store/useConfigStore'
import { useI18nStore } from '@renderer/store/useI18nStore'

// 获取 i18n store
const i18nStore = useI18nStore()

/**
 * 获取当前版本号
 * @returns {string} 当前软件版本号
 */
const getCurrentVersion = () => {
  // 这里使用一个固定的版本号字符串
  return useConfigStore().getSetting.system.version
}

/**
 * 获取更新日志并进行处理
 * @returns {Array<{version: string, items: string[]}>} 处理后的更新日志
 */
const getUpdateLogs = computed(() => {
  // 获取原始更新日志，确保是数组
  const configStore = useConfigStore()
  const updateLog = configStore?.getSetting?.system?.updateLog || []

  // 检查updateLog是否为数组
  if (!Array.isArray(updateLog)) {
    console.warn('系统更新日志不是数组格式', updateLog)
    return []
  }

  // 复制数组避免修改原始数据
  const logItems = [...updateLog]

  // 将数组反转，使最新的版本显示在最前面
  const reversedLogs = logItems.reverse()

  // 解析每个日志项
  return reversedLogs.map((log) => {
    if (typeof log !== 'string') {
      console.warn('日志项不是字符串格式', log)
      return { version: i18nStore.t('setting.about.unknownVersion'), items: [] }
    }

    // 按照#符号分割日志内容
    const parts = log.split('#').filter((item) => item.trim() !== '')

    // 第一项通常是版本信息
    const version = parts[0].replace(',', '') || i18nStore.t('setting.about.unknownVersion')

    // 其余的项是功能点
    const items = parts.slice(1).map((item) => item.trim())

    return {
      version,
      items
    }
  })
})

/**
 * 贡献者类型定义
 */
interface Contributor {
  name: string
  avatar: string
  url?: string
}

/**
 * 贡献者列表
 */
const contributors = ref<Contributor[]>([
  {
    name: 'Aclles',
    avatar: Avatar2,
    url: 'https://github.com/Aclles'
  },
  {
    name: 'XiaMi-Long',
    avatar: Avatar1,
    url: 'https://github.com/XiaMi-Long'
  }
])

/**
 * 检查更新状态
 */
const isCheckingUpdate = ref(false)

/**
 * 检查更新函数
 */
const checkUpdate = () => {
  isCheckingUpdate.value = true

  // 模拟检查更新过程
  setTimeout(() => {
    isCheckingUpdate.value = false
    // 这里实际应该调用相关API检查更新
  }, 1500)
}
</script>

<template>
  <div class="about-container">
    <div class="section">
      <h2 class="section-title">{{ i18nStore.t('setting.about.title') }}</h2>
      <div class="version-info">
        <div class="version-label">{{ i18nStore.t('setting.about.version') }}</div>
        <div class="version-number">{{ getCurrentVersion() }}</div>
        <button :disabled="isCheckingUpdate" class="update-btn" @click="checkUpdate">
          <span v-if="!isCheckingUpdate">{{ i18nStore.t('setting.about.checkUpdate') }}</span>
          <span v-else class="loading">{{ i18nStore.t('setting.about.checking') }}</span>
        </button>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">{{ i18nStore.t('setting.about.contributors') }}</h2>
      <div class="contributors-container">
        <div v-for="contributor in contributors" :key="contributor.name" class="contributor">
          <div class="avatar-container">
            <img :src="contributor.avatar" :alt="contributor.name" class="avatar" />
          </div>
          <div class="contributor-name">{{ contributor.name }}</div>
        </div>
      </div>
    </div>

    <!-- 更新日志区域 -->
    <div class="section">
      <h2 class="section-title">{{ i18nStore.t('setting.about.updateLogs') }}</h2>
      <div class="update-logs-container">
        <div v-for="(log, index) in getUpdateLogs" :key="index" class="update-log">
          <div class="version-header">{{ log.version }}</div>
          <ul class="update-items">
            <li v-for="(item, itemIndex) in log.items" :key="itemIndex" class="update-item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;

  .section {
    background-color: var(--title-bar-bg);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: var(--text-color);
  }

  .version-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .version-label {
      font-size: 14px;
      color: var(--text-color);
    }

    .version-number {
      font-size: 16px;
      font-weight: 500;
      color: var(--text-color);
      background-color: var(--container-bg);
      padding: 6px 12px;
      border-radius: 6px;
    }
  }

  .update-btn {
    background-color: var(--button-primary-bg);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color 0.3s,
      opacity 0.3s;
    margin-left: auto;

    &:hover {
      opacity: 0.8;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading {
      display: inline-block;
      position: relative;

      &:after {
        content: '...';
        animation: dots 1.5s infinite;
      }
    }
  }

  .contributors-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .contributor {
    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar-container {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 8px;
      border: 2px solid var(--button-primary-bg);
    }

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .contributor-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-color);
    }
  }

  // 更新日志样式
  .update-logs-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .update-log {
    padding-bottom: 20px;

    &:not(:last-child) {
      border-bottom: 1px solid var(--container-bg);
    }

    .version-header {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--text-color);
      background-color: var(--container-bg);
      padding: 8px 12px;
      border-radius: 6px;
      display: inline-block;
    }

    .update-items {
      padding-left: 20px;
      margin: 0;
    }

    .update-item {
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 1.5;
      color: var(--text-color);
      position: relative;
    }
  }
}
</style>
