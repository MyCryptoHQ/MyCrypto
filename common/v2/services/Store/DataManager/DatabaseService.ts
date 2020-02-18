import { noOp } from 'v2/utils';
import { isClient } from 'v2/vendor';

export const DatabaseService = <T>(
  key: string,
  initialValue?: T,
  defaultValues?: T,
  raw?: boolean
) => {
  if (!isClient) {
    return {
      db: initialValue,
      updateDb: noOp,
      resetDb: noOp,
      defaultValues
    };
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

  const setDb = (db: T | undefined) => {
    try {
      const serializedState = raw ? String(db) : JSON.stringify(db);
      localStorage.setItem(key, serializedState);
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. Also JSON.stringify can throw.
    }
  };

  // Provide a method for the caller to reset the db.
  const resetDb = (newDb = defaultValues) => setDb(newDb);

  return {
    db: getDb(),
    updateDb: (data: T) => {
      const newDb: T = {
        ...data,
        mtime: Date.now()
      };
      setDb(newDb);
    },
    resetDb,
    defaultValues
  };
};
