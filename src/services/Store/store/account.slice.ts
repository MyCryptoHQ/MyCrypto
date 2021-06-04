import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { makeFinishedTxReceipt } from '@helpers';
import { getTimestampFromBlockNum, getTxStatus, ProviderHandler } from '@services/EthService';
import { IPollingPayload, pollingSaga } from '@services/Polling';
import { translateRaw } from '@translations';
import {
  AssetBalanceObject,
  IAccount,
  IPendingTxReceipt,
  IProvidersMappings,
  ITxReceipt,
  ITxStatus,
  ITxType,
  LSKeys,
  NetworkId,
  StoreAccount,
  StoreAsset,
  TUuid
} from '@types';
import { isViewOnlyWallet, sortByLabel } from '@utils';
import { findIndex, propEq } from '@vendor';

import { getAccountByAddressAndNetworkName } from '../Account';
import { getTxsFromAccount, isTokenMigration } from '../helpers';
import { getNetworkById } from '../Network';
import { getAssetByUUID } from './asset.slice';
import { selectAccountContact } from './contact.slice';
import { sanitizeAccount } from './helpers';
import { fetchMemberships } from './membership.slice';
import { getNetwork, selectNetworks } from './network.slice';
import { getAppState } from './selectors';
import { addAccountsToFavorites, getFavorites, getIsDemoMode } from './settings.slice';
import { scanTokens } from './tokenScanning.slice';

export const initialState = [] as IAccount[];

const sliceName = LSKeys.ACCOUNTS;

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<IAccount>) {
      state.push(sanitizeAccount(action.payload));
    },
    createMany(state, action: PayloadAction<IAccount[]>) {
      action.payload.forEach((a) => {
        state.push(sanitizeAccount(a));
      });
    },
    resetAndCreate(_, action: PayloadAction<IAccount>) {
      return [sanitizeAccount(action.payload)];
    },
    resetAndCreateMany(_, action: PayloadAction<IAccount[]>) {
      return action.payload.map((a) => sanitizeAccount(a));
    },
    destroy(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(propEq('uuid', action.payload), state);
      state.splice(idx, 1);
    },
    update(state, action: PayloadAction<IAccount>) {
      const idx = findIndex(propEq('uuid', action.payload.uuid), state);
      state[idx] = sanitizeAccount(action.payload);
    },
    updateMany(state, action: PayloadAction<IAccount[]>) {
      const accounts = action.payload;
      accounts.forEach((account) => {
        const idx = findIndex(propEq('uuid', account.uuid), state);
        state[idx] = sanitizeAccount(account);
      });
    },
    updateAssets(state, action: PayloadAction<Record<string, AssetBalanceObject[]>>) {
      const accounts = action.payload;
      Object.entries(accounts).forEach(([uuid, assets]) => {
        const idx = findIndex(propEq('uuid', uuid), state);
        state[idx].assets = assets;
      });
    },
    reset() {
      return initialState;
    }
  }
});

export const {
  create: createAccount,
  createMany: createAccounts,
  resetAndCreate: resetAndCreateAccount,
  resetAndCreateMany: resetAndCreateManyAccounts,
  destroy: destroyAccount,
  update: updateAccount,
  updateMany: updateAccounts,
  reset: resetAccount,
  updateAssets: updateAccountAssets
} = slice.actions;

export default slice;

/**
 * Selectors
 */
export const getAccounts = createSelector([getAppState], (s) => {
  const accounts = s[slice.name];
  return accounts?.map((a) => ({
    ...a,
    transactions: a.transactions?.map((t) => ({
      ...t,
      value: EthersBN.from(t.value),
      gasLimit: EthersBN.from(t.gasLimit),
      gasPrice: EthersBN.from(t.gasPrice),
      gasUsed: t.gasUsed && EthersBN.from(t.gasUsed)
    }))
  }));
});

export const selectCurrentAccounts = createSelector(
  [getAccounts, getFavorites],
  (accounts, favorites) => {
    return accounts.filter(({ uuid }) => favorites.indexOf(uuid) >= 0);
  }
);

export const selectAccountTxs = createSelector([getAccounts], (accounts) =>
  accounts.filter(Boolean).flatMap(({ transactions }) => transactions)
);

export const selectTxsByStatus = (status: ITxStatus) =>
  createSelector([selectAccountTxs], (txs) => {
    return txs.filter(({ status: s }) => s === status);
  });

export const getAccountsAssets = createSelector([getAccounts, (s) => s], (a, s) =>
  a
    .flatMap((a) => a.assets)
    .reduce((acc, asset) => [...acc, getAssetByUUID(asset.uuid)(s)], [] as StoreAsset[])
);

export const getAccountsAssetsMappings = createSelector([getAccountsAssets], (assets) =>
  assets.reduce(
    (acc, a) => (a ? { ...acc, [a.uuid]: a.mappings } : acc),
    {} as Record<string, IProvidersMappings>
  )
);

export const getStoreAccounts = createSelector([getAccounts, (s) => s], (accounts, s) => {
  return accounts.map((a) => {
    const accountAssets: StoreAsset[] = a.assets.reduce(
      (acc, asset) => [
        ...acc,
        // @todo: Switch BN from ethers to unified BN
        { ...asset, balance: EthersBN.from(asset.balance), ...getAssetByUUID(asset.uuid)(s)! }
      ],
      []
    );
    return {
      ...a,
      assets: accountAssets,
      network: getNetwork(a.networkId)(s),
      label: selectAccountContact(a)(s)?.label || a.label || translateRaw('NO_LABEL')
    };
  });
});

export const getDefaultAccount = (includeViewOnly?: boolean, networkId?: NetworkId) =>
  createSelector(
    getStoreAccounts,
    (accounts) =>
      sortByLabel(
        accounts
          .filter((a) => a.networkId === networkId || networkId === undefined)
          .filter((a) => !isViewOnlyWallet(a.wallet) || includeViewOnly)
      )[0]
  );

/**
 * Actions
 */
export const addAccounts = createAction<IAccount[]>(`${slice.name}/addAccounts`);
export const addTxToAccount = createAction<{
  account: IAccount;
  tx: ITxReceipt;
}>(`${slice.name}/addTxToAccount`);

export const startTxPolling = createAction(`${slice.name}/startTxPolling`);
export const stopTxPolling = createAction(`${slice.name}/stopTxPolling`);

// Polling Config
const payload: IPollingPayload = {
  startAction: startTxPolling,
  stopAction: stopTxPolling,
  params: {
    interval: 5000,
    retryOnFailure: true,
    retries: 3,
    retryAfter: 3000
  },
  saga: pendingTxPolling
};

/**
 * Sagas
 */
export function* accountsSaga() {
  yield all([
    takeLatest(addAccounts.type, handleAddAccounts),
    takeLatest(addTxToAccount.type, addTxToAccountWorker),
    pollingSaga(payload)
  ]);
}

export function* handleAddAccounts({ payload }: PayloadAction<IAccount[]>) {
  const isDemoMode: boolean = yield select(getIsDemoMode);
  // This is where demo mode is disabled when adding new accounts.
  if (isDemoMode) {
    yield put(slice.actions.resetAndCreateMany(payload));
    yield put(addAccountsToFavorites(payload.map(({ uuid }) => uuid)));
  } else {
    yield put(slice.actions.createMany(payload));
    yield put(addAccountsToFavorites(payload.map(({ uuid }) => uuid)));
  }
}

export function* addTxToAccountWorker({
  payload: { account, tx: newTx }
}: PayloadAction<{ account: IAccount; tx: ITxReceipt }>) {
  const newAccountData = {
    ...account,
    transactions: [...account.transactions.filter((tx) => tx.hash !== newTx.hash), newTx]
  };
  yield put(updateAccount(newAccountData));

  if (newTx.status !== ITxStatus.SUCCESS) {
    return;
  }

  if (
    newTx.txType === ITxType.DEFIZAP ||
    isTokenMigration(newTx.txType) ||
    newTx.txType === ITxType.SWAP
  ) {
    const receivingAsset =
      newTx.metadata?.receivingAsset &&
      (yield select(getAssetByUUID(newTx.metadata.receivingAsset)));
    yield put(
      scanTokens({
        accounts: [account],
        assets: receivingAsset && [receivingAsset]
      })
    );
  } else if (newTx.txType === ITxType.PURCHASE_MEMBERSHIP) {
    yield put(fetchMemberships([account]));
  }
}

export function* pendingTxPolling() {
  const pendingTransactions: IPendingTxReceipt[] = yield select(
    selectTxsByStatus(ITxStatus.PENDING)
  );
  const accounts: StoreAccount[] = yield select(getStoreAccounts);
  const networks = yield select(selectNetworks);

  for (const pendingTxReceipt of pendingTransactions) {
    const senderAccount = getAccountByAddressAndNetworkName(accounts)(
      pendingTxReceipt.from,
      pendingTxReceipt.asset.networkId
    ) as StoreAccount;

    if (!senderAccount) return;

    const txs = getTxsFromAccount([senderAccount]);
    const overwritingTx = txs.find(
      (t) =>
        t.nonce === pendingTxReceipt.nonce &&
        t.asset.networkId === pendingTxReceipt.asset.networkId &&
        t.hash !== pendingTxReceipt.hash &&
        t.status === ITxStatus.SUCCESS
    );

    if (overwritingTx) {
      const updatedAccount = {
        ...senderAccount,
        transactions: [
          ...senderAccount.transactions.filter((t) => t.hash !== pendingTxReceipt.hash)
        ]
      };
      yield put(updateAccount(updatedAccount));
      continue;
    }

    const network = getNetworkById(pendingTxReceipt.asset.networkId, networks);
    // If network is not found in the pendingTransactionObject, we cannot continue.
    if (!network) continue;
    const provider = new ProviderHandler(network);

    const txResponse = yield call(provider.getTransactionByHash, pendingTxReceipt.hash);
    // Fail out if tx receipt cant be found.
    // This initial check stops us from spamming node for data before there is data to fetch.
    if (!txResponse || !txResponse.blockNumber) continue;

    const txStatus = yield call(getTxStatus, provider, pendingTxReceipt.hash);
    const txTimestamp = yield call(getTimestampFromBlockNum, txResponse.blockNumber, provider);

    // Get block tx success/fail and timestamp for block number, then overwrite existing tx in account.
    // txStatus and txTimestamp return undefined on failed lookups.
    if (!txStatus || !txTimestamp) continue;

    const finishedTxReceipt = makeFinishedTxReceipt(
      pendingTxReceipt,
      txStatus,
      txTimestamp,
      txResponse.blockNumber
    );
    yield put(addTxToAccount({ account: senderAccount, tx: finishedTxReceipt }));
  }
}
