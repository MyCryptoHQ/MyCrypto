import { AppState } from '@store';
import { DataStore, LocalStorage, LSKeys } from '@types';
import { toArray as objToArray } from '@utils';
import { dissoc } from '@vendor';

export function marshallPersistenceToState(ls: LocalStorage) {
  const purged = dissoc('_persist', ls);
  return (purged as unknown) as AppState;
}

export function marshallStateToDataStore(s: AppState): DataStore {
  return {
    [LSKeys.ACCOUNTS]: objToArray(s[LSKeys.ACCOUNTS]),
    [LSKeys.ADDRESS_BOOK]: objToArray(s[LSKeys.ADDRESS_BOOK]),
    [LSKeys.ASSETS]: objToArray(s[LSKeys.ASSETS]),
    [LSKeys.CONTRACTS]: objToArray(s[LSKeys.CONTRACTS]),
    [LSKeys.NETWORKS]: objToArray(s[LSKeys.NETWORKS]),
    [LSKeys.NOTIFICATIONS]: objToArray(s[LSKeys.NOTIFICATIONS]),
    [LSKeys.SETTINGS]: s[LSKeys.SETTINGS],
    [LSKeys.PASSWORD]: s[LSKeys.PASSWORD]!,
    [LSKeys.USER_ACTIONS]: objToArray(s[LSKeys.USER_ACTIONS])
  };
}
