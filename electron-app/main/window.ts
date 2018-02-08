import { BrowserWindow, Menu, shell } from 'electron';
import { URL } from 'url';
import MENU from './menu';
import updater from './updater';
import { APP_TITLE } from '../constants';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Cached reference, preventing recreations
let window;

// Construct new BrowserWindow
export default function getWindow() {
  if (window) {
    return window;
  }

  window = new BrowserWindow({
    title: APP_TITLE,
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

  const port = process.env.HTTPS ? '3443' : '3000';
  const appUrl = isDevelopment ? `http://localhost:${port}` : `file://${__dirname}/index.html`;
  window.loadURL(appUrl);

  window.on('closed', () => {
    window = null;
  });

  window.webContents.on('new-window', (ev, urlStr) => {
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
