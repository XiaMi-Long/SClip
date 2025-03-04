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
     * rtf 文本缩放
     */
    rtfTextZoom: number
    /**
     * rtf 文本内容
     */
    rtfRenderType: 'rtf' | 'html' | 'text'

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
  }
}

export {}
