
import { Logger } from "./logger.service";
import { BrowserWindowManager } from "../window/window.manager";

const sendRenderer = {
    /**
     * 发送剪贴板数据
     * @param data 剪贴板数据
     */
    setClipboardToRenderer: (data: ClipboardState[]) => {
        try {
            Logger.info('SendRenderer', '发送剪贴板数据', data)
            const mainWindow = BrowserWindowManager.getBrowserWindow("main")
            if (mainWindow) {
                mainWindow.webContents.send('set-clipboard-to-render', data);
            }
        } catch (error) {
            Logger.error('SendRenderer', '发送剪贴板数据失败', error)
        }
    },

    /**
     * 发送设置数据
     * @param data 设置数据
     */
    setSettingToRender: (data: Setting) => {
        try {
            Logger.info('SendRenderer', '发送设置数据', data)
            const mainWindow = BrowserWindowManager.getBrowserWindow("main")
            if (mainWindow) {
                mainWindow.webContents.send('set-setting', data);
            }
        } catch (error) {
            Logger.error('SendRenderer', '发送设置数据失败', error)
        }
    }
}

export default sendRenderer