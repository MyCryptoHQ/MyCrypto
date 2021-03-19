import { useDispatch } from 'react-redux';

export { default as createStore } from './store';
export {
  default as rootReducer,
  appReset,
  importState,
  exportState,
  AppState
} from './root.reducer';
export { initialLegacyState } from './legacy.initialState';
export { useDispatch };
export { createNotification, updateNotification, selectNotifications } from './notification.slice';
export { selectPassword } from './password.slice';
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
  createOrUpdateContact,
  selectContacts
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
  selectDefaultNetwork,
  selectNetworks,
  selectNetwork
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
  decrypt,
  clearEncryptedData,
  getDecryptionError,
  getEncryptedData,
  isEncrypted
} from './vault.slice';
export { getAppState, useSelector } from './selectors';
export { default as persistenceSlice } from './persistence.slice';
export { getMemberships, membershipExpiryDate } from './membership.slice';
export { setRates, getRates } from './rates.slice';
export { trackAsset, getTrackedAssets } from './trackedAssets.slice';
