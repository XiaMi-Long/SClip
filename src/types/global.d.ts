// 全局类型声明
declare global {

    // 剪贴板内容类型
    type ClipboardType = 'text' | 'html' | 'image' | 'file' | 'url'


    interface ClipboardState {
        type: ClipboardType          // 剪贴板格式
        contentHash?: string     // 内容哈希
        timestamp: number        // 时间戳
        content: string         // 内容 真正传输到渲染进程展示的内容
        text: string            // 文本 目前只用于本地文件的判断和使用，其他两类不涉及
        meta: any
        time: number
    }

    interface Setting {
        /**
         * 是否显示HTML剪贴板
         */
        isShowHtmlClipboard: boolean;
        /**
         * 是否启用全局快捷键
         */
        isGlobalShortcut: boolean;
        /**
         * 是否启用剪贴板卡片滑动
         */
        isSwipeClipboardCard: boolean;
        /**
         * 每页显示的剪贴板卡片数量
         */
        swiperShowCount: number;
    }
}

export { }