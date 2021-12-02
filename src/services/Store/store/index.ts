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
export {
  createNotification,
  updateNotification,
  selectNotifications,
  displayNotification
} from './notification.slice';
export {
  addNewAccounts,
  createAccount,
  createAccounts,
  resetAndCreateAccount,
  resetAndCreateManyAccounts,
  destroyAccount,
  updateAccount,
  updateAccounts,
  getAccounts,
  selectCurrentAccounts,
  selectAccountTxs,
  selectTxsByStatus,
  addTxToAccount,
  removeAccountTx,
  getStoreAccounts,
  getDefaultAccount,
  getMergedTxHistory,
  getUserAssets,
  startBalancesPolling,
  stopBalancesPolling,
  getAccountsAssets,
  getSwapAssets,
  getSwapAssetsByNetwork
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
export {
  createContract,
  destroyContract,
  selectContracts,
  getContractName
} from './contract.slice';
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
  getBaseAssetByNetwork,
  getCoinGeckoAssetManifest,
  getAssetsByNetwork,
  getAssetByUUID
} from './asset.slice';
export {
  fetchMemberships,
  setMembership,
  deleteMembership,
  setMembershipFetchState,
  getIsMyCryptoMember,
  getMembershipState
} from './membership.slice';
export {
  resetCurrentsTo,
  addCurrents,
  addCurrent,
  addExcludedAsset,
  removeExcludedAsset,
  setLanguage,
  getFiat,
  setFiat,
  setDemoMode,
  getIsDemoMode,
  addAccountsToCurrents,
  canTrackProductAnalytics,
  setProductAnalyticsAuthorisation,
  getAnalyticsUserID,
  setAnalyticsUserID,
  getSettings,
  getFiatInformation
} from './settings.slice';
export { importSuccess, importError, importRequest, importComplete } from './import.slice';
export { scanTokens, isScanning } from './tokenScanning.slice';
export * from './tokenScanning.sagas';
export { getAppState, useSelector } from './selectors';
export { default as persistenceSlice } from './persistence.slice';
export { getMemberships, membershipExpiryDate } from './membership.slice';
export { setRates, getRates, startRatesPolling } from './rates.slice';
export { trackAsset, getTrackedAssets } from './trackedAssets.slice';
export { fetchHistory, fetchSchemaMeta, getTxHistory, getTxTypeMetas } from './txHistory.slice';
export { fetchENS, getENSRecords, getENSFetched } from './ens.slice';
export { getClaims, getAllClaims } from './claims.slice';
export { restoreAccount, deleteAccount, getAccountUndoCache } from './accountUndo.slice';
export { fetchNFTs, getFetched, getNFTsByCollection, getTotalValue } from './nft.slice';
export { getBaseFee } from './gas.slice';
export { checkForPromos, getPromoPoap, claimPromo } from './promoPoaps.slice';
export { getWalletConnection, connectWallet } from './connections.slice';
