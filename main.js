const { app, BrowserWindow, ipcMain } = require('electron');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

ipcMain.on('image-file-converter', async (event, arg) => {
  const { path, quality } = arg;
  const parentPath = path.substring(0, path.lastIndexOf('/'));

  try {
    await imagemin([path], {
      destination: parentPath,
      plugins: [
        imageminWebp({ quality }) // number
      ]
    });
    event.reply('convert-result', { message: 'ok' });
  } catch (error) {
    console.log('error:', error)
    event.reply('convert-result', { error: error.message });
  }
});

function createWindow () {
  const win = new BrowserWindow({ // 브라우저 창을 생성한다.
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile('index.html') // index.html 파일을 불러온다.
}

app.whenReady().then(createWindow);