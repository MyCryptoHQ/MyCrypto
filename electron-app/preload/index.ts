// import { registerProtocol } from 'shared/enclave/preload';
// registerProtocol();
const { remote, ipcRenderer } = require('electron');
(window as any).ipcRenderer = ipcRenderer;
(window as any).currentWindow = remote.getCurrentWindow();
