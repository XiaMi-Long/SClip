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

export { formatDateTime }
