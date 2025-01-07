import { powerMonitor } from 'electron'
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


}

export { appOnEvent }