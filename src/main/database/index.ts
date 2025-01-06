import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'

/**
 * 数据库管理类
 */
export class DBManager {
    private static instance: DBManager
    private db: Database.Database

    private constructor() {
        // 在用户数据目录创建数据库文件
        const dbPath = path.join(app.getPath('userData'), 'clipboard.db')
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
        // 创建剪贴板历史表
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS clipboard_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                type TEXT NOT NULL,
                content_hash TEXT,
                meta TEXT,
                created_at INTEGER NOT NULL
            )
        `)
    }

    /**
     * 插入剪贴板记录
     */
    public insertClipboardItem(data: {
        content: string
        type: string
        contentHash: string
        meta?: any
    }): number {
        const stmt = this.db.prepare(`
            INSERT INTO clipboard_history (content, type, content_hash, meta, created_at)
            VALUES (?, ?, ?, ?, ?)
        `)

        const result = stmt.run(
            data.content,
            data.type,
            data.contentHash,
            data.meta ? JSON.stringify(data.meta) : null,
            Date.now()
        )

        return result.lastInsertRowid as number
    }

    /**
     * 获取剪贴板历史记录
     */
    public getClipboardHistory(limit: number = 50): any[] {
        const stmt = this.db.prepare(`
            SELECT * FROM clipboard_history
            ORDER BY created_at DESC
            LIMIT ?
        `)

        return stmt.all(limit)
    }

    /**
     * 根据哈希值检查内容是否存在
     */
    public checkContentExists(contentHash: string): boolean {
        const stmt = this.db.prepare(`
            SELECT COUNT(*) as count
            FROM clipboard_history
            WHERE content_hash = ?
        `)

        const result = stmt.get(contentHash) as { count: number }
        return result.count > 0
    }

    /**
     * 删除指定记录
     */
    public deleteItem(id: number): void {
        const stmt = this.db.prepare('DELETE FROM clipboard_history WHERE id = ?')
        stmt.run(id)
    }

    /**
     * 清空历史记录
     */
    public clearHistory(): void {
        this.db.exec('DELETE FROM clipboard_history')
    }
}