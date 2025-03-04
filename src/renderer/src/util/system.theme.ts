/**
 * @file system.theme.ts
 * @description 系统主题配置工具文件，专注于提供主题和强调色更新功能
 */

/**
 * @typedef {Object} SystemTheme
 * @property {string} [clipboardListBg] - 剪贴板列表背景颜色
 * @property {string} [clipboardCardBg] - 剪贴板卡片背景颜色
 * @property {string} [accentColor] - 应用强调色
 * @property {string} [stickyBadgeBg] - 固定徽章背景颜色
 * @property {string} [stickyBadgeErrorBg] - 固定徽章错误背景颜色
 * @property {string} [systemTheme] - 系统主题 light/dark
 */
interface SystemTheme {
  titleBarBg: string
  containerBg: string
  textColor: string
  settingMenuActiveBg: string
}

/**
 * @description 定义可选的预设主题 key
 */
type ThemeMode = 'light' | 'dark' | 'system'

/**
 * @description 默认的系统主题设置
 */
const lightTheme: SystemTheme = {
  titleBarBg: '#ecedef',
  containerBg: '#fdfcfb',
  textColor: '#333',
  settingMenuActiveBg: '#d9d9d9'
}

/**
 * @description 暗色模式系统主题设置
 */
const darkTheme: SystemTheme = {
  titleBarBg: '#2a2c2d',
  containerBg: '#323232',
  textColor: '#fff',
  settingMenuActiveBg: '#676767'
}

/**
 * @description 将传入的主题配置写入到全局 :root CSS 变量中，实现主题颜色的动态切换
 * @param {SystemTheme} theme - 主题配置对象，用于更新全局变量
 */
export function setSystemTheme(theme: SystemTheme): void {
  const root = document.documentElement
  root.style.setProperty('--title-bar-bg', theme.titleBarBg)
  root.style.setProperty('--container-bg', theme.containerBg)
  root.style.setProperty('--text-color', theme.textColor)
  root.style.setProperty('--setting-menu-active-bg', theme.settingMenuActiveBg)
}

/**
 * @description 初始化系统主题，默认使用 light 模式
 */
export function initSystemTheme(): void {
  setSystemTheme(lightTheme)
}

/**
 * @description 切换系统主题模式（明亮/暗黑）
 * @param {ThemeMode} mode - 'light' 或 'dark'
 */
export function switchThemeMode(mode: ThemeMode): void {
  const theme = mode === 'dark' ? darkTheme : lightTheme
  setSystemTheme(theme)
}

/**
 * @description 更新应用强调色
 * @param {string} color - 新的强调色（十六进制颜色代码）
 */
export function updateAccentColor(color: string): void {
  const root = document.documentElement
  root.style.setProperty('--accent-color', color)
  root.style.setProperty('--stickybadge-bg', color)
}

/**
 * @description 同时更新应用主题模式和强调色
 * @param {ThemeMode} mode - 主题模式 'light' 或 'dark'
 * @param {string} accentColor - 强调色（十六进制颜色代码）
 */
export function updateTheme(mode: ThemeMode, accentColor?: string): void {
  switchThemeMode(mode)
  if (accentColor) {
    updateAccentColor(accentColor)
  }
}
