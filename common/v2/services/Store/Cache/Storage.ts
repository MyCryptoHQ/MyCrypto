import { isDevelopment } from 'v2/utils';

// tslint:disable-next-line
const noop = () => {};

export class StorageServiceBase {
  public getEntry(key: string): any {
    return this.attemptStorageInteraction(() => {
      const stored = window.localStorage.getItem(key);

      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return stored;
        }
      }

      return null;
    });
  }

  public setEntry(key: string, value: any) {
    return this.attemptStorageInteraction(() =>
      window.localStorage.setItem(key, JSON.stringify(value))
    );
  }

  public listen(key: string, setCallback: () => void, removeCallback: () => void = noop) {
    return this.attemptStorageInteraction(() =>
      window.addEventListener('storage', e => {
        const { key: eventKey, isTrusted, newValue } = e;

        if (key === eventKey && isTrusted) {
          newValue ? setCallback() : removeCallback();
        }
      })
    );
  }

  private attemptStorageInteraction(fn: () => any) {
    try {
      return fn();
    } catch {
      throw new Error(`LocalStorage is not available on window.`);
    }
  }
}

let instantiated = false;

// tslint:disable-next-line
export default class StorageService extends StorageServiceBase {
  public static instance = new StorageService();

  constructor() {
    super();

    if (instantiated) {
      throw new Error(`StorageService has already been instantiated.`);
    } else {
      instantiated = true;
    }

    if (isDevelopment()) {
      (window as any).StorageService = this;
    }
  }
}
