/**
 * @file system.theme.ts
 * @description 系统主题配置工具文件，专注于提供主题和强调色更新功能
 */
import { ref } from 'vue'
/**
 * @typedef {Object} SystemTheme
 * @property {string} [titleBarBg] - 标题栏背景颜色
 * @property {string} [containerBg] - 容器背景颜色
 * @property {string} [textColor] - 文本颜色
 * @property {string} [settingMenuActiveBg] - 设置菜单激活背景颜色
 * @property {string} [stickyBadgeBg] - 固定徽章背景颜色
 * @property {string} [stickyBadgeErrorBg] - 固定徽章错误背景颜色
 * @property {string} [buttonPrimaryBg] - 按钮主色调背景颜色
 */
interface SystemTheme {
  titleBarBg: string
  containerBg: string
  textColor: string
  settingMenuActiveBg: string
  stickyBadgeBg: string
  stickyBadgeErrorBg: string
  buttonPrimaryBg: string

  cardStyleCardBg: string
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
  settingMenuActiveBg: '#d9d9d9',
  stickyBadgeBg: '#d7d7d7',
  stickyBadgeErrorBg: '#f26a76',
  buttonPrimaryBg: '#4285f4',

  cardStyleCardBg: ''
}

/**
 * @description 暗色模式系统主题设置
 */
const darkTheme: SystemTheme = {
  titleBarBg: '#2a2c2d',
  containerBg: '#323232',
  textColor: '#fff',
  settingMenuActiveBg: '#676767',
  stickyBadgeBg: '#464646',
  stickyBadgeErrorBg: '#f26a76',
  buttonPrimaryBg: '#4285f4',

  cardStyleCardBg: ''
}

/**
 * @description 是否是暗黑模式
 */
export const isDarkMode = ref(false)

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
  root.style.setProperty('--sticky-badge-bg', theme.stickyBadgeBg)
  root.style.setProperty('--sticky-badge-error-bg', theme.stickyBadgeErrorBg)
  root.style.setProperty('--button-primary-bg', theme.buttonPrimaryBg)
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
  isDarkMode.value = mode === 'dark'
}

/**
 * @description 更新应用强调色
 * @param {string} color - 新的强调色（十六进制颜色代码）
 */
export function updateAccentColor(color: string): void {
  const root = document.documentElement
  root.style.setProperty('--button-primary-bg', color)
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
