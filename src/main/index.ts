import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { loopReadClipboard } from './clipboard/index'
import { registerGlobalShortcut } from './command/index'
import { app, shell, BrowserWindow, ipcMain, clipboard } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// import clipboard from './clipboard/index'
// const {  } = require('electron')
console.log(clipboard.readImage(), clipboard.readImage().toPNG())
console.log(clipboard.readText())
console.log(clipboard.readRTF())
console.log(clipboard.readHTML())
console.log(clipboard.readBookmark())

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      scrollBounce: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximizable = false
    mainWindow.resizable = false
    mainWindow.setAlwaysOnTop(true, 'screen-saver')
    // 打开开发者工具
    mainWindow.webContents.openDevTools()
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


  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
