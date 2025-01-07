import { BrowserWindow } from "electron";
import { Logger } from "./logger";

const sendRenderer = {
    /**
     * 发送剪贴板数据
     * @param data 剪贴板数据
     */
    setClipboard: (data: ClipboardState[]) => {
        Logger.info('SendRenderer', '发送剪贴板数据', data)
        BrowserWindow.getAllWindows()[0].webContents.send('set-clipboard', data);
    },

    /**
     * 发送设置数据
     * @param data 设置数据
     */
    setSetting: (data: Setting) => {
        Logger.info('SendRenderer', '发送设置数据', data)
        BrowserWindow.getAllWindows()[0].webContents.send('set-setting', data);
    }
}

export default sendRenderer