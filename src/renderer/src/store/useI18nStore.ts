import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useConfigStore } from './useConfigStore'
import zhCN from '../i18n/zh-CN.json'
import enUS from '../i18n/en-US.json'

// 定义翻译资源类型
interface TranslationRecord {
  [key: string]: string | TranslationRecord
}

export const useI18nStore = defineStore('i18n', () => {
  // 语言资源
  const resources = {
    'zh-CN': zhCN,
    'en-US': enUS
  }

  // 当前语言
  const currentLanguage = computed(() => {
    return useConfigStore().getSetting.appLanguage || 'zh-CN'
  })

  // 获取当前语言的翻译资源
  const translations = computed(() => {
    return resources[currentLanguage.value]
  })

  /**
   * 翻译函数
   * @param {string} key - 翻译键值，支持点号表示法，如 'setting.language.title'
   * @returns {string} 翻译后的文本
   */
  const t = (key: string): string => {
    const keys = key.split('.')
    let result: TranslationRecord | string = translations.value

    for (const k of keys) {
      if (typeof result === 'object' && result !== null && k in result) {
        result = result[k]
      } else {
        // 如果找不到翻译，返回键值本身
        return key
      }
    }

    return typeof result === 'string' ? result : key
  }

  return {
    currentLanguage,
    translations,
    t
  }
})
