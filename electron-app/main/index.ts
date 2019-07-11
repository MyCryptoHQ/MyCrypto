import 'idempotent-babel-polyfill';
import { app, ipcMain, BrowserWindow } from 'electron';
import { registerServer } from 'shared/enclave/server';
import getWindow from './window';

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
  getWindow();
});

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
  getWindow();

  ipcMain.on('shapeshift-authorize', (_: any, url: string) => {
    const window = new BrowserWindow({
      backgroundColor: '#fbfbfb',
      width: 1220,
      height: process.platform === 'darwin' ? 680 : 720,
      minWidth: 480,
      minHeight: 400,
      titleBarStyle: 'hidden',
      webPreferences: {
        devTools: true,
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    window.loadURL(url);
  });

  ipcMain.on('shapeshift-token-retrieved', (_: any, token: string) =>
    getWindow().webContents.send('shapeshift-set-token', token)
  );
});

// Register enclave protocol
registerServer(app);
