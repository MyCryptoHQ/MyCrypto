import { DeterministicAddress, DeterministicWallet } from '@mycrypto/wallets';
import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import BN from 'bn.js';
import { all, call, put, race, select, take, takeLatest } from 'redux-saga/effects';

import { BalanceMap, getAssetBalance } from '@services/Store/BalanceService';
import {
  DWAccountDisplay,
  ExtendedDPath,
  HDWalletState
} from '@services/WalletService/deterministic';
import { getWallet } from '@services/WalletService/walletService';
import { connectWallet, getWalletConnection } from '@store/connections.slice';
import { AppState } from '@store/root.reducer';
import { DPathFormat, ExtendedAsset, Network, TAddress } from '@types';
import { accountsToCSV } from '@utils';

export enum HDWalletErrors {
  SESSION_CONNECTION_FAILED = 'SESSION_CONNECTION_FAILED',
  GET_ACCOUNTS_FAILED = 'GET_ACCOUNTS_FAILED'
}

export const initialState: HDWalletState = {
  session: undefined,
  isInit: false,
  isConnected: false,
  isConnecting: false,
  isGettingAccounts: false,
  isCompleted: false,
  accountQueue: [],
  scannedAccounts: [],
  customDPaths: []
};

const slice = createSlice({
  name: 'hdWallet',
  initialState,
  reducers: {
    resetState() {
      return initialState;
    },
    setSession(state, action: PayloadAction<DeterministicWallet>) {
      state.session = action.payload;
    },
    requestConnection(state) {
      state.isConnecting = true;
      state.error = undefined;
    },
    requestConnectionFailure(
      state,
      action: PayloadAction<{ code: HDWalletErrors; message: string }>
    ) {
      state.error = action.payload;
      state.isConnecting = false;
    },
    requestConnectionSuccess(
      state,
      action: PayloadAction<{ asset: ExtendedAsset; network: Network }>
    ) {
      const { asset, network } = action.payload;
      state.isConnected = true;
      state.isConnecting = false;
      state.error = undefined;
      state.network = network;
      state.asset = asset;
    },
    requestAddresses(state) {
      state.isGettingAccounts = true;
      state.isCompleted = false;
    },
    requestAddressesSuccess(state) {
      state.isGettingAccounts = false;
      state.error = undefined;
    },
    requestAddressesFailure(
      state,
      action: PayloadAction<{ code: HDWalletErrors; message: string }>
    ) {
      state.isGettingAccounts = false;
      state.isCompleted = true;
      state.error = action.payload;
    },
    enqueueAccounts(state, action: PayloadAction<DWAccountDisplay[]>) {
      const allAccountQueue = [...state.accountQueue, ...action.payload];
      state.accountQueue = allAccountQueue;
    },
    updateAccounts(
      state,
      action: PayloadAction<{ accounts: DWAccountDisplay[]; asset: ExtendedAsset }>
    ) {
      const { accounts, asset } = action.payload;
      // handles asset updates more-gracefully
      if (asset.uuid !== state.asset!.uuid) {
        return state;
      }
      const newAccountQueue = [...state.accountQueue].filter(
        ({ address }) => !accounts.map((a) => a.address).includes(address as TAddress)
      );
      state.isGettingAccounts = newAccountQueue.length > 0;
      state.accountQueue = [...newAccountQueue];
      state.scannedAccounts = [...state.scannedAccounts, ...accounts];
    },
    updateAsset(state, action: PayloadAction<ExtendedAsset>) {
      const updatedaccountQueue = [
        ...state.accountQueue,
        ...state.scannedAccounts.map((account) => ({ ...account, balance: undefined }))
      ];
      state.asset = action.payload;
      state.isCompleted = false;
      state.accountQueue = updatedaccountQueue;
      state.scannedAccounts = [];
    },
    addCustomDPaths(state, action: PayloadAction<ExtendedDPath[]>) {
      const customDPaths = [...state.customDPaths, ...action.payload];
      state.isCompleted = false;
      state.customDPaths = customDPaths;
    },
    triggerComplete(state) {
      state.isCompleted = true;
    }
  }
});

export const {
  resetState,
  setSession,
  requestConnection,
  requestConnectionFailure,
  requestConnectionSuccess,
  requestAddresses,
  requestAddressesFailure,
  requestAddressesSuccess,
  enqueueAccounts,
  updateAccounts,
  updateAsset,
  addCustomDPaths,
  triggerComplete
} = slice.actions;

export default slice;

/**
 * Selectors
 */
const selectHDWallet = (s: AppState) => s[slice.name];
export const selectHDWalletSession = createSelector(selectHDWallet, (hd) => hd.session);
export const selectHDWalletAsset = createSelector(selectHDWallet, (hd) => hd.asset);
export const selectHDWalletNetwork = createSelector(selectHDWallet, (hd) => hd.network);
export const selectHDWalletAccountQueue = createSelector(selectHDWallet, (hd) => hd.accountQueue);
export const selectHDWalletScannedAccounts = createSelector(
  selectHDWallet,
  (hd) => hd.scannedAccounts
);
export const selectHDWalletIsConnected = createSelector(selectHDWallet, (hd) => hd.isConnected);
export const selectHDWalletIsConnecting = createSelector(selectHDWallet, (hd) => hd.isConnecting);
export const selectHDWalletIsCompleted = createSelector(selectHDWallet, (hd) => hd.isCompleted);
export const selectHDWalletIsGettingAccounts = createSelector(
  selectHDWallet,
  (hd) => hd.isGettingAccounts
);
export const selectHDWalletCustomDPaths = createSelector(selectHDWallet, (hd) => hd.customDPaths);
export const selectHDWalletConnectionError = createSelector(selectHDWallet, (hd) => hd.error);
export const selectHDWalletScannedAccountsCSV = createSelector(
  selectHDWallet,
  (hd) => hd.asset && accountsToCSV(hd.scannedAccounts, hd.asset)
);

/**
 * Actions
 */

export const connectHDWallet = createAction<{
  walletId: DPathFormat;
  dpaths: ExtendedDPath[];
  network: Network;
  asset: ExtendedAsset;
}>(`${slice.name}/connectHDWallet`);
export const getAccounts = createAction<{ dpaths: ExtendedDPath[] }>(`${slice.name}/getAccounts`);
export const processAccountsQueue = createAction(`${slice.name}/processAccountsQueue`);

/**
 * Sagas
 */
export function* hdWalletSaga() {
  yield all([
    takeLatest(connectHDWallet.type, requestConnectionWorker),
    takeLatest(getAccounts.type, getAccountsSagaWatcher),
    takeLatest(processAccountsQueue.type, accountsQueueSagaWatcher)
  ]);
}

export function* requestConnectionWorker({
  payload
}: PayloadAction<{
  walletId: DPathFormat;
  dpaths: ExtendedDPath[];
  network: Network;
  asset: ExtendedAsset;
}>) {
  const { asset, dpaths, network, walletId } = payload;
  // initialize the wallet
  try {
    const params = yield select(getWalletConnection(walletId));
    yield put(slice.actions.requestConnection());
    const session: DeterministicWallet = yield call(getWallet, walletId, params);
    yield call([session, session.getAddress], dpaths[0], 0);
    yield put(setSession(session));
    yield put(connectWallet(session));
    yield put(slice.actions.requestConnectionSuccess({ asset, network }));
  } catch (err) {
    console.error(`Connection error for ${walletId} hardware wallet: ${err}`);
    yield put(
      slice.actions.requestConnectionFailure({
        code: HDWalletErrors.SESSION_CONNECTION_FAILED,
        message: err.message
      })
    );
  }
}

export function* getAccountsWorker({ payload }: PayloadAction<{ dpaths: ExtendedDPath[] }>) {
  const session = yield select(selectHDWalletSession);
  const { dpaths } = payload;
  yield put(slice.actions.requestAddresses());
  if (!('getAddressesWithMultipleDPaths' in session)) {
    console.error(`[getAccounts]: Selected HD wallet type has no getMultipleAddresses method`);
    return;
  }
  try {
    const addresses: DeterministicAddress[] = yield call(
      [session, session.getAddressesWithMultipleDPaths],
      dpaths.map((path) => ({
        limit: path.numOfAddresses,
        offset: path.offset,
        path
      }))
    );
    if (addresses.length === 0) return;
    const dwaccounts = addresses.map((a) => ({
      address: a.address,
      pathItem: { path: a.dPath, index: a.index, baseDPath: a.dPathInfo as ExtendedDPath }
    }));
    yield put(slice.actions.enqueueAccounts(dwaccounts));
    yield put(processAccountsQueue());
  } catch (err) {
    yield put(
      slice.actions.requestAddressesFailure({
        code: HDWalletErrors.GET_ACCOUNTS_FAILED,
        message: err
      })
    );
  }
}

export function* accountsQueueWorker() {
  const network: Network = yield select(selectHDWalletNetwork);
  const accountQueue: DWAccountDisplay[] = yield select(selectHDWalletAccountQueue);
  const asset: ExtendedAsset = yield select(selectHDWalletAsset);
  try {
    const balances: BalanceMap<BN> = yield call(getAssetBalance, {
      asset,
      network,
      addresses: accountQueue.map(({ address }) => address)
    });
    const walletsWithBalances: DWAccountDisplay[] = accountQueue.map((account) => {
      const balance = balances[account.address] || 0; // @todo - better error handling for failed lookups.
      return {
        ...account,
        balance: balance.toString()
      };
    });
    yield put(slice.actions.updateAccounts({ accounts: walletsWithBalances, asset }));
  } catch (e) {
    yield put(slice.actions.updateAccounts({ accounts: accountQueue, asset }));
  }
}

// Race handles the case where accountsQueueWorker or getAccountsWorker are still running when resetState is triggered,
// resulting in the state being altered after resetState is triggered (and subsequent usages of hdwallet are broken).
export function* accountsQueueSagaWatcher() {
  yield race([call(accountsQueueWorker), take(resetState.type)]);
}

export function* getAccountsSagaWatcher(payload: PayloadAction<{ dpaths: ExtendedDPath[] }>) {
  yield race([call(getAccountsWorker, payload), take(resetState.type)]);
}
