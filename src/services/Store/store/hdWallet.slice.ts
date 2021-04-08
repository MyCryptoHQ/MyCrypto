import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import BN from 'bn.js';
import { select } from 'redux-saga-test-plan/matchers';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import {
  DeterministicWalletState,
  DWAccountDisplay,
  ExtendedDPath,
  selectWallet
} from '@services/WalletService/deterministic';
import { Wallet } from '@services/WalletService/wallets';
import { DPathFormat, ExtendedAsset, Network, TAddress } from '@types';
import { identity } from '@vendor';

import {
  BalanceMap,
  getBaseAssetBalancesForAddresses,
  getSingleTokenBalanceForAddresses
} from '../BalanceService';
import { AppState } from './root.reducer';

export enum HDWalletErrors {
  SESSION_CONNECTION_FAILED = 'SESSION_CONNECTION_FAILED',
  GET_ACCOUNTS_FAILED = 'GET_ACCOUNTS_FAILED'
}

export const initialState: DeterministicWalletState = {
  asset: undefined,
  network: undefined,
  isInit: false,
  isConnected: false,
  session: undefined,
  isConnecting: false,
  isGettingAccounts: false,
  isCompleted: false,
  queuedAccounts: [],
  finishedAccounts: [],
  customDPaths: [],
  error: undefined
};

const slice = createSlice({
  name: 'hdWallet',
  initialState,
  reducers: {
    requestConnection(state) {
      state.isConnecting = true;
      state.error = undefined;
    },
    onConnectionFailure(state, action: PayloadAction<{ code: HDWalletErrors; message: string }>) {
      state.error = action.payload;
      state.isConnecting = false;
    },
    onConnectionSuccess(state, action: PayloadAction<{ asset: ExtendedAsset; network: Network }>) {
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
    onRequestAddressesSuccess(state) {
      state.isGettingAccounts = false;
      state.error = undefined;
    },
    onRequestAddressesFailure(
      state,
      action: PayloadAction<{ code: HDWalletErrors; message: string }>
    ) {
      state.isGettingAccounts = false;
      state.isCompleted = true;
      state.error = action.payload;
    },
    enqueueAccounts(state, action: PayloadAction<DWAccountDisplay[]>) {
      const allQueuedAccounts = [...state.queuedAccounts, ...action.payload];
      state.queuedAccounts = allQueuedAccounts;
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
      const newQueuedAccounts = [...state.queuedAccounts].filter(
        ({ address }) => !accounts.map((a) => a.address).includes(address as TAddress)
      );
      state.isGettingAccounts = newQueuedAccounts.length > 0;
      state.queuedAccounts = [...newQueuedAccounts];
      state.finishedAccounts = [...state.finishedAccounts, ...accounts];
    },
    updateAsset(state, action: PayloadAction<ExtendedAsset>) {
      const updatedQueuedAccounts = [
        ...state.queuedAccounts,
        ...state.finishedAccounts.map((account) => ({ ...account, balance: undefined }))
      ];
      state.asset = action.payload;
      state.isCompleted = false;
      state.queuedAccounts = updatedQueuedAccounts;
      state.finishedAccounts = [];
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
  onConnectionFailure,
  onConnectionSuccess,
  requestAddresses,
  onRequestAddressesFailure,
  onRequestAddressesSuccess,
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
export const getWalletSession = (s: AppState) => s.hdWallet.session;
export const getHDWalletSession = createSelector(getWalletSession, identity);

export const getAsset = (s: AppState) => s.hdWallet.asset;
export const getHDWalletAsset = createSelector(getAsset, identity);

export const getNetwork = (s: AppState) => s.hdWallet.network;
export const getHDWalletNetwork = createSelector(getNetwork, identity);

export const getQueuedAccounts = (s: AppState) => s.hdWallet.queuedAccounts;
export const getHDWalletQueuedAccounts = createSelector(getQueuedAccounts, identity);

export const getFinishedAccounts = (s: AppState) => s.hdWallet.finishedAccounts;
export const getHDWalletFinishedAccounts = createSelector(getFinishedAccounts, identity);

export const getIsConnected = (s: AppState) => s.hdWallet.isConnected;
export const getHDWalletIsConnected = createSelector(getIsConnected, identity);

export const getIsConnecting = (s: AppState) => s.hdWallet.isConnecting;
export const getHDWalletIsConnecting = createSelector(getIsConnected, identity);

export const getIsCompleted = (s: AppState) => s.hdWallet.isCompleted;
export const getHDWalletIsCompleted = createSelector(getIsCompleted, identity);

export const getIsGettingAccounts = (s: AppState) => s.hdWallet.isGettingAccounts;
export const getHDWalletIsGettingAccounts = createSelector(getIsGettingAccounts, identity);

export const getCustomDPaths = (s: AppState) => s.hdWallet.customDPaths;
export const getHDWalletCustomDPaths = createSelector(getCustomDPaths, identity);

export const getConnectionError = (s: AppState) => s.hdWallet.error;
export const getHDWalletConnectionError = createSelector(getConnectionError, identity);

/**
 * Actions
 */

export const connectToHDWallet = createAction<{
  walletId: DPathFormat;
  dpaths: ExtendedDPath[];
  network: Network;
  asset: ExtendedAsset;
  setSession(wallet: Wallet): void;
}>(`${slice.name}/connectToHDWallet`);
export const addNewDPaths = createAction<{
  customDPaths: ExtendedDPath[];
}>(`${slice.name}/addNewDPaths`);
export const updateAnAsset = createAction<{ asset: ExtendedAsset }>(`${slice.name}/updateAnAsset`);
export const getAccounts = createAction<{ session: Wallet; dpaths: ExtendedDPath[] }>(
  `${slice.name}/getAccounts`
);
export const processAccountsQueue = createAction(`${slice.name}/processAccountsQueue`);

/**
 * Sagas
 */
export function* hdWalletSaga() {
  yield all([
    takeLatest(connectToHDWallet.type, requestConnectionWorker),
    takeLatest(addNewDPaths.type, addDPathsWorker),
    takeLatest(updateAnAsset.type, updateAssetWorker),
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
    yield put(slice.actions.onConnectionSuccess({ asset, network }));
  } catch (err) {
    console.error(err);
    yield put(
      slice.actions.onConnectionFailure({
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
      slice.actions.onRequestAddressesFailure({
        code: HDWalletErrors.GET_ACCOUNTS_FAILED,
        message: err
      })
    );
  }
}

export function* addDPathsWorker({ payload }: PayloadAction<{ customDPaths: ExtendedDPath[] }>) {
  const { customDPaths } = payload;
  yield put(slice.actions.addCustomDPaths(customDPaths));
}

export function* updateAssetWorker({ payload }: PayloadAction<{ asset: ExtendedAsset }>) {
  const { asset } = payload;
  yield put(slice.actions.updateAsset(asset));
}

export function* accountsQueueWorker() {
  const network: Network = yield select(getHDWalletNetwork);
  const queuedAccounts: DWAccountDisplay[] = yield select(getHDWalletQueuedAccounts);
  const asset: ExtendedAsset = yield select(getHDWalletAsset);
  const addresses = queuedAccounts.map(({ address }) => address);
  const balanceLookup =
    asset.type === 'base'
      ? () => getBaseAssetBalancesForAddresses(addresses, network)
      : () => getSingleTokenBalanceForAddresses(asset, network, addresses);
  try {
    const balances: BalanceMap<BN> = yield call(balanceLookup);
    const walletsWithBalances: DWAccountDisplay[] = queuedAccounts.map((account) => {
      const balance = balances[account.address] || 0; // @todo - better error handling for failed lookups.
      return {
        ...account,
        balance: balance.toString()
      };
    });
    yield put(slice.actions.updateAccounts({ accounts: walletsWithBalances, asset }));
  } catch (e) {
    yield put(slice.actions.updateAccounts({ accounts: queuedAccounts, asset }));
  }
}
