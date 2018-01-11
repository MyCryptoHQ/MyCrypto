const Electron = require('electron');
const { app, BrowserWindow } = Electron;
const isDevelopment = process.env.NODE_ENV !== 'production';
const TITLE = 'MyEtherWallet';

// Global reference to mainWindow
// Necessary to prevent window from being garbage collected
let mainWindow;

function createMainWindow() {
  // Construct new BrowserWindow
  const window = new BrowserWindow({
    titleText: TITLE,
    backgroundColor: '#fbfbfb',
    width: 1220,
    height: 800,
    minWidth: 320,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: false
    }
  });

  const url = isDevelopment
    ? `http://localhost:${process.env.HTTPS ? 3443 : 3000}`
    : `file://${__dirname}/index.html`;
  window.loadURL(url);

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  if (isDevelopment) {
    window.webContents.on('did-fail-load', () => {
      setTimeout(() => {
        window.webContents.reload()
      }, 200);
    });
  }

  return window;
}

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open
  // until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it is common to re-create a window
  // even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});
