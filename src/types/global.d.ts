declare global {
    // 剪贴板内容类型
    type ClipboardType = 'text' | 'html' | 'image' | 'file' | 'url'



    // 剪贴板选项接口
    interface ClipboardOptions {
        type: ClipboardType
        content: any
        time: number
    }
}

// 确保文件被视为模块
export { }