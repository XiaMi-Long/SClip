import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import { Logger } from '../services/logger.service'

/**
 * 日志数据接口
 */
interface LogData {
  id?: number
  level: 'info' | 'warn' | 'error' | 'debug'
  module: string
  message: string
  data?: string
  created_at: number
}

/**
 * 数据库管理类
 */
export class DBManager {
  private static instance: DBManager
  private db: Database.Database

  private constructor() {
    // 在用户数据目录创建数据库文件
    const dbPath = path.join(app.getPath('userData'), 'app.db')
    this.db = new Database(dbPath)

    // 初始化表结构
    this.initTables()
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): DBManager {
    if (!DBManager.instance) {
      DBManager.instance = new DBManager()
    }
    return DBManager.instance
  }

  /**
   * 初始化数据库表
   */
  private initTables(): void {
    try {
      // 删除旧表（如果存在）
      // this.db.exec(`
      //     DROP TABLE IF EXISTS clipboard_history;
      //     DROP TABLE IF EXISTS app_logs;
      // `)

      // 创建剪贴板历史表
      this.db.exec(`
                CREATE TABLE IF NOT EXISTS clipboard_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT NOT NULL,
                    timestamp INTEGER NOT NULL,
                    content_hash TEXT,
                    text TEXT,
                    content TEXT NOT NULL,
                    meta TEXT,
                    last_file_name_text TEXT,
                    isSticky TEXT
                )
            `)

      // 创建日志表
      this.db.exec(`
                CREATE TABLE IF NOT EXISTS app_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    level TEXT NOT NULL,
                    module TEXT NOT NULL,
                    message TEXT NOT NULL,
                    data TEXT,
                    created_at INTEGER NOT NULL
                )
            `)

      // 创建应用配置表
      this.db.exec(`
                CREATE TABLE IF NOT EXISTS app_settings (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    config_data TEXT NOT NULL,
                    updated_at INTEGER NOT NULL
                )
            `)

      // 创建索引
      this.db.exec(`
                CREATE INDEX IF NOT EXISTS idx_clipboard_hash ON clipboard_history(content_hash);
                CREATE INDEX IF NOT EXISTS idx_clipboard_timestamp ON clipboard_history(timestamp DESC);
                CREATE INDEX IF NOT EXISTS idx_logs_level ON app_logs(level);
                CREATE INDEX IF NOT EXISTS idx_logs_created ON app_logs(created_at DESC);
            `)

      console.log('DBManager', '数据库表初始化成功')
    } catch (error) {
      console.error('DBManager', '数据库表初始化失败', error)
      throw error
    }
  }

  /**
   * 插入剪贴板记录
   */
  public insertClipboardItem(data: ClipboardState): number {
    try {
      const stmt = this.db.prepare(`
                INSERT INTO clipboard_history (
                    type,
                    timestamp,
                    content_hash,
                    content,
                    meta,
                    last_file_name_text,
                    isSticky
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `)

      const result = stmt.run(
        data.type,
        data.timestamp,
        data.contentHash,
        data.content,
        JSON.stringify(data.meta),
        data.last_file_name_text,
        data.isSticky
      )

      return result.lastInsertRowid as number
    } catch (error) {
      Logger.error('DBManager', 'insertClipboardItem failed', error)
      throw error
    }
  }

  /**
   * 获取剪贴板历史记录
   */
  public getClipboardHistory(limit: number = 50): ClipboardState[] {
    try {
      const stmt = this.db.prepare(`
                SELECT
                    id,
                    type,
                    timestamp,
                    content_hash as contentHash,
                    content,
                    meta,
                    last_file_name_text,
                    isSticky
                FROM clipboard_history
                ORDER BY timestamp DESC
                LIMIT ?
            `)
      const results = stmt.all(limit) as Array<{
        id: number
        type: ClipboardType
        timestamp: number
        contentHash?: string
        content: string
        meta: string
        last_file_name_text: string
        isSticky: string
      }>

      return results.map((row) => ({
        ...row,
        meta: JSON.parse(row.meta || '{}')
      })) as ClipboardState[]
    } catch (error) {
      Logger.error('DBManager', 'getClipboardHistory failed', error)
      return []
    }
  }

  /**
   * 更新剪贴板数据
   * @param {ClipboardState} data - 要更新的剪贴板数据对象
   * @returns {boolean} 是否更新成功
   */
  public updateClipboardItem(data: ClipboardState): boolean {
    try {
      const stmt = this.db.prepare(`
                UPDATE clipboard_history
                SET
                    type = ?,
                    timestamp = ?,
                    content_hash = ?,
                    content = ?,
                    meta = ?,
                    last_file_name_text = ?,
                    isSticky = ?
                WHERE id = ?
            `)

      const result = stmt.run(
        data.type,
        data.timestamp,
        data.contentHash,
        data.content,
        JSON.stringify(data.meta),
        data.last_file_name_text,
        data.isSticky,
        data.id
      )

      return result.changes > 0
    } catch (error) {
      Logger.error('DBManager', 'updateClipboardItem failed', error)
      throw error
    }
  }

  /**
   * 根据ID删除剪贴板数据
   * @param {number} id - 要删除的剪贴板数据ID
   * @returns {boolean} 是否删除成功
   */
  public deleteClipboardItem(id: number): boolean {
    try {
      const stmt = this.db.prepare(`
                DELETE FROM clipboard_history
                WHERE id = ?
            `)

      const result = stmt.run(id)
      return result.changes > 0
    } catch (error) {
      Logger.error('DBManager', 'deleteClipboardItem failed', error)
      return false
    }
  }

  /**
   * 插入日志记录
   */
  public insertLog(data: LogData): number {
    try {
      const stmt = this.db.prepare(`
                INSERT INTO app_logs (level, module, message, data, created_at)
                VALUES (?, ?, ?, ?, ?)
            `)

      const result = stmt.run(data.level, data.module, data.message, data.data, data.created_at)

      return result.lastInsertRowid as number
    } catch (error) {
      Logger.error('DBManager', 'insertLog failed', error)
      throw error
    }
  }

  /**
   * 获取日志记录
   */
  public getLogs(options: {
    level?: string
    limit?: number
    startTime?: number
    endTime?: number
  }): LogData[] {
    try {
      let query = 'SELECT * FROM app_logs WHERE 1=1'
      const params: Array<string | number> = []

      if (options.level) {
        const levels = options.level.split(',')
        if (levels.length > 1) {
          query += ` AND level IN (${levels.map(() => '?').join(',')})`
          params.push(...levels)
        } else {
          query += ' AND level = ?'
          params.push(options.level)
        }
      }

      if (options.startTime) {
        query += ' AND created_at >= ?'
        params.push(options.startTime)
      }

      if (options.endTime) {
        query += ' AND created_at <= ?'
        params.push(options.endTime)
      }

      query += ' ORDER BY created_at DESC'

      if (options.limit) {
        query += ' LIMIT ?'
        params.push(options.limit)
      }

      const stmt = this.db.prepare(query)
      return stmt.all(...params) as LogData[]
    } catch (error) {
      Logger.error('DBManager', 'getLogs failed', error)
      return []
    }
  }

  /**
   * 清理过期日志
   */
  public cleanOldLogs(daysToKeep: number = 30): void {
    try {
      const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000
      const stmt = this.db.prepare('DELETE FROM app_logs WHERE created_at < ?')
      stmt.run(cutoffTime)
    } catch (error) {
      Logger.error('DBManager', 'cleanOldLogs failed', error)
    }
  }

  /**
   * 清理过期剪贴板记录
   */
  public cleanOldClipboardItems(itemsToKeep: number = 1000): void {
    try {
      const stmt = this.db.prepare(`
                DELETE FROM clipboard_history
                WHERE id NOT IN (
                    SELECT id FROM clipboard_history
                    ORDER BY timestamp DESC
                    LIMIT ?
                )
            `)
      stmt.run(itemsToKeep)
    } catch (error) {
      Logger.error('DBManager', 'cleanOldClipboardItems failed', error)
    }
  }

  /**
   * 清空日志表
   * @returns {number} 被删除的记录数
   */
  public clearAllLogs(): number {
    try {
      const stmt = this.db.prepare('DELETE FROM app_logs')
      const result = stmt.run()
      Logger.info('DBManager', `清空日志表成功，删除了 ${result.changes} 条记录`)
      return result.changes
    } catch (error) {
      Logger.error('DBManager', '清空日志表失败', error)
      throw error
    }
  }

  /**
   * 清空剪贴板记录表
   * @returns {number} 被删除的记录数
   */
  public clearAllClipboardHistory(): number {
    try {
      const stmt = this.db.prepare('DELETE FROM clipboard_history')
      const result = stmt.run()
      Logger.info('DBManager', `清空剪贴板记录表成功，删除了 ${result.changes} 条记录`)
      return result.changes
    } catch (error) {
      Logger.error('DBManager', '清空剪贴板记录表失败', error)
      throw error
    }
  }

  /**
   * 保存应用配置
   * @param {Setting} setting - 应用配置对象
   * @returns {boolean} 是否保存成功
   */
  public saveAppSettings(setting: Setting): boolean {
    try {
      const now = Date.now()
      const configData = JSON.stringify(setting)

      // 使用REPLACE语法确保只有一条记录(id=1)
      const stmt = this.db.prepare(`
                REPLACE INTO app_settings (id, config_data, updated_at)
                VALUES (1, ?, ?)
            `)

      const result = stmt.run(configData, now)
      Logger.info('DBManager', '应用配置保存成功')
      return result.changes > 0
    } catch (error) {
      Logger.error('DBManager', '保存应用配置失败', error)
      return false
    }
  }

  /**
   * 获取应用配置
   * @returns {Setting | null} 应用配置对象，如果不存在则返回null
   */
  public getAppSettings(): Setting | null {
    try {
      const stmt = this.db.prepare('SELECT config_data FROM app_settings WHERE id = 1')
      const result = stmt.get() as { config_data: string } | undefined

      if (result && result.config_data) {
        return JSON.parse(result.config_data) as Setting
      }

      return null
    } catch (error) {
      Logger.error('DBManager', '获取应用配置失败', error)
      return null
    }
  }
}
