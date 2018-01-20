// Selectively expose node integration, since all node integrations are
// disabled by default for security purposes.
'use strict';
import { ipcRenderer, shell } from 'electron';
const win = window as any;

win.electronListen = (event, cb) => {
  ipcRenderer.on(event, cb);
};

win.electronSend = (event, data) => {
  ipcRenderer.send(event, data);
};

win.electronOpenInBrowser = url => {
  shell.openExternal(url);
};
