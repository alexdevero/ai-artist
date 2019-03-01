const { app, BrowserWindow } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let appIcon = null
let trayIcon = null

// Request lock to allow only one instance
// of the app running at the time.
const gotTheLock = app.requestSingleInstanceLock()

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

/*
if (platform == 'darwin') {
  trayIcon = path.join(__dirname, 'assets/instagram-uploader-icon.png')
} else if (platform == 'win32') {
  trayIcon = path.join(__dirname, 'assets/instagram-uploader-icon.ico')
} else {
  trayIcon = path.join(__dirname, 'assets/instagram-uploader-icon.ico')
}
*/

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    webPreferences: {
      nodeIntegration: true
    }
    /*icon: trayIcon,
    title: 'AI Artist',
    toolbar: true,*/
  })

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// Check if this is first instance of the app running.
// If not, block it. If yes, allow it.
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()

        mainWindow.focus()
    }
  })

  // Wait until the app is ready
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.once('ready', createWindow)
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
