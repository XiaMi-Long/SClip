import { globalShortcut } from 'electron'
/**
 * 全局快捷键管理类
 * 用于管理应用的全局快捷键注册和注销
 */
export class GlobalShortcut {
  /**
   * 快捷键映射对象
   * key: 快捷键组合（如 'Alt+V'）
   * value: 对应的回调函数
   */
  private static shortcuts = new Map<string, () => void>()

  constructor() {}

  /**
   * 注册所有全局快捷键
   * 遍历 shortcuts 对象，注册每个快捷键
   */
  public static registerGlobalShortcut(): void {
    this.shortcuts.forEach((callback, key) => {
      try {
        const success = globalShortcut.register(key, callback)
        if (!success) {
          console.error(`Failed to register shortcut: ${key}`)
        }
      } catch (error) {
        console.error(`Error registering shortcut ${key}:`, error)
      }
    })
  }

  /**
   * 注销所有全局快捷键
   */
  public static unregisterGlobalShortcut() {
    globalShortcut.unregisterAll()
  }

  /**
   * 注册单个快捷键
   * @param key 快捷键组合
   * @param callback 回调函数
   * @returns 是否成功注册
   */
  public static registerShortcut(key: string, callback: () => void): boolean {
    if (this.shortcuts.has(key)) {
      return false
    }

    const success = globalShortcut.register(key, callback)
    if (success) {
      this.shortcuts.set(key, callback)
    }
    return success
  }

  /**
   * 注销单个快捷键
   * @param key 快捷键组合
   * @returns 是否成功注销
   */
  public static unregisterShortcut(key: string): boolean {
    if (this.shortcuts.has(key)) {
      globalShortcut.unregister(key)
      this.shortcuts.delete(key)
      return true
    }
    return false
  }
}
