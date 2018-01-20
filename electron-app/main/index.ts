import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import updater from './updater';
import MENU from './menu';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Global reference to mainWindow
// Necessary to prevent window from being garbage collected
let mainWindow;

function createMainWindow() {
  // Construct new BrowserWindow
  const window = new BrowserWindow({
    title: 'MyEtherWallet',
    backgroundColor: '#fbfbfb',
    width: 1220,
    height: 800,
    minWidth: 320,
    minHeight: 400,
    // TODO - Implement styles for custom title bar in components/ui/TitleBar.scss
    // frame: false,
    // titleBarStyle: 'hidden',
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      preload: path.resolve(__dirname, 'preload.js')
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
        if (window && window.webContents) {
          window.webContents.reload();
        }
      }, 500);
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(MENU));

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
    updater(app, mainWindow);
  }
});

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
  mainWindow.webContents.on('did-finish-load', () => {
    updater(app, mainWindow);
  });
});
