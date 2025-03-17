import { app } from 'electron'
import { DBManager } from '../database/database.manager'

/**
 * 应用配置管理类
 * @class ConfigManager
 */
export class ConfigManager {
  private static instance: ConfigManager
  private setting: Setting
  private dbManager: DBManager

  private constructor() {
    // 获取数据库管理器实例
    this.dbManager = DBManager.getInstance()

    // 初始化默认配置
    this.setting = {
      applicationTheme: 'light',
      applicationPrimaryColor: '#4285f4',
      forceMacStatusBar: false,
      clipboard: {
        rtfTextZoom: 0.7,
        rtfRenderType: 'rtf',
        enableTextStyle: false,
        textStyleZoom: 1,
        longTextLimit: 400
      },
      appLanguage: 'zh-CN',
      shortcut: {
        appVisibleShortcut: {
          mac: 'Alt+V',
          windows: 'Alt+V',
          windowsDefaultShortcuts: 'Alt+V',
          windowSystemDefaultShortcuts: 'Super+V',
          macDefaultShortcuts: 'Alt+V'
        }
      },
      imageSettings: {
        displayMode: 'auto',
        enableAnimation: true
      },
      appBehavior: {
        jumpToFirstPage: true,
        historyLimit: 50,
        isFixedWindow: false,
        showTypeIndicator: false,
        showLongContentTip: false
      },
      system: {
        platform: process.platform,
        isMac: process.platform === 'darwin',
        isWindows: process.platform === 'win32',
        isLinux: process.platform === 'linux',
        appName: 'SClip',
        version: app.getVersion()
      }
    }

    // 尝试从数据库加载配置
    this.loadSettingsFromDB()
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

    // 每次更新设置后，保存到数据库
    this.saveSettingsToDB()
  }

  /**
   * 从数据库加载设置
   * @private
   */
  private loadSettingsFromDB(): void {
    try {
      const dbSettings = this.dbManager.getAppSettings()
      if (dbSettings) {
        // 合并数据库中的设置和默认设置
        this.setting = {
          ...this.setting,
          ...dbSettings
        }
        console.log('ConfigManager', '从数据库加载配置成功')
      } else {
        // 如果数据库中没有，则配置到数据库
        this.saveSettingsToDB()
        console.log('ConfigManager', '数据库中没有找到配置，使用默认配置')
      }
    } catch (error) {
      console.error('ConfigManager', '从数据库加载配置失败', error)
    }
  }

  /**
   * 保存设置到数据库
   * @private
   */
  private saveSettingsToDB(): void {
    try {
      const success = this.dbManager.saveAppSettings(this.setting)
      if (success) {
        console.log('ConfigManager', '配置已保存到数据库')
      } else {
        console.error('ConfigManager', '保存配置到数据库失败')
      }
    } catch (error) {
      console.error('ConfigManager', '保存配置到数据库失败', error)
    }
  }
}
