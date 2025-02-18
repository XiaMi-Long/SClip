/**
 * 日志工具类
 */
import { DBManager } from '../database/database.manager'

export class Logger {
  private static db = DBManager.getInstance()

  private static getTime(): string {
    return new Date().toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    })
  }

  /**
   * 信息日志
   * @param module 模块名称
   * @param message 日志信息
   * @param data 额外数据
   */
  static info(module: string, message: string, data?: any): void {
    const logMessage = `[${this.getTime()}] 📘 [${module}] ${message}`
    console.log(logMessage, data ? data + '\n' : '')

    // 保存到数据库
    this.db.insertLog({
      level: 'info',
      module,
      message,
      data: data ? JSON.stringify(data) : undefined,
      created_at: Date.now()
    })
  }

  /**
   * 警告日志
   * @param module 模块名称
   * @param message 日志信息
   * @param data 额外数据
   */
  static warn(module: string, message: string, data?: any): void {
    console.warn(`[${this.getTime()}] 📙 [${module}] ${message}`, data ? data + '\n' : '')

    // 保存到数据库
    this.db.insertLog({
      level: 'warn',
      module,
      message,
      data: data ? JSON.stringify(data) : undefined,
      created_at: Date.now()
    })
  }

  /**
   * 错误日志
   * @param module 模块名称
   * @param message 日志信息
   * @param error 错误对象
   */
  static error(module: string, message: string, error?: any): void {
    console.error(`[${this.getTime()}] 📕 [${module}] ${message}`, error ? error + '\n' : '')

    // 保存到数据库
    this.db.insertLog({
      level: 'error',
      module,
      message,
      data: error ? JSON.stringify(error) : undefined,
      created_at: Date.now()
    })
  }

  /**
   * 调试日志
   * @param module 模块名称
   * @param message 日志信息
   * @param data 额外数据
   */
  static debug(module: string, message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${this.getTime()}] 📓 [${module}] ${message}`, data ? data + '\n' : '')
    }

    // 保存到数据库
    this.db.insertLog({
      level: 'debug',
      module,
      message,
      data: data ? JSON.stringify(data) : undefined,
      created_at: Date.now()
    })
  }
}
