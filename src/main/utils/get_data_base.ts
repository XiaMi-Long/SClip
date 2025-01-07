import { DBManager } from "../database";
import { Logger } from "./logger";


const db = DBManager.getInstance()

/**
 * 获取剪贴板历史记录
 * @returns
 */
function getClipboardHistory(): ClipboardState[] {
    Logger.info('Database', `获取剪贴板记录`)
    return db.getClipboardHistory()
}

/**
 * 保存剪贴板历史记录
 * @param data
 * @returns
 */
function setClipboardHistory(data: ClipboardState) {
    const id = db.insertClipboardItem(data)
    Logger.info('Database', `保存剪贴板记录 ID: ${id}`)

    return id
}

/**
 * 删除剪贴板历史记录
 * @param id
 * @returns
 */
function removeClipboardHistory(id: number) {
    Logger.info('Database', `删除剪贴板记录 ID: ${id}`)
    return db.deleteItem(id)
}

/**
 * 清空剪贴板历史记录
 * @returns
 */
function clearClipboardHistory() {
    Logger.info('Database', `清空剪贴板记录`)
    return db.clearHistory()
}

export { getClipboardHistory, setClipboardHistory, removeClipboardHistory, clearClipboardHistory }