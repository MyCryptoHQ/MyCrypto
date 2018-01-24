// Selectively expose node integration, since all node integrations are
// disabled by default for security purposes.
import { ipcRenderer, shell } from 'electron';
import { ElectronBridgeFunctions } from '../shared/electronBridge';
const win = window as any;

const functions: ElectronBridgeFunctions = {
  addListener(event, cb) {
    ipcRenderer.on(event, cb);
  },
  sendEvent(event, data) {
    ipcRenderer.send(event, data);
  },
  openInBrowser(url) {
    // Only open HTTP(S) links
    if (url.indexOf('http') === 0) {
      return shell.openExternal(url);
    }
  }
};

win.electronBridge = functions;
