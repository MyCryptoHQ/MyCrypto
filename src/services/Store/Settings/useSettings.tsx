import { useContext } from 'react';

import { LanguageCode } from '@config';
import {
  addExludedAsset,
  addFavoriteAccount,
  addFavoriteAccounts,
  exportState,
  removeExcludedAsset,
  removeFavoriteAccount,
  setCurrency,
  setFavoriteAccounts,
  setInactivityTimer,
  setLanguage,
  setNode,
  setPassword,
  updateRates,
  useDispatch
} from '@store';
import { IRates, TFiatTicker, TUuid } from '@types';

import { DataContext } from '../DataManager';

function useSettings() {
  const { settings } = useContext(DataContext);
  const dispatch = useDispatch();

  return {
    settings,
    exportState,
    language: settings.language,
    setUnlockPassword: (p: string) => dispatch(setPassword(p)),
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
