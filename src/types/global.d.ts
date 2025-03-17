// 全局类型声明
declare global {
  // 剪贴板内容类型
  type ClipboardType = 'text' | 'html' | 'image' | 'file' | 'url' | 'rtf'

  /**
   * 系统主题
   */
  type ThemeMode = 'light' | 'dark' | 'system'

  /**
   * 剪贴板状态对象类型
   */
  interface ClipboardState {
    id: number // 剪贴板id
    type: ClipboardType // 剪贴板格式
    contentHash?: string // 内容哈希，用于文本类型和普通的图片，取值为文件md5(content)，用于判断是否重复
    timestamp: number // 时间戳
    content: string // 内容 真正传输到渲染进程展示的内容
    last_file_name_text: string // 上一次的文件名，用于判断是否重复
    isSticky: string // 是否固定
    meta: any
    clipboardTypes: string[] // 所有拥有的类型
  }

  /**
   * 设置对象类型
   */
  interface Setting {
    /**
     * 系统主题
     */
    applicationTheme: ThemeMode

    /**
     * 剪贴板卡片样式
     */
    clipboard: {
      /**
       * rtf 文本缩放
       */
      rtfTextZoom: number

      /**
       * rtf 文本内容
       */
      rtfRenderType: 'rtf' | 'html' | 'text'

      /**
       * 是否启用文本样式，如果不启用，则默认展示纯文本
       */
      enableTextStyle: boolean

      /**
       * 文本样式缩放
       */
      textStyleZoom: number
    }

    /**
     *
     * 应用语言
     */
    appLanguage: 'zh-CN' | 'en-US'

    /**
     * 快捷键
     */
    shortcut: {
      /**
       * 应用显示
       */
      appVisibleShortcut: {
        mac: string
        windows: string
        windowsDefaultShortcuts: string
        windowSystemDefaultShortcuts: string
        macDefaultShortcuts: string
      }
    }

    /**
     * 系统信息
     */
    system: {
      /**
       * 平台
       */
      platform: string

      /**
       * 是否是mac
       */
      isMac: boolean

      /**
       * 是否是windows
       */
      isWindows: boolean

      /**
       * 是否是linux
       */
      isLinux: boolean

      /**
       * 应用名称
       */
      appName: string

      /**
       * 应用版本
       */
      version: string
    }

    /**
     * 图片显示设置
     */
    imageSettings: {
      /**
       * 图片显示模式
       */
      displayMode: 'auto' | 'contain' | 'cover'

      /**
       * 是否启用图片微动画
       */
      enableAnimation: boolean
    }

    /**
     * 应用操作逻辑设置
     */
    appBehavior: {
      /**
       * 每次打开默认回到第一页
       */
      jumpToFirstPage: boolean

      /**
       * 应用启动时加载的历史记录条数
       */
      historyLimit: number

      /**
       * 是否固定窗口
       */
      isFixedWindow: boolean

      /**
       * 是否显示复制内容的类型标识
       */
      showTypeIndicator: boolean

      /**
       * 是否显示复制内容超长提示
       */
      showLongContentTip: boolean
    }
  }
}

export {}
