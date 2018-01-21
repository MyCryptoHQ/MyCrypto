import { App, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import EVENTS from '../../shared/electronEvents';
import TEST_RELEASE from './testrelease.json';
autoUpdater.autoDownload = false;

enum AutoUpdaterEvents {
  CHECKING_FOR_UPDATE = 'checking-for-update',
  UPDATE_NOT_AVAILABLE = 'update-not-available',
  UPDATE_AVAILABLE = 'update-available',
  DOWNLOAD_PROGRESS = 'download-progress',
  UPDATE_DOWNLOADED = 'update-downloaded',
  ERROR = 'error'
}

export default (app: App, window: BrowserWindow) => {
  // Set to 'true' if you want to test update behavior. Requires a recompile.
  const shouldMockUpdate = true && process.env.NODE_ENV !== 'production';

  // Report update status
  autoUpdater.on(AutoUpdaterEvents.CHECKING_FOR_UPDATE, () => {
    window.webContents.send(EVENTS.UPDATE.CHECKING_FOR_UPDATE);
  });

  autoUpdater.on(AutoUpdaterEvents.UPDATE_NOT_AVAILABLE, () => {
    window.webContents.send(EVENTS.UPDATE.UPDATE_NOT_AVAILABLE);
  });

  autoUpdater.on(AutoUpdaterEvents.UPDATE_AVAILABLE, info => {
    window.webContents.send(EVENTS.UPDATE.UPDATE_AVAILABLE, info);
  });

  autoUpdater.on(AutoUpdaterEvents.DOWNLOAD_PROGRESS, progress => {
    window.webContents.send(EVENTS.UPDATE.DOWNLOAD_PROGRESS, progress);
  });

  autoUpdater.on(AutoUpdaterEvents.UPDATE_DOWNLOADED, () => {
    window.webContents.send(EVENTS.UPDATE.UPDATE_DOWNLOADED);
  });

  autoUpdater.on(AutoUpdaterEvents.ERROR, (err, msg) => {
    console.error('Update failed with an error');
    console.error(err);
    window.webContents.send(EVENTS.UPDATE.ERROR, msg);
  });

  autoUpdater.checkForUpdatesAndNotify();

  // Listen for restart request
  ipcMain.on(EVENTS.UPDATE.DOWNLOAD_UPDATE, () => {
    if (shouldMockUpdate) {
      mockDownload(window);
    } else {
      autoUpdater.downloadUpdate();
    }
  });

  ipcMain.on(EVENTS.UPDATE.QUIT_AND_INSTALL, () => {
    if (shouldMockUpdate) {
      app.quit();
    } else {
      autoUpdater.quitAndInstall();
    }
  });

  // Simulate a test release
  if (shouldMockUpdate) {
    mockUpdateCheck(window);
  }
};

// Mock functions for dev testing
function mockUpdateCheck(window: BrowserWindow) {
  window.webContents.send(EVENTS.UPDATE.CHECKING_FOR_UPDATE);

  setTimeout(() => {
    window.webContents.send(EVENTS.UPDATE.UPDATE_AVAILABLE, TEST_RELEASE);
  }, 3000);
}

function mockDownload(window: BrowserWindow) {
  for (let i = 0; i < 101; i++) {
    setTimeout(() => {
      const total = 150000000;
      window.webContents.send(EVENTS.UPDATE.DOWNLOAD_PROGRESS, {
        bytesPerSecond: Math.round(Math.random() * 100000),
        percent: i,
        transferred: total / i,
        total
      });

      if (i === 100) {
        window.webContents.send(EVENTS.UPDATE.UPDATE_DOWNLOADED);
      }
    }, 50 * i);
  }
}
