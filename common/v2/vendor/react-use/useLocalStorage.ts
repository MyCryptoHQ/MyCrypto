import { noOp } from 'v2/utils';

import { isClient } from './util';

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);

// Ref https://github.com/streamich/react-use/blob/master/src/useLocalStorage.ts
const useLocalStorage = <T>(
  key: string,
  initialValue?: T,
  raw?: boolean
): [T, Dispatch<SetStateAction<T>>] => {
  if (!isClient) {
    return [initialValue as T, noOp];
  }

  const getDb = () => {
    try {
      const localStorageValue = localStorage.getItem(key);
      if (typeof localStorageValue !== 'string') {
        localStorage.setItem(key, raw ? String(initialValue) : JSON.stringify(initialValue));
        return initialValue;
      } else {
        return raw ? localStorageValue : JSON.parse(localStorageValue || 'null');
      }
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  };

  const setDb = (db: T) => {
    try {
      const serializedState = raw ? String(db) : JSON.stringify(db);
      localStorage.setItem(key, serializedState);
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. Also JSON.stringify can throw.
    }
  };

  return [getDb(), setDb];
};

export default useLocalStorage;
