'use strict';
const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');

module.exports = function(window) {
  autoUpdater.checkForUpdatesAndNotify();
  let hasDownloaded = false;

  // Report update status
  autoUpdater.on('checking-for-update', () => {
    window.webContents.send('UPDATE:checking-for-update');
  });

  autoUpdater.on('update-not-available', () => {
    window.webContents.send('UPDATE:update-not-available');
  });

  autoUpdater.on('update-available', (info) => {
    window.webContents.send('UPDATE:update-available', info);
  });

  autoUpdater.on('download-progress', (progress) => {
    window.webContents.send('UPDATE:download-progress', progress);
  });

  autoUpdater.on('update-downloaded', () => {
    hasDownloaded = true;
    window.webContents.send('UPDATE:update-downloaded');
  });

  autoUpdater.on('error', (err) => {
    window.webContents.send('UPDATE:error', err);
  });

  // Listen for restart request
  ipcMain.on('UPDATE:quit-and-install', () => {
    if (hasDownloaded) {
      autoUpdater.quitAndInstall()
    }
    else {
      window.webContents.send('UPDATE:error', new Error('Update hasn’t been downloaded yet.'));
    }
  });
}
