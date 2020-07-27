import { BrowserWindow, Menu, shell } from 'electron';
import { URL } from 'url';
import MENU from './menu';
import popupContextMenu from './contextMenu';
import { APP_TITLE } from '../constants';

const IS_DEV: boolean =
  process.env.NODE_ENV === 'development' || !!process.env.IS_STAGING || !process.env.NODE_ENV;

// Cached reference, preventing recreations
let window: BrowserWindow | null;

// Construct new BrowserWindow
export default function getWindow() {
  if (window) {
    return window;
  }

  window = new BrowserWindow({
    title: APP_TITLE,
    backgroundColor: '#fbfbfb',
    width: 1220,
    height: process.platform === 'darwin' ? 680 : 720,
    minWidth: 480,
    minHeight: 400,
    webPreferences: {
      devTools: true,

      // For security reasons the following params should not be modified
      // https://electronjs.org/docs/tutorial/security#isolation-for-untrusted-content
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const appUrl = IS_DEV ? `http://localhost:3000` : `file://${__dirname}/index.html`;
  window.loadURL(appUrl);

  window.on('closed', () => {
    window = null;
  });

  window.webContents.on('new-window', (ev: any, urlStr: string) => {
    // Kill all new window requests by default
    ev.preventDefault();

    // Only allow HTTPS urls to actually be opened
    const url = new URL(urlStr);
    if (url.protocol === 'https:') {
      shell.openExternal(urlStr);
    } else {
      console.warn(`Blocked request to open new window '${urlStr}', only HTTPS links are allowed`);
    }
  });

  window.webContents.on('context-menu', (_, props) => {
    popupContextMenu(window!, IS_DEV, props);
  });

  window.webContents.on('devtools-opened', () => {
    window!.focus();
    setImmediate(() => {
      window!.focus();
    });
  });

  window.webContents.on('will-navigate', (event: any) => {
    event.preventDefault();
  });

  if (IS_DEV) {
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
