import { globalShortcut, BrowserWindow, screen } from 'electron'

/**
 * 注册全局快捷键
 */
function registerGlobalShortcut() {
    // 注册全局快捷键
    const shortcuts = {
        // 'Up': () => mainWindow.webContents.send('keyboard-event', 'up'),
        // 'Down': () => mainWindow.webContents.send('keyboard-event', 'down'),
        // 'Left': () => mainWindow.webContents.send('keyboard-event', 'left'),
        // 'Right': () => mainWindow.webContents.send('keyboard-event', 'right'),

        'Alt+V': (): void => {
            const window = BrowserWindow.getAllWindows()[0]
            if (window) {
                if (window.isVisible()) {
                    window.hide()
                } else {
                    // 获取鼠标位置
                    const mousePos = screen.getCursorScreenPoint()
                    // 设置窗口位置
                    window.setPosition(mousePos.x, mousePos.y)
                    window.show()

                }
            }
        }
    }

    // 注册所有快捷键
    Object.entries(shortcuts).forEach(([key, callback]) => {
        const success = globalShortcut.register(key, callback as () => void)
        if (!success) {
            console.log(`Failed to register ${key}`)
        }
    })



}

// 清理快捷键
function unregisterGlobalShortcuts() {
    globalShortcut.unregisterAll()
}

export { registerGlobalShortcut, unregisterGlobalShortcuts }