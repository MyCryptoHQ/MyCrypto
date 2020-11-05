import { useContext } from 'react';

import { LanguageCode } from '@config';
import { deMarshallState } from '@services/Store/DataManager/utils';
import {
  addExludedAsset,
  addFavoriteAccount,
  addFavoriteAccounts,
  getState,
  importState as importStateStore,
  removeExcludedAsset,
  removeFavoriteAccount,
  setCurrency,
  setFavoriteAccounts,
  setInactivityTimer,
  setLanguage,
  setNode,
  updateRates,
  useDispatch,
  useSelector
} from '@store';
import { IRates, TFiatTicker, TUuid } from '@types';
import { isEmpty, pipe, symmetricDifference } from '@vendor';

import { DataContext } from '../DataManager';

export const isValidImport = (importedCache: string, localStorage: string) => {
  try {
    const parsedImport = JSON.parse(importedCache);
    const parsedLocalStorage = JSON.parse(localStorage);

    // @todo: Do migration instead of failing
    if (parsedImport.version !== parsedLocalStorage.version) {
      throw new Error(
        `Outdated version detected. Cannot import ${parsedImport.version} into ${parsedLocalStorage.version}`
      );
    }

    const oldKeys = Object.keys(parsedImport);
    const newKeys = Object.keys(parsedLocalStorage);
    const diff = symmetricDifference(oldKeys, newKeys);
    return isEmpty(diff);
  } catch (error) {
    return false;
  }
};

function useSettings() {
  const { settings } = useContext(DataContext);
  const dispatch = useDispatch();

  // @todo: work-around for export state.
  const state = useSelector(getState);
  const exportState = () => pipe(deMarshallState, JSON.stringify)(state);

  const importState = (toImport: string): boolean => {
    if (!isValidImport(toImport, exportState())) return false;
    dispatch(importStateStore(toImport));
    return true;
  };

  return {
    settings,
    importState,
    exportState,
    language: settings.language,
    addExcludedAsset: (a: TUuid) => dispatch(addExludedAsset(a)),
    removeExcludedAsset: (a: TUuid) => dispatch(removeExcludedAsset(a)),
    addFavoriteAccount: (u: TUuid) => dispatch(addFavoriteAccount(u)),
    addFavoriteAccounts: (u: TUuid[]) => dispatch(addFavoriteAccounts(u)),
    removeFavoriteAccount: (u: TUuid) => dispatch(removeFavoriteAccount(u)),
    setFavoriteAccounts: (a: TUuid[]) => dispatch(setFavoriteAccounts(a)),
    setLanguage: (l: LanguageCode) => dispatch(setLanguage(l)),
    setCurrency: (c: TFiatTicker) => dispatch(setCurrency(c)),
    setNode: (n: string) => dispatch(setNode(n)),
    updateRates: (r: IRates) => dispatch(updateRates(r)),
    setInactivityTimer: (t: number) => dispatch(setInactivityTimer(t))
  };
}

export default useSettings;
