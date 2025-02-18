import { useConfigStore } from '@renderer/store/useConfigStore'

/**
 * @file system.theme.ts
 * @description 系统主题配置工具文件，提供主题变量接口以及写入全局 :root CSS 变量的函数，用于实现主题颜色的动态切换
 */

/**
 * @typedef {Object} SystemTheme
 * @property {string} [clipboardListBg] - 剪贴板列表背景颜色
 * @property {string} [clipboardCardBg] - 剪贴板卡片背景颜色
 * @property {string} [stickyBadgeBg] - 固定徽章背景颜色
 * @property {string} [stickyBadgeErrorBg] - 固定徽章错误背景颜色
 * @property {string} [systemTheme] - 系统主题 light/dark
 */
export interface SystemTheme {
  clipboardListBg?: string
  clipboardCardBg?: string
  stickyBadgeBg?: string
  stickyBadgeErrorBg?: string
  systemTheme?: string
}

/**
 * @description 定义可选的预设主题 key
 */
export type PresetThemeKey = 'default'

/**
 * @description 预设的主题配置集合，可供选择的主题（5-6种）
 */
export const presetThemes: Record<PresetThemeKey, SystemTheme> = {
  default: {
    stickyBadgeBg: '#86cfab'
  }
}

/**
 * @description 默认的系统主题设置，与 theme.css 中一致喵～
 */
export const defaultTheme: SystemTheme = {
  clipboardListBg: '#f3f3f3',
  clipboardCardBg: '#ffffff',
  stickyBadgeBg: presetThemes.default.stickyBadgeBg,
  stickyBadgeErrorBg: '#f67373',
  systemTheme: 'light'
}

/**
 * @description 将传入的主题配置写入到全局 :root CSS 变量中，实现主题颜色的动态切换
 * @param {SystemTheme} theme - 主题配置对象，用于更新全局变量
 */
export function setSystemTheme(theme: SystemTheme): void {
  const root = document.documentElement
  if (theme.clipboardListBg) {
    root.style.setProperty('--clipboard-list-bg', theme.clipboardListBg)
  }
  if (theme.clipboardCardBg) {
    root.style.setProperty('--clipboard-card-bg', theme.clipboardCardBg)
  }
  if (theme.stickyBadgeBg) {
    root.style.setProperty('--stickybadge-bg', theme.stickyBadgeBg)
  }
  if (theme.stickyBadgeErrorBg) {
    root.style.setProperty('--stickybadge-error-bg', theme.stickyBadgeErrorBg)
  }
  if (theme.systemTheme) {
    root.style.setProperty('--system-theme', theme.systemTheme === 'light' ? '#e3e3e3' : 'black')
  }
}

/**
 * @description 初始化系统主题，默认使用 defaultTheme；此函数应在应用初始化时调用喵～
 */
export function initSystemTheme(): void {
  console.log('initSystemTheme', defaultTheme)
  setSystemTheme(defaultTheme)
}

/**
 * @description 动态更新单个主题变量的辅助函数
 * @param {keyof SystemTheme} key - 主题变量名称
 * @param {string} value - 主题变量对应的新值
 */
export function updateThemeVariable(key: keyof SystemTheme, value: string): void {
  const root = document.documentElement
  switch (key) {
    case 'clipboardListBg':
      root.style.setProperty('--clipboard-list-bg', value)
      break
    case 'clipboardCardBg':
      root.style.setProperty('--clipboard-card-bg', value)
      break
    case 'stickyBadgeBg':
      root.style.setProperty('--stickybadge-bg', value)
      break
    case 'stickyBadgeErrorBg':
      root.style.setProperty('--stickybadge-error-bg', value)
      break
    default:
      console.warn('未知的主题变量:', key)
      break
  }
}

/**
 * @description 通过预设主题的 key 切换主题
 * @param {PresetThemeKey} themeKey - 预设主题的 key（比如 'yellow', 'red' 等）
 */
export function setPresetTheme(themeKey: PresetThemeKey): void {
  const preset = presetThemes[themeKey]
  if (preset) {
    setSystemTheme(preset)
  } else {
    console.warn('未找到对应的预设主题:', themeKey)
  }
}

/**
 * @description 获取当前系统主题的配置，通过读取 :root 的 CSS 变量
 * @returns {SystemTheme} 当前主题配置对象
 */
export function getCurrentTheme(): SystemTheme {
  const rootStyles = getComputedStyle(document.documentElement)
  return {
    clipboardListBg: rootStyles.getPropertyValue('--clipboard-list-bg').trim(),
    clipboardCardBg: rootStyles.getPropertyValue('--clipboard-card-bg').trim(),
    stickyBadgeBg: rootStyles.getPropertyValue('--stickybadge-bg').trim(),
    stickyBadgeErrorBg: rootStyles.getPropertyValue('--stickybadge-error-bg').trim()
  }
}
