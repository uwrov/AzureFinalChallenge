const { app, BrowserWindow} = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    'minWidth': 800,
    'minHeight': 600
  })

  win.loadFile('public/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})
