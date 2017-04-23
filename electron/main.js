const electron = require('electron');
const {ipcMain} = require('electron');
const path = require('path');
const _ = require('lodash');
const bootstrap = require('./bootstrap');

require('./api');

const {execById: exec, config: snippetConfig} = require('./snippet');
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

if (process.env.ENV !== 'production') {
  console.log('>>> ENABLE ELECTRON RELOAD');
  require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/../node_modules/electron`)
  });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  mainWindow = new BrowserWindow({width, height});

  // and load the index.html of the app.
  // mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.loadURL('http://localhost:10001')

  // Open the DevTools.
  mainWindow.webContents.openDevTools({mode: "undocked"})

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
snippetConfig({snippetsRepoPath: path.join(__dirname, '../tmp')});

let recentSender = null;
let snippetWindows = {};
function pluginCallWhenWebpackDone(snippetUrl){
  console.log('.... webpack done >>>>');
  if(recentSender){
    recentSender.send('snippet.run.ready', snippetUrl);
    recentSender = null;
    openWindow(snippetUrl);
  }
}

ipcMain.on('snippet.run', (event, snippetId) => {
  recentSender = event.sender;
  exec(snippetId, pluginCallWhenWebpackDone);
});

function openWindow(url){
  if(snippetWindows[url]){
    snippetWindows[url].focus();
    snippetWindows[url].reload();
    return;
  }

  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  const snippetWindow = new BrowserWindow({width, height});

  // and load the index.html of the app.
  // mainWindow.loadURL(`file://${__dirname}/index.html`)
  snippetWindow.loadURL(url)

  // Open the DevTools.
  snippetWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  snippetWindow.on('closed', function () {
    snippetWindows[url] = null;
  });
  snippetWindows[url] = snippetWindow;
}

ipcMain.on('snippet.open_window', (url) => openWindow);

bootstrap.prepareDb();

