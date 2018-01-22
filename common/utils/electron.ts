// Handles integrations with Electron. Wherever possible, should stub out
// behavior with noop's if not in the Electron environment, to simplify code.
import { ElectronBridgeFunctions } from 'shared/electronBridge';
const bridge: ElectronBridgeFunctions | null = (window as any).electronBridge;

export const addListener: ElectronBridgeFunctions['addListener'] = (event, cb) => {
  if (bridge && bridge.addListener) {
    // @ts-ignore unused ev
    bridge.addListener(event, (ev, data) => cb(data));
  }
};

export const sendEvent: ElectronBridgeFunctions['sendEvent'] = (event, data) => {
  if (bridge && bridge.sendEvent) {
    bridge.sendEvent(event, data);
  }
};

export const openInBrowser: ElectronBridgeFunctions['openInBrowser'] = url => {
  if (bridge && bridge.openInBrowser) {
    bridge.openInBrowser(url);
    return true;
  }
  return false;
};
