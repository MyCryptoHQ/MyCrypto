import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import BN from 'bn.js';
import { select } from 'redux-saga-test-plan/matchers';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import {
  DWAccountDisplay,
  ExtendedDPath,
  HDWalletState,
  selectWallet
} from '@services/WalletService/deterministic';
import { Wallet } from '@services/WalletService/wallets';
import { DPathFormat, ExtendedAsset, Network, TAddress } from '@types';

import { BalanceMap, getAssetBalance } from '../BalanceService';
import { AppState } from './root.reducer';

export enum HDWalletErrors {
  SESSION_CONNECTION_FAILED = 'SESSION_CONNECTION_FAILED',
  GET_ACCOUNTS_FAILED = 'GET_ACCOUNTS_FAILED'
}

export const initialState: HDWalletState = {
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

/**
 * Actions
 */

export const connectHDWallet = createAction<{
  walletId: DPathFormat;
  dpaths: ExtendedDPath[];
  network: Network;
  asset: ExtendedAsset;
  setSession(wallet: Wallet): void;
}>(`${slice.name}/connectHDWallet`);
export const getAccounts = createAction<{ session: Wallet; dpaths: ExtendedDPath[] }>(
  `${slice.name}/getAccounts`
);
export const processAccountsQueue = createAction(`${slice.name}/processAccountsQueue`);

/**
 * Sagas
 */
export function* hdWalletSaga() {
  yield all([
    takeLatest(connectHDWallet.type, requestConnectionWorker),
    takeLatest(getAccounts.type, getAccountsWorker),
    takeLatest(processAccountsQueue.type, accountsQueueWorker)
  ]);
}

export function* requestConnectionWorker({
  payload
}: PayloadAction<{
  walletId: DPathFormat;
  dpaths: ExtendedDPath[];
  network: Network;
  asset: ExtendedAsset;
  setSession(wallet: Wallet): void;
}>) {
  const { asset, dpaths, network, walletId, setSession } = payload;
  // initialize the wallet
  try {
    const session: Wallet = yield call(selectWallet, walletId);
    yield call([session, 'initialize'], dpaths[0]);
    yield put(slice.actions.requestConnection());
    yield call(setSession, session);
    yield put(slice.actions.requestConnectionSuccess({ asset, network }));
  } catch (err) {
    console.error(err);
    yield put(
      slice.actions.requestConnectionFailure({
        code: HDWalletErrors.SESSION_CONNECTION_FAILED,
        message: err
      })
    );
  }
}

export function* getAccountsWorker({
  payload
}: PayloadAction<{ session: Wallet; dpaths: ExtendedDPath[] }>) {
  const { dpaths, session } = payload;
  yield put(slice.actions.requestAddresses());
  if (!('getMultipleAddresses' in session)) {
    console.error(`[getAccounts]: Selected HD wallet type has no getMultipleAddresses method`);
    return;
  }
  try {
    const dwaccounts: DWAccountDisplay[] = yield call([session, 'getMultipleAddresses'], dpaths);
    if (dwaccounts.length === 0) return;
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
