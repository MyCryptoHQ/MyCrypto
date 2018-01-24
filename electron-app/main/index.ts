import { app } from 'electron';
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
});
