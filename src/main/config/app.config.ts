import { app } from 'electron'

/**
 * 应用配置管理类
 * @class ConfigManager
 */
export class ConfigManager {
  private static instance: ConfigManager
  private setting: Setting

  private constructor() {
    // 初始化默认配置
    this.setting = {
      applicationTheme: 'light',
      clipboardTheme: 'default',
      rtfTextZoom: 0.3,
      rtfRenderType: 'rtf',
      system: {
        platform: process.platform,
        isMac: process.platform === 'darwin',
        // isMac: false,
        isWindows: process.platform === 'win32',
        // isWindows: true,
        isLinux: process.platform === 'linux',
        appName: 'SClip',
        version: app.getVersion()
      },
      stickyBadgeTheme: 'default'
    }
  }

  /**
   * 获取ConfigManager单例
   * @returns {ConfigManager} ConfigManager实例
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  /**
   * 获取设置
   * @returns {Setting} 设置对象
   */
  public getSetting(): Setting {
    return this.setting
  }

  /**
   * 更新设置
   * @param {Partial<Setting>} newSetting - 新的设置对象
   */
  public updateSetting(newSetting: Partial<Setting>): void {
    this.setting = {
      ...this.setting,
      ...newSetting
    }
  }
}
