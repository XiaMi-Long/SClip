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

export { formatDateTime, firstShowTransitionMotion }
