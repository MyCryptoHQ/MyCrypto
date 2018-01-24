import { app, BrowserWindow, Menu, shell } from 'electron';
import { URL } from 'url';
import * as path from 'path';
import MENU from './menu';
import updater from './updater';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Cached reference, preventing recreations
let window;

// Construct new BrowserWindow
export default function getWindow() {
  if (window) {
    return window;
  }

  window = new BrowserWindow({
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
      contextIsolation: true
    }
  });

  const appUrl = isDevelopment
    ? `http://localhost:${process.env.HTTPS ? 3443 : 3000}`
    : `file://${__dirname}/index.html`;
  window.loadURL(appUrl);

  window.on('closed', () => {
    window = null;
  });

  window.webContents.on('new-window', (ev, urlStr) => {
    const url = new URL(urlStr);
    if (url.protocol === 'file' || url.hostname === 'localhost') {
      return;
    }
    ev.preventDefault();
    shell.openExternal(urlStr);
  });

  window.webContents.on('did-finish-load', () => {
    updater(window);
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
