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
            this.db.exec(`
                DROP TABLE IF EXISTS clipboard_history;
                DROP TABLE IF EXISTS app_logs;
            `)

            // 创建剪贴板历史表
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS clipboard_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT NOT NULL,
                    timestamp INTEGER NOT NULL,
                    content_hash TEXT UNIQUE,
                    text TEXT,
                    content TEXT NOT NULL,
                    meta TEXT
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
                    meta
                )
                VALUES (?, ?, ?, ?, ?)
            `)

            const result = stmt.run(
                data.type,
                data.timestamp,
                data.contentHash,
                data.content,
                JSON.stringify(data.meta)
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
                    type,
                    timestamp,
                    content_hash as contentHash,
                    content,
                    meta
                FROM clipboard_history
                ORDER BY timestamp DESC
                LIMIT ?
            `)
            const results = stmt.all(limit) as any[]

            return results.map(row => ({
                ...row,
                meta: JSON.parse(row.meta || '{}')
            }))
        } catch (error) {
            Logger.error('DBManager', 'getClipboardHistory failed', error)
            return []
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

            const result = stmt.run(
                data.level,
                data.module,
                data.message,
                data.data,
                data.created_at
            )

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
            const params: any[] = []

            if (options.level) {
                query += ' AND level = ?'
                params.push(options.level)
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
            const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)
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
}