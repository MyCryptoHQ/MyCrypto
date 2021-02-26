import { useDispatch } from 'react-redux';

export { default as createStore } from './store';
export { importState, exportState, AppState } from './root.reducer';
export { initialLegacyState } from './legacy.initialState';
export { useDispatch };
export { createNotification, updateNotification } from './notification.slice';
export { setPassword, getPassword } from './password.slice';
export {
  createAccount,
  createAccounts,
  resetAndCreateAccount,
  resetAndCreateManyAccounts,
  destroyAccount,
  updateAccount,
  updateAccounts,
  getAccounts,
  addAccounts
} from './account.slice';
export {
  createContact,
  destroyContact,
  updateContact,
  createOrUpdateContact
} from './contact.slice';
export {
  createUserAction,
  destroyUserAction,
  updateUserAction,
  updateUserActionStateByName,
  selectUserActions
} from './userAction.slice';
export { createContract, destroyContract, selectContracts } from './contract.slice';
export {
  createNetworks,
  createNetwork,
  destroyNetwork,
  updateNetwork,
  updateNetworks,
  deleteNodeOrNetwork,
  deleteNode,
  canDeleteNode,
  getDefaultNetwork
} from './network.slice';
export {
  createAssets,
  createAsset,
  destroyAsset,
  updateAsset,
  updateAssets,
  addAssetsFromAPI,
  fetchAssets,
  getAssets,
  getBaseAssetByNetwork
} from './asset.slice';
export {
  fetchMemberships,
  setMemberships,
  setMembership,
  deleteMembership,
  fetchError,
  isMyCryptoMember,
  getMembershipState
} from './membership.slice';
export {
  resetFavoritesTo,
  addFavorites,
  addFavorite,
  addExcludedAsset,
  removeExcludedAsset,
  setLanguage,
  getFiat,
  setFiat,
  getInactivityTimer,
  setInactivityTimer,
  setDemoMode,
  getIsDemoMode,
  addAccountsToFavorites,
  canTrackProductAnalytics,
  setProductAnalyticsAuthorisation,
  getSettings
} from './settings.slice';
export { importSuccess, importError } from './import.slice';
export { scanTokens, isScanning } from './tokenScanning.slice';
export {
  encrypt,
  decrypt,
  setEncryptedData,
  clearEncryptedData,
  getDecryptionError,
  getEncryptedData,
  isEncrypted
} from './vault.slice';
export { getAppState, useSelector } from './selectors';
export { default as persistenceSlice } from './persistence.slice';
export { appReset, default as rootReducer } from './root.reducer';
export { getMemberships, membershipExpiryDate } from './membership.slice';
export { setRates, getRates } from './rates.slice';
export { trackAsset, getTrackedAssets } from './trackedAssets.slice';
