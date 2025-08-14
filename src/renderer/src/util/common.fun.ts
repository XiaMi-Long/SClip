import hljs from 'highlight.js'
/**
 * 通用首次显示动画
 * @returns 动画配置
 */
const firstShowTransitionMotion = {
  initial: {
    opacity: 0,
    y: 70
  },
  visibleOnce: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1000,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
}

/**
 * 格式化日期时间
 * @param timestamp 时间戳
 * @returns 格式化后的日期时间字符串
 */
const formatDateTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * 判断是否是颜色值
 * @returns {boolean} 是否是颜色值
 */
const isColorValue = (color: string) => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color)
}

/**
 * 将十六进制颜色转换为RGB格式
 */
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

/**
 * 判断是否是代码值
 * @returns {boolean} 是否是代码值
 */
const isCodeValue = (code: string) => {
  const result = hljs.highlightAuto(code)
  const relevanceThreshold = 2
  console.log(`String: "${code}", Relevance: ${result.relevance}`)
  return result.relevance > relevanceThreshold
}

export { formatDateTime, firstShowTransitionMotion, isColorValue, hexToRgb, isCodeValue }
