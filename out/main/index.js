"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const Database = require("better-sqlite3");
const crypto = require("crypto");
const child_process = require("child_process");
const util = require("util");
const fs = require("fs");
const robot = require("robotjs");
const icon = path.join(__dirname, "../../resources/images/icons/icon.png");
class DBManager {
  static instance;
  db;
  constructor() {
    const dbPath = path.join(electron.app.getPath("userData"), "app.db");
    this.db = new Database(dbPath);
    this.initTables();
  }
  /**
   * 获取单例实例
   */
  static getInstance() {
    if (!DBManager.instance) {
      DBManager.instance = new DBManager();
    }
    return DBManager.instance;
  }
  /**
   * 初始化数据库表
   */
  initTables() {
    try {
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
                    isSticky TEXT,
                    clipboard_types TEXT
                )
            `);
      this.db.exec(`
                CREATE TABLE IF NOT EXISTS app_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    level TEXT NOT NULL,
                    module TEXT NOT NULL,
                    message TEXT NOT NULL,
                    data TEXT,
                    created_at INTEGER NOT NULL
                )
            `);
      this.db.exec(`
                CREATE TABLE IF NOT EXISTS app_settings (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    config_data TEXT NOT NULL,
                    updated_at INTEGER NOT NULL
                )
            `);
      this.db.exec(`
                CREATE INDEX IF NOT EXISTS idx_clipboard_hash ON clipboard_history(content_hash);
                CREATE INDEX IF NOT EXISTS idx_clipboard_timestamp ON clipboard_history(timestamp DESC);
                CREATE INDEX IF NOT EXISTS idx_logs_level ON app_logs(level);
                CREATE INDEX IF NOT EXISTS idx_logs_created ON app_logs(created_at DESC);
            `);
      console.log("DBManager", "数据库表初始化成功");
    } catch (error) {
      console.error("DBManager", "数据库表初始化失败", error);
      throw error;
    }
  }
  /**
   * 插入剪贴板记录
   */
  insertClipboardItem(data) {
    try {
      const stmt = this.db.prepare(`
                INSERT INTO clipboard_history (
                    type,
                    timestamp,
                    content_hash,
                    content,
                    meta,
                    last_file_name_text,
                    isSticky,
                    clipboard_types
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
      const result = stmt.run(
        data.type,
        data.timestamp,
        data.contentHash,
        data.content,
        JSON.stringify(data.meta),
        data.last_file_name_text,
        data.isSticky,
        data.clipboardTypes.join(",")
      );
      return result.lastInsertRowid;
    } catch (error) {
      Logger.error("DBManager", "insertClipboardItem failed", error);
      throw error;
    }
  }
  /**
   * 获取剪贴板历史记录
   * @param {number} limit - 限制返回的记录数量
   * @returns {ClipboardState[]} 剪贴板记录数组，按时间从旧到新排序
   */
  getClipboardHistory(limit = 50) {
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
                    isSticky,
                    clipboard_types as clipboardTypes
                FROM clipboard_history
                ORDER BY timestamp DESC
                LIMIT ?
            `);
      const results = stmt.all(limit);
      return results.reverse().map((row) => ({
        ...row,
        meta: JSON.parse(row.meta || "{}"),
        clipboardTypes: row.clipboardTypes.split(",")
      }));
    } catch (error) {
      Logger.error("DBManager", "getClipboardHistory failed", error);
      return [];
    }
  }
  /**
   * 更新剪贴板数据
   * @param {ClipboardState} data - 要更新的剪贴板数据对象
   * @returns {boolean} 是否更新成功
   */
  updateClipboardItem(data) {
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
                    isSticky = ?,
                    clipboard_types = ?
                WHERE id = ?
            `);
      const result = stmt.run(
        data.type,
        data.timestamp,
        data.contentHash,
        data.content,
        JSON.stringify(data.meta),
        data.last_file_name_text,
        data.isSticky,
        data.clipboardTypes.join(","),
        data.id
      );
      return result.changes > 0;
    } catch (error) {
      Logger.error("DBManager", "updateClipboardItem failed", error);
      throw error;
    }
  }
  /**
   * 根据ID删除剪贴板数据
   * @param {number} id - 要删除的剪贴板数据ID
   * @returns {boolean} 是否删除成功
   */
  deleteClipboardItem(id) {
    try {
      const stmt = this.db.prepare(`
                DELETE FROM clipboard_history
                WHERE id = ?
            `);
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      Logger.error("DBManager", "deleteClipboardItem failed", error);
      return false;
    }
  }
  /**
   * 插入日志记录
   */
  insertLog(data) {
    try {
      const stmt = this.db.prepare(`
                INSERT INTO app_logs (level, module, message, data, created_at)
                VALUES (?, ?, ?, ?, ?)
            `);
      const result = stmt.run(data.level, data.module, data.message, data.data, data.created_at);
      return result.lastInsertRowid;
    } catch (error) {
      Logger.error("DBManager", "insertLog failed", error);
      throw error;
    }
  }
  /**
   * 获取日志记录
   */
  getLogs(options) {
    try {
      let query = "SELECT * FROM app_logs WHERE 1=1";
      const params = [];
      if (options.level) {
        const levels = options.level.split(",");
        if (levels.length > 1) {
          query += ` AND level IN (${levels.map(() => "?").join(",")})`;
          params.push(...levels);
        } else {
          query += " AND level = ?";
          params.push(options.level);
        }
      }
      if (options.startTime) {
        query += " AND created_at >= ?";
        params.push(options.startTime);
      }
      if (options.endTime) {
        query += " AND created_at <= ?";
        params.push(options.endTime);
      }
      query += " ORDER BY created_at DESC";
      if (options.limit) {
        query += " LIMIT ?";
        params.push(options.limit);
      }
      const stmt = this.db.prepare(query);
      return stmt.all(...params);
    } catch (error) {
      Logger.error("DBManager", "getLogs failed", error);
      return [];
    }
  }
  /**
   * 清理过期日志
   */
  cleanOldLogs(daysToKeep = 30) {
    try {
      const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1e3;
      const stmt = this.db.prepare("DELETE FROM app_logs WHERE created_at < ?");
      stmt.run(cutoffTime);
    } catch (error) {
      Logger.error("DBManager", "cleanOldLogs failed", error);
    }
  }
  /**
   * 清理过期剪贴板记录
   */
  cleanOldClipboardItems(itemsToKeep = 1e3) {
    try {
      const stmt = this.db.prepare(`
                DELETE FROM clipboard_history
                WHERE id NOT IN (
                    SELECT id FROM clipboard_history
                    ORDER BY timestamp DESC
                    LIMIT ?
                )
            `);
      stmt.run(itemsToKeep);
    } catch (error) {
      Logger.error("DBManager", "cleanOldClipboardItems failed", error);
    }
  }
  /**
   * 清空日志表
   * @returns {number} 被删除的记录数
   */
  clearAllLogs() {
    try {
      const stmt = this.db.prepare("DELETE FROM app_logs");
      const result = stmt.run();
      Logger.info("DBManager", `清空日志表成功，删除了 ${result.changes} 条记录`);
      return result.changes;
    } catch (error) {
      Logger.error("DBManager", "清空日志表失败", error);
      throw error;
    }
  }
  /**
   * 清空剪贴板记录表
   * @returns {number} 被删除的记录数
   */
  clearAllClipboardHistory() {
    try {
      const stmt = this.db.prepare("DELETE FROM clipboard_history");
      const result = stmt.run();
      Logger.info("DBManager", `清空剪贴板记录表成功，删除了 ${result.changes} 条记录`);
      return result.changes;
    } catch (error) {
      Logger.error("DBManager", "清空剪贴板记录表失败", error);
      throw error;
    }
  }
  /**
   * 保存应用配置
   * @param {Setting} setting - 应用配置对象
   * @returns {boolean} 是否保存成功
   */
  saveAppSettings(setting) {
    try {
      const now = Date.now();
      const configData = JSON.stringify(setting);
      const stmt = this.db.prepare(`
                REPLACE INTO app_settings (id, config_data, updated_at)
                VALUES (1, ?, ?)
            `);
      const result = stmt.run(configData, now);
      Logger.info("DBManager", "应用配置保存成功");
      return result.changes > 0;
    } catch (error) {
      Logger.error("DBManager", "保存应用配置失败", error);
      return false;
    }
  }
  /**
   * 获取应用配置
   * @returns {Setting | null} 应用配置对象，如果不存在则返回null
   */
  getAppSettings() {
    try {
      const stmt = this.db.prepare("SELECT config_data FROM app_settings WHERE id = 1");
      const result = stmt.get();
      if (result && result.config_data) {
        return JSON.parse(result.config_data);
      }
      return null;
    } catch (error) {
      Logger.error("DBManager", "获取应用配置失败", error);
      return null;
    }
  }
}
class Logger {
  static db = DBManager.getInstance();
  static getTime() {
    return (/* @__PURE__ */ new Date()).toLocaleTimeString("zh-CN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3
    });
  }
  /**
   * 信息日志
   * @param module 模块名称
   * @param message 日志信息
   * @param data 额外数据
   */
  static info(module, message, data) {
    const logMessage = `[${this.getTime()}] 📘 [${module}] ${message}`;
    console.log(logMessage, data ? data + "\n" : "");
  }
  /**
   * 警告日志
   * @param module 模块名称
   * @param message 日志信息
   * @param data 额外数据
   */
  static warn(module, message, data) {
    console.warn(`[${this.getTime()}] 📙 [${module}] ${message}`, data ? data + "\n" : "");
    this.db.insertLog({
      level: "warn",
      module,
      message,
      data: data ? JSON.stringify(data) : void 0,
      created_at: Date.now()
    });
  }
  /**
   * 错误日志
   * @param module 模块名称
   * @param message 日志信息
   * @param error 错误对象
   */
  static error(module, message, error) {
    console.error(`[${this.getTime()}] 📕 [${module}] ${message}`, error ? error + "\n" : "");
    this.db.insertLog({
      level: "error",
      module,
      message,
      data: error ? JSON.stringify(error) : void 0,
      created_at: Date.now()
    });
  }
  /**
   * 调试日志
   * @param module 模块名称
   * @param message 日志信息
   * @param data 额外数据
   */
  static debug(module, message, data) {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[${this.getTime()}] 📓 [${module}] ${message}`, data ? data + "\n" : "");
    }
  }
}
class BrowserWindowManager {
  /**
   * 存储所有窗口实例的 Map
   * key: 窗口唯一标识
   * value: BrowserWindow 实例
   */
  static browserWindows = /* @__PURE__ */ new Map();
  constructor() {
  }
  /**
   * 创建浏览器窗口
   * @param options 窗口配置选项
   */
  static createBrowserWindow(options) {
    if (this.browserWindows.has(options.key)) {
      throw new Error(`Window with key ${options.key} already exists`);
    }
    const newBrowserWindow = new electron.BrowserWindow({
      ...options.browserWindow
    });
    newBrowserWindow.on("closed", () => {
      this.browserWindows.delete(options.key);
    });
    this.browserWindows.set(options.key, newBrowserWindow);
    return newBrowserWindow;
  }
  /**
   * 获取指定的浏览器窗口实例
   * @param key 窗口唯一标识
   * @returns BrowserWindow 实例或 undefined
   */
  static getBrowserWindow(key) {
    return this.browserWindows.get(key);
  }
  /**
   * 获取所有浏览器窗口
   * @returns 包含所有窗口的 Map
   */
  static getBrowserWindows() {
    return this.browserWindows;
  }
  /**
   * 销毁指定窗口
   * @param key 窗口唯一标识
   * @returns 是否成功销毁
   */
  static destroyWindow(key) {
    const window = this.browserWindows.get(key);
    if (window) {
      window.destroy();
      this.browserWindows.delete(key);
      return true;
    }
    return false;
  }
  /**
   * 检查指定窗口是否存在
   * @param key 窗口唯一标识
   * @returns 是否存在
   */
  static hasWindow(key) {
    return this.browserWindows.has(key);
  }
  /**
   * 清理并关闭所有窗口实例
   * 通常在应用退出前调用
   */
  static destroyAllWindows() {
    try {
      for (const [key, window] of this.browserWindows) {
        if (!window.isDestroyed()) {
          window.removeAllListeners("close");
          window.destroy();
        }
        this.browserWindows.delete(key);
      }
      this.browserWindows.clear();
    } catch (error) {
      Logger.error("BrowserWindowManager", "清理窗口实例失败", error);
    }
  }
}
class ConfigManager {
  static instance;
  setting;
  dbManager;
  constructor() {
    this.dbManager = DBManager.getInstance();
    this.setting = {
      applicationTheme: "light",
      applicationPrimaryColor: "#4285f4",
      forceMacStatusBar: false,
      clipboard: {
        rtfTextZoom: 0.7,
        rtfRenderType: "rtf",
        enableTextStyle: false,
        textStyleZoom: 1,
        longTextLimit: 400
      },
      appLanguage: "zh-CN",
      shortcut: {
        appVisibleShortcut: {
          mac: "Alt+V",
          windows: "Alt+V",
          windowsDefaultShortcuts: "Alt+V",
          windowSystemDefaultShortcuts: "Super+V",
          macDefaultShortcuts: "Alt+V"
        }
      },
      imageSettings: {
        displayMode: "auto",
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
        isMac: process.platform === "darwin",
        isWindows: process.platform === "win32",
        isLinux: process.platform === "linux",
        appName: "SClip",
        version: electron.app.getVersion(),
        updateLog: ["#V1.0.0#发布1.0.0版本"]
      }
    };
    this.loadSettingsFromDB();
  }
  /**
   * 获取ConfigManager单例
   * @returns {ConfigManager} ConfigManager实例
   */
  static getInstance() {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }
  /**
   * 获取设置
   * @returns {Setting} 设置对象
   */
  getSetting() {
    return this.setting;
  }
  /**
   * 更新设置
   * @param {Partial<Setting>} newSetting - 新的设置对象
   */
  updateSetting(newSetting) {
    this.setting = {
      ...this.setting,
      ...newSetting
    };
    this.saveSettingsToDB();
  }
  /**
   * 从数据库加载设置
   * @private
   */
  loadSettingsFromDB() {
    try {
      const dbSettings = this.dbManager.getAppSettings();
      if (dbSettings) {
        this.setting = {
          ...this.setting,
          ...dbSettings
        };
        console.log("ConfigManager", "从数据库加载配置成功");
      } else {
        this.saveSettingsToDB();
        console.log("ConfigManager", "数据库中没有找到配置，使用默认配置");
      }
    } catch (error) {
      console.error("ConfigManager", "从数据库加载配置失败", error);
    }
  }
  /**
   * 保存设置到数据库
   * @private
   */
  saveSettingsToDB() {
    try {
      const success = this.dbManager.saveAppSettings(this.setting);
      if (success) {
        console.log("ConfigManager", "配置已保存到数据库");
      } else {
        console.error("ConfigManager", "保存配置到数据库失败");
      }
    } catch (error) {
      console.error("ConfigManager", "保存配置到数据库失败", error);
    }
  }
}
class MainIPCService {
  /**
   * 注册所有IPC事件监听
   * 整合所有preload相关的调用
   */
  static registerAllEvents() {
    this.registerMainProcessReceivers();
    this.registerMainProcessHandlers();
  }
  /**
   * 注册从渲染进程接收消息的事件（不需要返回数据）
   * 使用ipcMain.on方法
   */
  static registerMainProcessReceivers() {
    electron.ipcMain.on("clipboard:write-clipboard", (event, clipboardState) => {
      Logger.info("Application", `主进程通信-获取到渲染进程剪贴板记录`);
      const window = electron.BrowserWindow.getAllWindows()[0];
      if (!window) return;
      try {
        switch (clipboardState.type) {
          case "image": {
            const image = electron.nativeImage.createFromDataURL(clipboardState.content);
            electron.clipboard.writeImage(image);
            break;
          }
          case "rtf": {
            const setting = ConfigManager.getInstance().getSetting();
            if (setting.clipboard.rtfRenderType === "rtf") {
              electron.clipboard.writeRTF(clipboardState.content);
            } else if (setting.clipboard.rtfRenderType === "html") {
              electron.clipboard.writeHTML(clipboardState.meta.rtf_html);
            } else {
              electron.clipboard.writeText(clipboardState.meta.rtf_text);
            }
            break;
          }
          default:
            electron.clipboard.writeText(clipboardState.content);
            break;
        }
        if (!window.isAlwaysOnTop()) {
          window.minimize();
        }
        setTimeout(() => {
          robot.keyTap("v", process.platform === "darwin" ? "command" : "control");
        }, 200);
      } catch (error) {
        Logger.error("Application", "粘贴内容失败", error);
      }
    });
    electron.ipcMain.on("clipboard:update-clipboard-item", (event, clipboardState) => {
      try {
        if (clipboardState) {
          DBManager.getInstance().updateClipboardItem(clipboardState);
        }
      } catch (error) {
        Logger.error("Application", "更新剪贴板数据失败", error);
      }
    });
    electron.ipcMain.on("clipboard:delete-clipboard-item", (_event, clipboardState) => {
      Logger.info("IPC", "接收到删除剪贴板项目请求", {
        id: clipboardState.id
      });
      DBManager.getInstance().deleteClipboardItem(clipboardState.id);
    });
    electron.ipcMain.on("browserWindow:open-setting", () => {
      ApplicationRegister.getSettingWindowMethod().init();
    });
    electron.ipcMain.on("titleBar:window-minimize", (event) => {
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      if (win) {
        win.minimize();
      }
    });
    electron.ipcMain.on("titleBar:window-maximize", (event) => {
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      if (win) {
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    });
    electron.ipcMain.on("titleBar:window-close", (event) => {
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      if (!win) return;
      const windowType = win === ApplicationRegister.getMainWindowMethod().getMainWindow() ? "main" : "setting";
      if (windowType === "main") {
        win.hide();
      } else {
        win.close();
      }
    });
    electron.ipcMain.on("appConfig:update-config-setting", (event, setting, windowId) => {
      ConfigManager.getInstance().updateSetting(setting);
      const allWindows = BrowserWindowManager.getBrowserWindows();
      allWindows.forEach((_, key) => {
        if (key !== windowId) {
          this.sendToRenderer.setSettingWindow(setting, key);
        }
      });
    });
    electron.ipcMain.on("mainWindow:set-is-fixed-window", (event, isFixedWindow) => {
      const window = BrowserWindowManager.getBrowserWindow("main");
      if (window) {
        window.setAlwaysOnTop(isFixedWindow, "floating");
      }
    });
  }
  /**
   * 注册需要返回数据给渲染进程的处理器
   * 使用ipcMain.handle方法
   */
  static registerMainProcessHandlers() {
    electron.ipcMain.handle("systemTheme:get-native-theme-shouldUseDarkColors", () => {
      return electron.nativeTheme.shouldUseDarkColors;
    });
    electron.ipcMain.handle("database:get-logs", async (_event, options) => {
      Logger.info("IPC", "接收到获取日志请求", options);
      try {
        const logs = DBManager.getInstance().getLogs({
          level: options.level,
          limit: options.limit || 20,
          startTime: options.startTime,
          endTime: options.endTime
        });
        return {
          data: logs.slice(options.offset || 0, (options.offset || 0) + (options.limit || 20)),
          total: logs.length
        };
      } catch (error) {
        Logger.error("IPC", "获取日志失败", error);
        return { data: [], total: 0 };
      }
    });
    electron.ipcMain.handle("database:clear-all-logs", async () => {
      Logger.info("IPC", "接收到清空所有日志请求");
      try {
        const result = DBManager.getInstance().clearAllLogs();
        return result;
      } catch (error) {
        Logger.error("IPC", "清空日志失败", error);
        return 0;
      }
    });
  }
  /**
   * 主进程发送到渲染进程的消息
   * 整合所有发送到渲染进程的方法
   */
  static sendToRenderer = {
    /**
     * 发送剪贴板数据
     * @param data 剪贴板数据
     */
    setClipboardToRenderer: (data) => {
      try {
        Logger.info("SendRenderer", "发送剪贴板数据", data);
        const mainWindow = BrowserWindowManager.getBrowserWindow("main");
        if (mainWindow) {
          mainWindow.webContents.send("clipboard:set-clipboard-to-render", data);
        }
      } catch (error) {
        Logger.error("SendRenderer", "发送剪贴板数据失败", error);
      }
    },
    /**
     * 发送应用配置数据
     * @param data 应用配置数据
     * @param browserWindowKey 窗口key
     */
    setSettingWindow: (data, browserWindowKey) => {
      try {
        Logger.info(
          "SendRenderer-setSettingWindow",
          `【发送应用配置数据】-${browserWindowKey}`,
          data
        );
        const browserWindow = BrowserWindowManager.getBrowserWindow(browserWindowKey);
        if (browserWindow) {
          browserWindow.webContents.send("appConfig:get-app-setting", data);
        }
      } catch (error) {
        Logger.error("SendRenderer", "发送应用配置数据失败", error);
      }
    },
    /**
     * 发送窗口ID
     * @param windowId 窗口ID
     * @param browserWindowKey 窗口key
     */
    setWindowId: (windowId, browserWindowKey) => {
      try {
        const browserWindow = BrowserWindowManager.getBrowserWindow(browserWindowKey);
        if (browserWindow) {
          browserWindow.webContents.send("appConfig:set-window-id", windowId);
        }
      } catch (error) {
        Logger.error("SendRenderer", "发送窗口ID失败", error);
      }
    },
    /**
     * 发送系统主题变化事件
     * @param isDarkMode 是否为暗色模式
     */
    sendNativeThemeUpdated: (isDarkMode) => {
      const allWindows = BrowserWindowManager.getBrowserWindows();
      allWindows.forEach((_, key) => {
        const window = BrowserWindowManager.getBrowserWindow(key);
        if (window) {
          window.webContents.send("systemTheme:native-theme-updated", isDarkMode);
        }
      });
    },
    /**
     * 发送显示主窗口事件
     */
    sendShowMainWindow: () => {
      const mainWindow = BrowserWindowManager.getBrowserWindow("main");
      if (mainWindow) {
        if (mainWindow.isVisible() && ConfigManager.getInstance().getSetting().appBehavior.jumpToFirstPage) {
          mainWindow.webContents.send("mainWindow:show-main-window");
        }
      }
    }
  };
}
const readFileAsync = util.promisify(fs.readFile);
const mimeTypes = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  bmp: "image/bmp",
  tiff: "image/tiff",
  ico: "image/x-icon",
  svg: "image/svg+xml"
};
class ClipboardManager {
  static instance;
  lastState;
  execAsync;
  intervalId;
  isSystemPasting = false;
  SYSTEM_MARK = "SClip-system-read-stop-luoqi";
  // 新增系统标记常量
  constructor() {
    this.execAsync = util.promisify(child_process.exec);
    this.intervalId = null;
    this.isSystemPasting = false;
    this.lastState = {
      id: 0,
      type: "text",
      timestamp: 0,
      contentHash: "",
      last_file_name_text: "",
      content: "",
      meta: {},
      isSticky: "false",
      clipboardTypes: []
    };
    Logger.info("Clipboard", "正在监听剪贴板");
  }
  /**
   * 获取ClipboardManager单例
   * @returns {ClipboardManager} ClipboardManager实例
   */
  static getInstance() {
    if (!ClipboardManager.instance) {
      ClipboardManager.instance = new ClipboardManager();
    }
    return ClipboardManager.instance;
  }
  /**
   * 开始监听剪贴板
   */
  startListening() {
    if (this.intervalId) return;
    this.intervalId = setInterval(async () => {
      await this.handleClipboardChange();
    }, 1500);
  }
  /**
   * 停止监听剪贴板
   */
  stopListening() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  /**
   * 处理剪贴板变化
   */
  async handleClipboardChange() {
    const text = electron.clipboard.readText();
    Logger.debug("Clipboard", "剪贴板文本", text);
    if (this.lastState.contentHash === "") {
      const clipboardHistory = DBManager.getInstance().getClipboardHistory(1);
      if (clipboardHistory.length > 0) {
        this.lastState = clipboardHistory[0];
      }
    }
    const clipboardTypes = electron.clipboard.availableFormats();
    if (clipboardTypes.includes("text/uri-list")) {
      await this.handleUriList(text, clipboardTypes);
    } else if (clipboardTypes.includes("image/png")) {
      await this.handleImage(clipboardTypes);
    } else if (clipboardTypes.includes("text/rtf")) {
      const rtf = electron.clipboard.readRTF();
      const html = electron.clipboard.readHTML();
      await this.handleRtf(text, rtf, html, clipboardTypes);
    } else if (clipboardTypes.includes("text/plain") || clipboardTypes.includes("text/html")) {
      await this.handleText(text, clipboardTypes);
    }
  }
  /**
   * 处理URI列表类型的剪贴板内容
   */
  async handleUriList(text, clipboardTypes) {
    if (text === this.lastState.last_file_name_text) return;
    this.lastState.last_file_name_text = text;
    const actualPath = await this.getActualPath();
    const imageBase64 = await this.getImageBase64(actualPath);
    const time = (/* @__PURE__ */ new Date()).getTime();
    if (imageBase64) {
      this.updateLastState({
        type: "image",
        content: imageBase64,
        timestamp: time,
        meta: { origin: "local-file", actualPath },
        contentHash: "",
        isSticky: "false",
        clipboardTypes
      });
    } else {
      this.updateLastState({
        type: "text",
        content: text,
        timestamp: time,
        meta: { origin: "local-file-no-image", actualPath },
        contentHash: "",
        isSticky: "false",
        clipboardTypes
      });
      Logger.info("Clipboard", "文件不是支持的图片格式");
    }
  }
  /**
   * 处理图片类型的剪贴板内容
   */
  async handleImage(clipboardTypes) {
    const imageBuffer = electron.clipboard.readImage().toPNG();
    const contentHash = crypto.createHash("md5").update(imageBuffer.subarray(0, 1024)).digest("hex");
    if (contentHash === this.lastState.contentHash) return;
    this.updateLastState({
      type: "image",
      content: electron.clipboard.readImage().toDataURL(),
      timestamp: (/* @__PURE__ */ new Date()).getTime(),
      meta: {},
      contentHash,
      isSticky: "false",
      clipboardTypes
    });
  }
  /**
   * 处理rtf类型的剪贴板内容
   */
  async handleRtf(text, rtf, html, clipboardTypes) {
    const contentHash = crypto.createHash("md5").update(text).digest("hex");
    if (contentHash === this.lastState.contentHash) return;
    this.updateLastState({
      type: "rtf",
      content: rtf,
      timestamp: (/* @__PURE__ */ new Date()).getTime(),
      meta: { rtf_text: text, rtf_html: html },
      contentHash,
      isSticky: "false",
      clipboardTypes
    });
  }
  /**
   * 处理文本类型的剪贴板内容
   */
  async handleText(text, clipboardTypes) {
    const contentHash = crypto.createHash("md5").update(text).digest("hex");
    if (contentHash === this.lastState.contentHash) return;
    this.updateLastState({
      type: "text",
      content: text,
      timestamp: (/* @__PURE__ */ new Date()).getTime(),
      meta: {
        htmlContent: clipboardTypes.includes("text/html") ? electron.clipboard.readHTML() : ""
      },
      contentHash,
      isSticky: "false",
      clipboardTypes
    });
  }
  /**
   * 更新最后的状态并发送到渲染进程
   * @param {Object} options - 更新选项
   * @param {ClipboardType} options.type - 剪贴板的类型
   * @param {string} options.content - 剪贴板内容
   * @param {number} options.timestamp - 时间戳
   * @param {Record<string, unknown>} [options.meta={}] - 附加元数据
   * @param {string} [options.contentHash=''] - 内容哈希值
   * @param {string} [options.isSticky='false'] - 是否固定（'true'/'false'）
   * @param {string[]} [options.clipboardTypes=[]] - 剪贴板可用格式
   */
  updateLastState(options) {
    const {
      type,
      content,
      timestamp,
      meta = {},
      contentHash = "",
      isSticky = "false",
      clipboardTypes = []
    } = options;
    this.lastState = {
      ...this.lastState,
      type,
      content,
      timestamp,
      meta,
      contentHash,
      isSticky,
      clipboardTypes
    };
    const newId = DBManager.getInstance().insertClipboardItem(this.lastState);
    this.lastState.id = newId;
    MainIPCService.sendToRenderer.setClipboardToRenderer([this.lastState]);
  }
  /**
   * 处理mac和window系统图片路径函数
   * @param {string} path 图片路径
   * @returns {string} 处理后的图片路径
   */
  async getActualPath() {
    try {
      let buffer;
      let filePathStr = "";
      if (process.platform === "darwin") {
        buffer = electron.clipboard.readBuffer("public.file-url");
      } else if (process.platform === "win32") {
        buffer = electron.clipboard.readBuffer("FileNameW");
      } else {
        buffer = electron.clipboard.readBuffer("text/uri-list");
      }
      if (buffer) {
        filePathStr = buffer.toString("utf8");
        Logger.info("Clipboard", "文件路径:", filePathStr);
      }
      if (process.platform === "darwin") {
        if (filePathStr.includes(".file/id=")) {
          const script = `osascript -e 'get POSIX path of ((POSIX file "${filePathStr}") as alias)'`;
          const { stdout } = await this.execAsync(script);
          return stdout.trim();
        }
        return decodeURIComponent(filePathStr.replace("file://", ""));
      }
      if (process.platform === "win32") {
        let windowsPath = filePathStr.replace("file:///", "");
        windowsPath = decodeURIComponent(windowsPath);
        windowsPath = windowsPath.replace(/\//g, "\\");
        return windowsPath;
      }
      return decodeURIComponent(filePathStr.replace("file://", ""));
    } catch (error) {
      Logger.error("Clipboard", "路径转换错误:", error);
      return "";
    }
  }
  /**
   * 根据文件路径获取图片的 Base64 字符串
   * @param {string} path 图片路径
   * @returns {Promise<string>} Base64 字符串
   */
  async getImageBase64(path2) {
    const ext = path2.split(".").pop()?.toLowerCase();
    if (ext && mimeTypes[ext]) {
      try {
        const buffer = await readFileAsync(path2);
        const mimeType = mimeTypes[ext];
        return `data:${mimeType};base64,${buffer.toString("base64")}`;
      } catch (error) {
        Logger.error("Clipboard", "读取图片文件失败:", error);
        return "";
      }
    }
    return "";
  }
  /**
   * 写入系统标记到剪贴板
   */
  writeSystemMark() {
    electron.clipboard.writeText(this.SYSTEM_MARK);
  }
  /**
   * 设置系统粘贴状态
   * @param {boolean} status - 粘贴状态
   */
  setSystemPasting(status) {
    this.isSystemPasting = status;
  }
}
class GlobalShortcut {
  /**
   * 快捷键映射对象
   * key: 快捷键组合（如 'Alt+V'）
   * value: 对应的回调函数
   */
  static shortcuts = /* @__PURE__ */ new Map();
  constructor() {
  }
  /**
   * 注册所有全局快捷键
   * 遍历 shortcuts 对象，注册每个快捷键
   */
  static registerGlobalShortcut() {
    this.shortcuts.forEach((callback, key) => {
      try {
        const success = electron.globalShortcut.register(key, callback);
        if (!success) {
          console.error(`Failed to register shortcut: ${key}`);
        }
      } catch (error) {
        console.error(`Error registering shortcut ${key}:`, error);
      }
    });
  }
  /**
   * 注销所有全局快捷键
   */
  static unregisterGlobalShortcut() {
    electron.globalShortcut.unregisterAll();
  }
  /**
   * 注册单个快捷键
   * @param key 快捷键组合
   * @param callback 回调函数
   * @returns 是否成功注册
   */
  static registerShortcut(key, callback) {
    if (this.shortcuts.has(key)) {
      return false;
    }
    const success = electron.globalShortcut.register(key, callback);
    if (success) {
      this.shortcuts.set(key, callback);
    }
    return success;
  }
  /**
   * 注销单个快捷键
   * @param key 快捷键组合
   * @returns 是否成功注销
   */
  static unregisterShortcut(key) {
    if (this.shortcuts.has(key)) {
      electron.globalShortcut.unregister(key);
      this.shortcuts.delete(key);
      return true;
    }
    return false;
  }
}
class ApplicationRegister {
  static tray = null;
  /**
   * 主窗口的配置参数
   */
  static get mainWindowParams() {
    const { width, height } = this.getScaledWindowSize(300, 450);
    return {
      width,
      height,
      show: false,
      frame: false,
      transparent: process.platform === "darwin" ? true : false,
      skipTaskbar: process.platform === "darwin" ? true : false,
      // 不在任务栏显示
      titleBarStyle: "hidden",
      trafficLightPosition: { x: 12, y: 10 },
      autoHideMenuBar: true,
      title: "SClip",
      ...process.platform === "linux" ? { icon } : {},
      roundedCorners: true,
      vibrancy: "under-window",
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        sandbox: true,
        scrollBounce: true,
        devTools: utils.is.dev ? true : false
      }
    };
  }
  /**
   * 设置窗口的配置参数
   */
  static get settingWindowParams() {
    const { width, height } = this.getScaledWindowSize(1e3, 600);
    return {
      width,
      height,
      show: false,
      title: "SClip - 设置",
      frame: false,
      titleBarStyle: "hidden",
      autoHideMenuBar: true,
      trafficLightPosition: { x: 12, y: 10 },
      transparent: false,
      roundedCorners: true,
      vibrancy: "under-window",
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        sandbox: true,
        scrollBounce: true,
        devTools: utils.is.dev ? true : false
      }
    };
  }
  /**
   * 类构造函数
   * 由于所有方法都是静态的，此构造函数为空
   */
  constructor() {
  }
  /**
   * 应用注册事件对象
   * 包含应用级别的事件注册和初始化
   */
  static appRegister = {
    /**
     * 初始化应用注册事件
     */
    init() {
      this.registerEvent();
      this.registerIPCEvent();
      this.registerTray();
      this.registerAppMenu();
      this.registerPowerMonitorEvent();
      this.registerNativeThemeEvent();
      utils.electronApp.setAppUserModelId("com.sclip");
    },
    /**
     * 注册应用级别的事件
     */
    registerEvent() {
      if (process.platform === "darwin") {
        electron.app.dock.hide();
      }
      electron.app.on("browser-window-created", (_, window) => {
        utils.optimizer.watchWindowShortcuts(window);
      });
      electron.app.on("activate", function() {
        const windows = BrowserWindowManager.getBrowserWindows();
        if (windows.size > 0) {
          for (const [_, window] of windows) {
            if (window) {
              window.show();
            }
          }
        } else {
          ApplicationRegister.getMainWindowMethod().createMainWindow();
          const mainWindow = ApplicationRegister.getMainWindowMethod().getMainWindow();
          if (mainWindow) {
            mainWindow.show();
          }
        }
      });
      electron.app.on("window-all-closed", () => {
        if (process.platform === "darwin") {
          electron.app.hide();
        } else {
          const windows = BrowserWindowManager.getBrowserWindows();
          for (const [_, window] of windows) {
            if (window) {
              window.hide();
            }
          }
        }
      });
      electron.app.on("before-quit", () => {
        if (ApplicationRegister.tray) {
          ApplicationRegister.tray.destroy();
          ApplicationRegister.tray = null;
        }
        BrowserWindowManager.destroyAllWindows();
      });
    },
    /**
     * 注册应用IPC通信事件
     */
    registerIPCEvent() {
      MainIPCService.registerAllEvents();
    },
    /**
     * 注册托盘事件
     */
    registerTray() {
      if (!ApplicationRegister.tray) {
        ApplicationRegister.tray = new electron.Tray(icon);
        const contextMenu = electron.Menu.buildFromTemplate([
          {
            label: "显示主窗口",
            click: () => {
              const mainWindow = ApplicationRegister.getMainWindowMethod().getMainWindow();
              if (mainWindow) {
                mainWindow.show();
              }
            }
          },
          {
            label: "退出",
            click: () => {
              electron.app.quit();
            }
          }
        ]);
        ApplicationRegister.tray.setToolTip("SClip");
        ApplicationRegister.tray.setContextMenu(contextMenu);
        ApplicationRegister.tray.on("click", () => {
          const mainWindow = ApplicationRegister.getMainWindowMethod().getMainWindow();
          if (mainWindow) {
            mainWindow.show();
          }
        });
      }
    },
    /**
     * 注册应用菜单
     */
    registerAppMenu() {
      const template = [
        {
          label: "设置",
          submenu: [
            { label: "关于SClip", id: "about-sclip", click: () => {
            } },
            { type: "separator" },
            { label: "主题设置", id: "theme-setting", click: () => {
            } },
            { type: "separator" },
            { label: "趣味数据", id: "funny-data", click: () => {
            } },
            { type: "separator" },
            { label: "操作日志", id: "operation-log", click: () => {
            } },
            { type: "separator" },
            { label: "快捷键设置", id: "shortcut-setting", click: () => {
            } },
            { type: "separator" },
            { label: "软件设置", id: "software-setting", click: () => {
            } },
            { type: "separator" }
          ]
        },
        {
          label: "窗口",
          submenu: [
            { role: "minimize", label: "最小化", id: "minimize", click: () => {
            } },
            { role: "reload", label: "刷新", id: "reload", click: () => {
            } },
            { role: "quit", label: "退出", id: "quit", click: () => {
            } }
          ]
        }
      ];
      if (utils.is.dev) {
        template[1].submenu.unshift({
          role: "toggleDevTools",
          label: "开发者工具",
          id: "toggle-dev-tools"
        });
      }
      const menu = electron.Menu.buildFromTemplate(template);
      electron.Menu.setApplicationMenu(menu);
    },
    /**
     * 注册电源监控事件
     */
    registerPowerMonitorEvent() {
      electron.powerMonitor.on("resume", () => {
        Logger.info("PowerMonitor", "系统恢复，恢复监听剪贴板");
        ClipboardManager.getInstance().startListening();
      });
      electron.powerMonitor.on("suspend", () => {
        Logger.info("PowerMonitor", "系统挂起，停止监听剪贴板");
        ClipboardManager.getInstance().stopListening();
      });
      electron.powerMonitor.on("lock-screen", () => {
        Logger.info("PowerMonitor", "屏幕锁定，停止监听剪贴板");
        ClipboardManager.getInstance().stopListening();
      });
      electron.powerMonitor.on("unlock-screen", () => {
        Logger.info("PowerMonitor", "屏幕解锁，恢复监听剪贴板");
        ClipboardManager.getInstance().startListening();
      });
    },
    /**
     * 监听系统主题变化事件
     *
     * @description 该方法实现了对系统主题变化的监听和处理
     *
     * 实现逻辑：
     * 1. 初始化一个变量 isDarkMode 存储当前系统主题状态
     * 2. 监听 nativeTheme 的 'updated' 事件
     * 3. 当事件触发时，检查系统主题是否发生变化
     * 4. 如果主题发生变化，更新 isDarkMode 变量
     * 5. 使用IPC服务发送消息到所有渲染进程
     */
    registerNativeThemeEvent() {
      let isDarkMode = electron.nativeTheme.shouldUseDarkColors;
      electron.nativeTheme.on("updated", () => {
        if (isDarkMode !== electron.nativeTheme.shouldUseDarkColors) {
          isDarkMode = !isDarkMode;
          MainIPCService.sendToRenderer.sendNativeThemeUpdated(isDarkMode);
        }
      });
    }
  };
  /**
   * 获取主窗口相关方法
   * @returns MainWindowMethod 主窗口方法对象
   */
  static getMainWindowMethod() {
    return {
      /**
       * 注册主窗口事件
       */
      init() {
        this.createMainWindow();
        this.registerEvent();
        this.startClipboardListening();
        this.startGlobalShortcut();
      },
      /**
       * 创建主窗口
       */
      createMainWindow() {
        BrowserWindowManager.createBrowserWindow({
          key: "main",
          browserWindow: ApplicationRegister.mainWindowParams
        });
      },
      /**
       * 获取主窗口
       */
      getMainWindow() {
        return BrowserWindowManager.getBrowserWindow("main");
      },
      /**
       * 注册主窗口事件
       */
      registerEvent() {
        const mainWindow = this.getMainWindow();
        const setting = ConfigManager.getInstance().getSetting();
        const clipboardHistory = DBManager.getInstance().getClipboardHistory(
          setting.appBehavior.historyLimit
        );
        if (mainWindow) {
          mainWindow.on("ready-to-show", () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.maximizable = false;
              mainWindow.resizable = false;
              mainWindow.setAlwaysOnTop(setting.appBehavior.isFixedWindow, "floating");
              MainIPCService.sendToRenderer.setClipboardToRenderer(clipboardHistory);
              MainIPCService.sendToRenderer.setSettingWindow(setting, "main");
              MainIPCService.sendToRenderer.setWindowId("main", "main");
              if (utils.is.dev) {
                mainWindow.webContents.openDevTools({ mode: "detach" });
              }
              electron.screen.on("display-metrics-changed", (event, display, changedMetrics) => {
                if (changedMetrics.includes("scaleFactor")) {
                  const { width, height } = ApplicationRegister.getScaledWindowSize(300, 450);
                  mainWindow.setSize(width, height);
                  mainWindow.center();
                }
              });
            }
          });
          mainWindow.on("close", (event) => {
            event.preventDefault();
            mainWindow.hide();
          });
          mainWindow.on("blur", () => {
            if (!mainWindow.isAlwaysOnTop()) {
              mainWindow.hide();
            }
          });
          mainWindow.on("show", () => {
            MainIPCService.sendToRenderer.sendShowMainWindow();
          });
          mainWindow.webContents.setWindowOpenHandler((details) => {
            electron.shell.openExternal(details.url);
            return { action: "deny" };
          });
          if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
            mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
          } else {
            mainWindow.loadFile(path.join(__dirname, "../../renderer/index.html"));
          }
        } else {
          console.error("主窗口未创建");
        }
      },
      /**
       * 启动剪贴板监听
       */
      startClipboardListening() {
        ClipboardManager.getInstance().startListening();
      },
      /**
       * 注册全局显示窗口快捷键
       * @description 根据系统类型注册不同的快捷键
       * 1. 如果系统是mac，则注册mac的快捷键
       * 2. 如果系统是windows，则注册windows的快捷键
       * 3. 如果系统是linux，则注册window的快捷键
       * 4. 如果系统是windows，并且设置了覆盖window系统快捷键，则注册window系统的默认快捷键
       */
      startGlobalShortcut() {
        let keyMap = "";
        const setting = ConfigManager.getInstance().getSetting();
        if (setting.system.isMac) {
          keyMap = setting.shortcut.appVisibleShortcut.mac;
        } else {
          keyMap = setting.shortcut.appVisibleShortcut.windows;
        }
        GlobalShortcut.registerShortcut(keyMap, () => {
          const window = BrowserWindowManager.getBrowserWindow("main");
          if (window) {
            if (window.isVisible()) {
              window.hide();
            } else {
              const point = electron.screen.getCursorScreenPoint();
              window.setPosition(point.x, point.y + 20);
              window.show();
            }
          }
        });
      }
    };
  }
  /**
   * 获取设置窗口相关方法
   * @returns SettingWindowMethod 设置窗口方法对象
   */
  static getSettingWindowMethod() {
    return {
      /**
       * 初始化设置窗口
       */
      init() {
        const existingWindow = this.getSettingWindow();
        if (existingWindow) {
          existingWindow.show();
          existingWindow.focus();
        } else {
          this.createSettingWindow();
        }
      },
      /**
       * 创建设置窗口
       */
      createSettingWindow() {
        BrowserWindowManager.createBrowserWindow({
          key: "setting",
          browserWindow: ApplicationRegister.settingWindowParams
        });
        const settingWindow = this.getSettingWindow();
        const setting = ConfigManager.getInstance().getSetting();
        if (settingWindow) {
          settingWindow.on("ready-to-show", () => {
            settingWindow.show();
            MainIPCService.sendToRenderer.setWindowId("setting", "setting");
            MainIPCService.sendToRenderer.setSettingWindow(setting, "setting");
            if (utils.is.dev) {
              settingWindow.webContents.openDevTools();
            }
          });
          if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
            settingWindow.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}/#/setting`);
          } else {
            settingWindow.loadFile(path.join(__dirname, "../../renderer/index.html"), {
              hash: "/setting"
            });
          }
        }
      },
      /**
       * 注册设置窗口事件
       * 当需要为设置窗口添加特定事件时实现此方法
       */
      registerEvent() {
      },
      /**
       * 获取设置窗口
       */
      getSettingWindow() {
        return BrowserWindowManager.getBrowserWindow("setting");
      }
    };
  }
  /**
   * 获取基于屏幕分辨率的窗口尺寸
   */
  static getScaledWindowSize(baseWidth, baseHeight) {
    const primaryDisplay = electron.screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
    const scaleFactor = primaryDisplay.scaleFactor;
    const baseScreenWidth = 1920;
    const baseScreenHeight = 1080;
    const scale = Math.min(
      screenWidth / scaleFactor / baseScreenWidth,
      screenHeight / scaleFactor / baseScreenHeight
    );
    const finalScale = Math.max(0.9, Math.min(1.4, scale));
    return {
      width: Math.round(baseWidth * finalScale),
      height: Math.round(baseHeight * finalScale)
    };
  }
}
electron.app.whenReady().then(() => {
  ApplicationRegister.appRegister.init();
  ApplicationRegister.getMainWindowMethod().init();
});
