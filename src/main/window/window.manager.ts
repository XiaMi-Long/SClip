import { BrowserWindowConstructorOptions, BrowserWindow } from 'electron'
import { Logger } from '../services/logger.service'
/**
 * 浏览器窗口配置接口
 */
interface BrowserWindowOptions {
  key: string // 窗口唯一标识
  browserWindow: BrowserWindowConstructorOptions // 窗口配置选项
}

/**
 * 浏览器窗口管理类
 * 用于管理应用中的所有 BrowserWindow 实例
 */
export class BrowserWindowManager {
  /**
   * 存储所有窗口实例的 Map
   * key: 窗口唯一标识
   * value: BrowserWindow 实例
   */
  private static browserWindows = new Map<string, BrowserWindow>()

  constructor() {}

  /**
   * 创建浏览器窗口
   * @param options 窗口配置选项
   */
  public static createBrowserWindow(options: BrowserWindowOptions): BrowserWindow {
    if (this.browserWindows.has(options.key)) {
      throw new Error(`Window with key ${options.key} already exists`)
    }

    const newBrowserWindow = new BrowserWindow({
      ...options.browserWindow
    })

    // 添加窗口真正关闭时的清理
    newBrowserWindow.on('closed', () => {
      this.browserWindows.delete(options.key)
    })

    this.browserWindows.set(options.key, newBrowserWindow)
    return newBrowserWindow
  }

  /**
   * 获取指定的浏览器窗口实例
   * @param key 窗口唯一标识
   * @returns BrowserWindow 实例或 undefined
   */
  public static getBrowserWindow(key: string): BrowserWindow | undefined {
    return this.browserWindows.get(key)
  }

  /**
   * 获取所有浏览器窗口
   * @returns 包含所有窗口的 Map
   */
  public static getBrowserWindows(): Map<string, BrowserWindow> {
    return this.browserWindows
  }

  /**
   * 销毁指定窗口
   * @param key 窗口唯一标识
   * @returns 是否成功销毁
   */
  public static destroyWindow(key: string): boolean {
    const window = this.browserWindows.get(key)
    if (window) {
      window.destroy()
      this.browserWindows.delete(key)
      return true
    }
    return false
  }

  /**
   * 检查指定窗口是否存在
   * @param key 窗口唯一标识
   * @returns 是否存在
   */
  public static hasWindow(key: string): boolean {
    return this.browserWindows.has(key)
  }

  /**
   * 清理并关闭所有窗口实例
   * 通常在应用退出前调用
   */
  public static destroyAllWindows(): void {
    try {
      // 遍历所有窗口
      for (const [key, window] of this.browserWindows) {
        if (!window.isDestroyed()) {
          // 移除所有关闭事件监听器
          window.removeAllListeners('close')
          // 关闭窗口
          window.destroy()
        }
        // 从 Map 中移除窗口实例
        this.browserWindows.delete(key)
      }
      // 清空 Map
      this.browserWindows.clear()
    } catch (error) {
      Logger.error('BrowserWindowManager', '清理窗口实例失败', error)
    }
  }
}
