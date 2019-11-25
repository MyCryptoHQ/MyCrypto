import { SCHEMA_DEFAULT } from 'v2/database';
import { useLocalStorage } from 'v2/vendor';
import { LocalStorage } from 'v2/types';
import { LOCALSTORAGE_KEY } from './constants';

const schemaVersions = [LOCALSTORAGE_KEY, LOCALSTORAGE_KEY];
const getPreviousVersion = schemaVersions[1];
const getLatestVersion = schemaVersions[0];

// Manage persistance layer first load and syncing.
export function useDatabase() {
  // Look at LS keys and find one that matches the latest in our
  // schemaVersions list.
  const [persisted] = useLocalStorage(getPreviousVersion);

  // Migrate the previous data into the new schema.
  // e.g persisted != schema ? schema + persisted : persisted.
  const dbSchema =
    !!persisted && Object.keys(persisted as object).length > 0 ? persisted : SCHEMA_DEFAULT;

  // Once we determined the valid contents we are ready to perform our first sync.
  const [db, setDb] = useLocalStorage(getLatestVersion, dbSchema as LocalStorage);

  // Provide a method for the caller to reset the db.
  const resetDb = (newDb = SCHEMA_DEFAULT) => setDb(newDb);

  return {
    db,
    setDb,
    resetDb,
    defaultSchema: SCHEMA_DEFAULT
  };
}
