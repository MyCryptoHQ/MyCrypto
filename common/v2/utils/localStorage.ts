export const storageGet = (key: string): any => {
  if (window && window.localStorage) {
    const stored = window.localStorage.getItem(key);

    return stored ? JSON.parse(stored) : null;
  }

  throw new Error(`LocalStorage is not available on window.`);
};

export const storageSet = (key: string, value: any) => {
  if (window && window.localStorage) {
    return window.localStorage.setItem(key, JSON.stringify(value));
  }

  throw new Error(`LocalStorage is not available on window.`);
};
