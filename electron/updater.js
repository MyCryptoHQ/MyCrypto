'use strict';
const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');
const testRelease = require('./testrelease.json');
autoUpdater.autoDownload = false;


module.exports = function(app, window) {
  // Set to 'true' if you want to test update behavior. Requires a recompile.
  const shouldMockUpdate = true && process.env.NODE_ENV !== 'production';

  // Report update status
  autoUpdater.on('checking-for-update', () => {
    console.log('checking-for-update');
    window.webContents.send('UPDATE:checking-for-update');
  });

  autoUpdater.on('update-not-available', () => {
    console.log('update-not-available');
    window.webContents.send('UPDATE:update-not-available');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('update-available');
    window.webContents.send('UPDATE:update-available', info);
  });

  autoUpdater.on('download-progress', (progress) => {
    window.webContents.send('UPDATE:download-progress', progress);
  });

  autoUpdater.on('update-downloaded', () => {
    window.webContents.send('UPDATE:update-downloaded');
  });

  autoUpdater.on('error', (err, msg) => {
    console.error('Update failed with an error');
    console.error(err);
    window.webContents.send('UPDATE:error', msg);
  });

  autoUpdater.checkForUpdatesAndNotify();

  // Listen for restart request
  ipcMain.on('UPDATE:download-update', () => {
    if (shouldMockUpdate) {
      mockDownload(window);
    }
    else {
      autoUpdater.downloadUpdate();
    }
  });

  ipcMain.on('UPDATE:quit-and-install', () => {
    if (shouldMockUpdate) {
      app.quit();
    }
    else {
      autoUpdater.quitAndInstall();
    }
  });

  // Simulate a test release
  if (shouldMockUpdate) {
    mockUpdateCheck(window);
  }
}

// Mock functions for dev testing
function mockUpdateCheck(window) {
  window.webContents.send('UPDATE:checking-for-update');

  setTimeout(() => {
    window.webContents.send('UPDATE:update-available', testRelease)
  }, 1000);
}

function mockDownload(window) {
  for (let i = 0; i < 101; i++) {
    setTimeout(() => {
      const total = 150000000;
      window.webContents.send('UPDATE:download-progress', {
        bytesPerSecond: parseInt(Math.random() * 100000, 10),
        percent: i,
        transferred: total / i,
        total
      });

      if (i === 100) {
        window.webContents.send('UPDATE:update-downloaded');
      }
    }, 50 * i);
  }
}
