import { clipboard } from 'electron'
import { BrowserWindow } from 'electron'
import { SETTING } from '../config/setting'

// /**
//  * 监听剪贴板
//  * @param {BrowserWindow} mainWindow 主窗口
//  */
function loopReadClipboard(mainWindow: BrowserWindow) {
    let lastCopy = ""
    setInterval(() => {
        console.log("正在监听剪贴板：");
        console.log("剪贴板支持的格式：", clipboard.availableFormats());
        const { hasText, hasHtml, hasImage, hasFile } = checkClipboardContent()
        console.log(`文本: ${hasText}, HTML: ${hasHtml}, 图片: ${hasImage}, 文件: ${hasFile}`);


        // let currentContent: any = null;
        // let type = '';
        // let meta = {};

        // function getClipboard() {
        //     {
        //         // 获取剪贴板中的文件路径
        //         const hasFileFormat = clipboard.has('public.image') // Mac 特定格式
        //             || clipboard.has('FileNameW') // Windows 格式

        //         if (hasFileFormat) {
        //             console.log("有文件");

        //             // 如果是文件，直接尝试读取图片内容
        //             const image = clipboard.readImage()
        //             if (!image.isEmpty()) {
        //                 currentContent = image.toDataURL()
        //                 type = 'image'
        //                 meta = {
        //                     origin: 'local-file'
        //                 }
        //             }

        //         }
        //     }

        //     {
        //         // 获取剪贴板中的文本
        //         const text = clipboard.readText()
        //         console.log(text)
        //         if (text.length === 0) {
        //             // 没有文本，检查是否为图片
        //             const image = clipboard.readImage()
        //             if (!image.isEmpty()) {
        //                 currentContent = image.toDataURL();
        //                 type = 'image';
        //             }
        //         } else {
        //             // 有文本，根据设置判断是普通文本还是 HTML
        //             if (SETTING.isShowHtmlClipboard) {
        //                 const html = clipboard.readHTML()
        //                 currentContent = html;
        //                 type = 'html';

        //             } else {
        //                 currentContent = text;
        //                 type = 'text';
        //             }
        //         }
        //     }


        // }

        // getClipboard()

        // // 内容变化时发送
        // if (currentContent && currentContent !== lastCopy) {
        //     lastCopy = currentContent;
        //     mainWindow.webContents.send('get-clipboard', {
        //         content: currentContent,
        //         time: new Date().getTime(),
        //         type: type,
        //         meta: meta
        //     });
        // }
    }, 1000);
}

function checkClipboardContent() {
    // 检查文本
    const hasText = clipboard.has('text/plain')
        || clipboard.has('public.utf8-plain-text')
        || clipboard.has('CF_UNICODETEXT')

    // 检查HTML
    const hasHtml = clipboard.has('text/html')
        || clipboard.has('public.html')
        || clipboard.has('HTML Format')

    // 检查图片
    const hasImage = clipboard.has('image/png')
        || clipboard.has('public.image')
        || clipboard.has('CF_DIB')

    // 检查文件
    const hasFile = clipboard.has('text/uri-list')
        || clipboard.has('public.file-url')
        || clipboard.has('FileNameW')

    return { hasText, hasHtml, hasImage, hasFile }
}

export { loopReadClipboard }