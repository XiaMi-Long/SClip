import { powerMonitor, ipcMain, clipboard, BrowserWindow } from 'electron'
import sendRenderer from './send_renderer'
import { getClipboardHistory } from './get_data_base'
import { Logger } from './logger'



/**
 * 监听应用事件
 */
function appOnEvent() {
    /**
     * 监听应用恢复事件
     */
    powerMonitor.on('resume', () => {
        const clipboardHistory = getClipboardHistory()
        Logger.info('Database', `恢复剪贴板记录`)
        sendRenderer.setClipboard({
            ...clipboardHistory
        });
    })

    /**
     * 监听渲染进程通信-获取剪贴板记录
     */
    ipcMain.on('paste-selected-text', (event, clipboardState: ClipboardState) => {
        Logger.info('Database', `渲染进程通信-获取剪贴板记录`)
        console.log(clipboardState);
        // const window = BrowserWindow.getAllWindows()[0]
        // if (window) {

        //     if (clipboardState.type === 'text') {
        //         // clipboard.writeText(clipboardState.text)
        //         // window.blur()

        //     }
        // }

    })

}

export { appOnEvent }