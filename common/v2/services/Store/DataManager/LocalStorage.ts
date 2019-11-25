import { noOp } from 'v2/utils';

const attemptStorageInteraction = (fn: () => any) => {
  try {
    return fn();
  } catch {
    throw new Error(`LocalStorage is not available on window.`);
  }
};

export class StorageService {
  public LSKEY: string;
  constructor(key: string) {
    this.LSKEY = key;
  }

  public getEntry(): any {
    return attemptStorageInteraction(() => {
      const stored = window.localStorage.getItem(this.LSKEY);
      if (!stored) return null;
      try {
        return JSON.parse(stored);
      } catch {
        return stored;
      }
    });
  }

  public setEntry(value: any) {
    return attemptStorageInteraction(() =>
      window.localStorage.setItem(this.LSKEY, JSON.stringify(value))
    );
  }

  public clearEntry() {
    return attemptStorageInteraction(() => window.localStorage.removeItem(this.LSKEY));
  }

  public listen(
    setCallback: (e: StorageEvent) => void,
    removeCallback: (e: StorageEvent) => void = noOp
  ) {
    return attemptStorageInteraction(() =>
      window.addEventListener('storage', e => {
        const { key: eventKey, isTrusted, newValue } = e;

        if (this.LSKEY === eventKey && isTrusted) {
          newValue ? setCallback(e) : removeCallback(e);
        }
      })
    );
  }
}
