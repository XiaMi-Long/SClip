import { join } from 'path'
import sendRenderer from './utils/send_renderer'
import icon from '../../resources/icon.png?asset'
import { appOnEvent } from './utils/app_on_event'
import { loopReadClipboard } from './clipboard/index'
import { registerGlobalShortcut } from './command/index'
import { getClipboardHistory } from './utils/get_data_base'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    autoHideMenuBar: true,
    // focusable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      scrollBounce: true
    }
  })


  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show()
      mainWindow.maximizable = false
      mainWindow.resizable = false
      // mainWindow.setAlwaysOnTop(true, 'screen-saver')

      // 初始化剪贴板数据
      {
        const clipboardHistory = getClipboardHistory()
        sendRenderer.setClipboard(clipboardHistory)
      }

      // 打开开发者工具
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin') {
      event.preventDefault()
      mainWindow?.hide()
    }
  })


  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })


  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }


  // 监听剪贴板
  loopReadClipboard(mainWindow)
}


app.whenReady().then(() => {
  // 注册全局快捷键
  registerGlobalShortcut()

  electronApp.setAppUserModelId('com.electron')


  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })



  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  // 初始化监听应用事件
  appOnEvent()


  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    } else {
      mainWindow.show()
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })


  // 清理资源
  app.on('before-quit', () => {
    // 允许窗口关闭
    mainWindow?.removeAllListeners('close')
  })
})




