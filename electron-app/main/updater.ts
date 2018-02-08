import { app, dialog, BrowserWindow } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import { APP_TITLE, REPOSITORY } from '../constants';
import TEST_RELEASE from './testrelease.json';
autoUpdater.autoDownload = false;

// Set to 'true' if you want to test update behavior. Requires a recompile.
const shouldMockUpdate = false && process.env.NODE_ENV !== 'production';
const shouldMockUpdateError = false && process.env.NODE_ENV !== 'production';
let hasRunUpdater = false;
let hasStartedUpdating = false;

enum AutoUpdaterEvents {
  CHECKING_FOR_UPDATE = 'checking-for-update',
  UPDATE_AVAILABLE = 'update-available',
  DOWNLOAD_PROGRESS = 'download-progress',
  UPDATE_DOWNLOADED = 'update-downloaded',
  ERROR = 'error'
}

export default function(mainWindow: BrowserWindow) {
  if (hasRunUpdater) {
    return;
  }
  hasRunUpdater = true;

  autoUpdater.on(AutoUpdaterEvents.UPDATE_AVAILABLE, (info: UpdateInfo) => {
    dialog.showMessageBox(
      {
        type: 'question',
        buttons: ['Yes, start downloading', 'Maybe later'],
        title: `An Update is Available (v${info.version})`,
        message: `An Update is Available (v${info.version})`,
        detail:
          'A new version has been released. Would you like to start downloading the update? You will be notified when the download is finished.'
      },
      response => {
        if (response === 0) {
          if (shouldMockUpdate) {
            mockDownload();
          } else {
            autoUpdater.downloadUpdate();
          }
        }
      }
    );
    hasStartedUpdating = true;
  });

  autoUpdater.on(AutoUpdaterEvents.DOWNLOAD_PROGRESS, progress => {
    mainWindow.setTitle(`${APP_TITLE} (Downloading update... ${Math.round(progress.percent)}%)`);
    mainWindow.setProgressBar(progress.percent / 100);
  });

  autoUpdater.on(AutoUpdaterEvents.UPDATE_DOWNLOADED, () => {
    resetWindowFromUpdates(mainWindow);
    dialog.showMessageBox(
      {
        type: 'question',
        buttons: ['Yes, restart now', 'Maybe later'],
        title: 'Update Has Been Downloaded',
        message: 'Download complete!',
        detail: `The new version of ${APP_TITLE} has finished downloading. Would you like to restart to complete the installation?`
      },
      response => {
        if (response === 0) {
          if (shouldMockUpdate) {
            app.quit();
          } else {
            autoUpdater.quitAndInstall();
          }
        }
      }
    );
  });

  autoUpdater.on(AutoUpdaterEvents.ERROR, (err: Error) => {
    console.error('Update failed with an error');
    console.error(err);

    // If they haven't started updating yet, just fail silently
    if (!hasStartedUpdating) {
      return;
    }

    resetWindowFromUpdates(mainWindow);
    dialog.showErrorBox(
      'Downloading Update has Failed',
      `The update could not be downloaded. Restart the app and try again later, or manually install the new update at ${REPOSITORY}/releases\n\n(${
        err.name
      }: ${err.message})`
    );
  });

  // Kick off the check
  autoUpdater.checkForUpdatesAndNotify();

  // Simulate a test release
  if (shouldMockUpdate) {
    mockUpdateCheck();
  }
}

function resetWindowFromUpdates(window: BrowserWindow) {
  window.setTitle('MyCrypto');
  window.setProgressBar(-1); // Clears progress bar
}

// Mock functions for dev testing
function mockUpdateCheck() {
  autoUpdater.emit(AutoUpdaterEvents.CHECKING_FOR_UPDATE);

  setTimeout(() => {
    autoUpdater.emit(AutoUpdaterEvents.UPDATE_AVAILABLE, TEST_RELEASE);
  }, 3000);
}

function mockDownload() {
  for (let i = 0; i < 11; i++) {
    setTimeout(() => {
      if (i >= 5 && shouldMockUpdateError) {
        if (i === 5) {
          autoUpdater.emit(
            AutoUpdaterEvents.ERROR,
            new Error('Test error, nothing actually failed')
          );
        }
        return;
      }

      const total = 150000000;
      autoUpdater.emit(AutoUpdaterEvents.DOWNLOAD_PROGRESS, {
        bytesPerSecond: Math.round(Math.random() * 100000000),
        percent: i * 10,
        transferred: total / i,
        total
      });

      if (i === 10) {
        autoUpdater.emit(AutoUpdaterEvents.UPDATE_DOWNLOADED);
      }
    }, 500 * i);
  }
}
