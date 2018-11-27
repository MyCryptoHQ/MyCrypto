const attemptStorageInteraction = (fn: () => any) => {
  try {
    return fn();
  } catch {
    throw new Error(`LocalStorage is not available on window.`);
  }
};

// tslint:disable-next-line
const noop = () => {};

export const storageGet = (key: string): any =>
  attemptStorageInteraction(() => {
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

export const storageSet = (key: string, value: any) =>
  attemptStorageInteraction(() => {
    return window.localStorage.setItem(key, JSON.stringify(value));
  });

export const storageListen = (
  key: string,
  setCallback: () => void,
  clearCallback: () => void = noop
) =>
  attemptStorageInteraction(() => {
    return window.addEventListener('storage', e => {
      const { key: eventKey, isTrusted, newValue } = e;

      if (key === eventKey && isTrusted) {
        newValue ? setCallback() : clearCallback();
      }
    });
  });
