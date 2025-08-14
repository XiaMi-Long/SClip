<script lang="ts" setup>
/**
 * 语言设置组件
 * 包含语言选择和预览区域
 */
import { ref, computed } from 'vue'
import { useI18nStore } from '../../../store/useI18nStore'
import { useConfigStore } from '../../../store/useConfigStore'

// 获取 i18n store
const i18nStore = useI18nStore()
const configStore = useConfigStore()

// 语言类型
interface Language {
  id: string
  name: string
  code: string
  flagEmoji: string
}

// 语言选项
const languages: Language[] = [
  {
    id: 'cn',
    name: '简体中文',
    code: 'zh-CN',
    flagEmoji: '🇨🇳'
  },
  {
    id: 'en',
    name: 'English',
    code: 'en-US',
    flagEmoji: '🇬🇧'
  }
]

// 当前选中的语言
const selectedLanguage = ref(configStore.setting.appLanguage === 'zh-CN' ? 'cn' : 'en')

// 根据选择的语言获取当前显示的名言
const currentQuote = computed(() => {
  return i18nStore.t('quote.content')
})

// 获取当前显示的作者
const currentAuthor = computed(() => {
  return i18nStore.t('quote.author')
})

/**
 * 选择语言
 * @param {string} langId - 语言ID
 */
const selectLanguage = (langId: string): void => {
  selectedLanguage.value = langId
}

/**
 * 应用语言设置
 */
const applyLanguageSetting = (): void => {
  const langCode = selectedLanguage.value === 'cn' ? 'zh-CN' : 'en-US'
  configStore.setAppLanguage(langCode)
}
</script>

<template>
  <div class="language-settings">
    <div class="settings-header">
      <h2>{{ i18nStore.t('setting.language.title') }}</h2>
      <p class="subtitle">{{ i18nStore.t('setting.language.subtitle') }}</p>
    </div>

    <!-- 名言预览区域 -->
    <div class="quote-preview">
      <div class="quote-content">
        <p>"{{ currentQuote }}"</p>
        <div class="quote-author">— {{ currentAuthor }}</div>
      </div>
    </div>

    <!-- 语言选择区域 -->
    <div class="language-section">
      <h3>{{ i18nStore.t('setting.language.selectLanguage') }}</h3>
      <div class="language-options">
        <!-- 语言卡片 -->
        <div
          v-for="language in languages"
          :key="language.id"
          class="language-card"
          :class="{ active: selectedLanguage === language.id }"
          @click="selectLanguage(language.id)"
        >
          <div class="language-flag">{{ language.flagEmoji }}</div>
          <div class="language-info">
            <div class="language-name">{{ language.name }}</div>
            <div class="language-code">{{ language.code }}</div>
          </div>
          <div v-if="selectedLanguage === language.id" class="check-icon">✓</div>
        </div>
      </div>
    </div>

    <!-- 底部应用按钮 -->
    <div class="apply-section">
      <button class="apply-button" @click="applyLanguageSetting">
        {{ i18nStore.t('setting.language.applyButton') }}
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

// 名言预览区域样式
.quote-preview {
  background-color: var(--container-bg);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(128, 128, 128, 0.1);
  transition:
    background-color 0.3s,
    border-color 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .quote-content {
    text-align: center;

    p {
      font-size: 18px;
      line-height: 1.6;
      margin: 0 0 10px 0;
      font-style: italic;
      font-weight: 300;
    }

    .quote-author {
      font-size: 14px;
      opacity: 0.8;
    }
  }
}

// 语言选择区域样式
.language-section {
  margin-bottom: 30px;

  h3 {
    font-size: $section-title-font-size;
    font-weight: 500;
    margin-bottom: 15px;
  }
}

.language-options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.language-card {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: var(--container-bg);
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid rgba(128, 128, 128, 0.1);
  transition:
    background-color 0.3s,
    border-color 0.3s,
    transform 0.2s;
  width: calc(50% - 15px);
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  &.active {
    border-color: rgba(128, 128, 128, 0.3);
    background-color: var(--setting-menu-active-bg);
  }

  .language-flag {
    font-size: 24px;
    margin-right: 15px;
  }

  .language-info {
    flex: 1;

    .language-name {
      font-weight: 500;
      margin-bottom: 2px;
    }

    .language-code {
      font-size: 12px;
      opacity: 0.7;
    }
  }

  .check-icon {
    color: var(--text-color);
    font-weight: bold;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }
}

// 应用按钮区域样式
.apply-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}

.apply-button {
  background-color: var(--button-primary-bg);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

// 响应式调整
@media (max-width: 768px) {
  .language-card {
    width: 100%;
  }
}
</style>
