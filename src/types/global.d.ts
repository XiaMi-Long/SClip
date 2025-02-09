// 全局类型声明
declare global {

    // 剪贴板内容类型
    type ClipboardType = 'text' | 'html' | 'image' | 'file' | 'url'


    interface ClipboardState {
        type: ClipboardType          // 剪贴板格式
        contentHash?: string     // 内容哈希，用于文本类型和普通的图片，取值为文件md5(content)，用于判断是否重复
        timestamp: number        // 时间戳
        content: string         // 内容 真正传输到渲染进程展示的内容
        last_file_name_text: string            // 上一次的文件名，用于判断是否重复
        meta: any
    }

    interface Setting {
        /**
         * 应用主题
         */
        applicationTheme: 'light' | 'dark'
        /**
         * 剪贴板主题
         */
        clipboardTheme: 'default' | 'card'

    }
}

export { }