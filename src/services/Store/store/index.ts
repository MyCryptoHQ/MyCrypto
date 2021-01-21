import { useDispatch } from 'react-redux';

export { default as createStore } from './store';
export { importState, exportState, AppState, getPassword } from './root.reducer';
export { initialLegacyState } from './legacy.initialState';
export { useSelector, default as useAppState } from './useAppState';
export { useDispatch };
export { createNotification, updateNotification } from './notification.slice';
export { setPassword } from './password.slice';
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
export { createContact, destroyContact, updateContact } from './contact.slice';
export { createUserAction, destroyUserAction, updateUserAction } from './userAction.slice';
export { createContract, destroyContract } from './contract.slice';
export {
  createNetworks,
  createNetwork,
  destroyNetwork,
  updateNetwork,
  updateNetworks,
  deleteNodeOrNetwork,
  deleteNode,
  canDeleteNode
} from './network.slice';
export {
  createAssets,
  createAsset,
  destroyAsset,
  updateAsset,
  updateAssets,
  addAssetsFromAPI,
  fetchAssets
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
  setRates,
  getRates,
  getInactivityTimer,
  setInactivityTimer,
  setDemoMode,
  getIsDemoMode,
  addAccountsToFavorites,
  canTrackProductAnalytics,
  setProductAnalyticsAuthorisation
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
export { getAppState } from './selectors';
export { default as persistanceSlice } from './persistance.slice';
export { appReset } from './root.reducer';
export { getMemberships, membershipExpiryDate } from './membership.slice';
