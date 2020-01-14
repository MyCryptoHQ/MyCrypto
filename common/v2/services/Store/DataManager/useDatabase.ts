import { useMemo } from 'react';
import { getCurrentDBConfig, getData } from 'v2/database';
import { useLocalStorage } from 'v2/vendor';
import { LocalStorage } from 'v2/types';

// Manage persistance layer first load and syncing.
export function useDatabase() {
  const currentDB = useMemo(() => getCurrentDBConfig(), []);
  const currentDBValues = useMemo(() => getData(), []);

  // Once we determined the valid contents we are ready to perform our first sync.
  const [db, setDb] = useLocalStorage(currentDB.main, currentDBValues as LocalStorage);

  // Provide a method for the caller to reset the db.
  const resetDb = (newDb = currentDB.defaultValues) => setDb(newDb);

  return {
    db,
    updateDb: (data: Omit<LocalStorage, 'mtime'>) => {
      const newDb: LocalStorage = {
        mtime: Date.now(),
        ...data
      };
      setDb(newDb);
    },
    resetDb,
    defaultValues: currentDB.defaultValues
  };
}
