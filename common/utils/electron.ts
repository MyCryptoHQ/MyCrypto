// Handles integrations with Electron. Wherever possible, should stub out
// behavior with noop's if not in the Electron environment, to simplify code.
const win = window as any;

type ElectronCallback = (data?: any) => void;

export function electronListen(event: string, cb: ElectronCallback) {
  if (win.electronListen) {
    // @ts-ignore unused ev
    win.electronListen(event, (ev, data) => cb(data));
  }
}

export function electronSend(event: string, data?: any) {
  if (win.electronSend) {
    win.electronSend(event, data);
  }
}
