import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { ITxHistoryType } from '@features/Dashboard/types';
import { NotificationTemplates } from '@features/NotificationsPanel/constants';
import { makeFinishedTxReceipt } from '@helpers';
import { getTimestampFromBlockNum, getTxStatus, ProviderHandler } from '@services/EthService';
import { IPollingPayload, pollingSaga } from '@services/Polling';
import { deriveTxType, ITxHistoryEntry, makeTxReceipt, merge } from '@services/TxHistory';
import { translateRaw } from '@translations';
import {
  Asset,
  AssetBalanceObject,
  ExtendedContact,
  IAccount,
  IAccountAdditionData,
  IPendingTxReceipt,
  IProvidersMappings,
  ITxReceipt,
  ITxStatus,
  ITxType,
  LSKeys,
  Network,
  NetworkId,
  StoreAccount,
  StoreAsset,
  TUuid,
  WalletId
} from '@types';
import {
  generateDeterministicAddressUUID,
  generateUUID,
  getWeb3Config,
  isSameAddress,
  isViewOnlyWallet,
  sortByLabel
} from '@utils';
import { findIndex, isEmpty, prop, propEq, sortBy, uniqBy } from '@vendor';

import { getAccountByAddressAndNetworkName } from '../Account';
import { getNewDefaultAssetTemplateByNetwork } from '../Asset';
import { getAccountsAssetsBalances } from '../BalanceService';
import {
  findMultipleNextUnusedDefaultLabels,
  getContactByAddressAndNetworkId
} from '../Contact/helpers';
import { isNotExcludedAsset, isTokenMigration } from '../helpers';
import { getNetworkById } from '../Network';
import { toStoreAccount } from '../utils';
import { getAssetByUUID, getAssets } from './asset.slice';
import { createOrUpdateContacts, selectAccountContact, selectContacts } from './contact.slice';
import { selectContracts } from './contract.slice';
import { sanitizeAccount } from './helpers';
import { fetchMemberships } from './membership.slice';
import { getNetwork, selectNetworks } from './network.slice';
import { displayNotification } from './notification.slice';
import { getAppState } from './selectors';
import {
  addAccountsToCurrents,
  getCurrents,
  getExcludedAssets,
  getIsDemoMode
} from './settings.slice';
import { scanTokens } from './tokenScanning.slice';
import { getTxHistory } from './txHistory.slice';

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

export const addNewAccounts = createAction<{
  networkId: NetworkId;
  accountType?: WalletId;
  newAccounts: IAccountAdditionData[];
}>(`${slice.name}/addNewAccounts`);

/**
 * Selectors
 */
export const getAccounts = createSelector([getAppState], (s) => {
  const accounts = s.accounts;
  return accounts?.map((a) => ({
    ...a,
    transactions: a.transactions?.map((t) => ({
      ...t,
      value: EthersBN.from(t.value),
      gasLimit: EthersBN.from(t.gasLimit),
      gasPrice: EthersBN.from(t.gasPrice),
      gasUsed: t.gasUsed && EthersBN.from(t.gasUsed)
    }))
  })) as StoreAccount[];
});

export const selectAccountTxs = createSelector([getAccounts], (accounts) =>
  accounts.filter(Boolean).flatMap(({ transactions }) => transactions)
);

export const selectTxsByStatus = (status: ITxStatus) =>
  createSelector([selectAccountTxs], (txs) => {
    return txs.filter(({ status: s }) => s === status);
  });

const getAccountsAssetsInfo = createSelector([getAccounts, (s) => s], (a, s) =>
  a
    .flatMap((a) => a.assets)
    .reduce((acc, asset) => [...acc, getAssetByUUID(asset.uuid)(s)], [] as StoreAsset[])
);

export const getUserAssets = createSelector(
  [getAccounts, getExcludedAssets, (s) => s],
  (accounts, excludedAssets, s) => {
    const userAssets = accounts
      .filter((a) => a.wallet !== WalletId.VIEW_ONLY)
      .flatMap((a) => a.assets)
      .reduce(
        (acc, asset) => [...acc, { ...asset, ...getAssetByUUID(asset.uuid)(s)! }],
        [] as StoreAsset[]
      )
      .filter(isNotExcludedAsset(excludedAssets));

    const uniq = uniqBy(prop('uuid'), userAssets);
    return sortBy(prop('ticker'), uniq);
  }
);

export const getAccountsAssetsMappings = createSelector([getAccountsAssetsInfo], (assets) =>
  assets.reduce(
    (acc, a) => (a ? { ...acc, [a.uuid]: a.mappings } : acc),
    {} as Record<string, IProvidersMappings>
  )
);

export const getStoreAccounts = createSelector(
  [getAccounts, (s) => s, getAssets],
  (accounts, s, assets) => {
    return accounts.map((a) => {
      const contact = selectAccountContact(a)(s);
      const network = getNetwork(a.networkId)(s);
      return toStoreAccount(a, assets, network, contact);
    });
  }
);

export const getAccountsAssets = createSelector([getStoreAccounts], (a) =>
  a.flatMap((a) => a.assets)
);

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

export const getMergedTxHistory = createSelector(
  [
    getStoreAccounts,
    selectNetworks,
    getAssets,
    selectAccountTxs,
    getTxHistory,
    selectContacts,
    selectContracts
  ],
  (accounts, networks, assets, accountTxs, txHistory, contacts, contracts) => {
    // Constant for now since we only support mainnet for tx history
    const ethNetwork = networks.find(({ id }) => id === 'Ethereum')!;

    const apiTxs = txHistory ? txHistory.map((tx) => makeTxReceipt(tx, ethNetwork, assets)) : [];

    return (
      merge(apiTxs, accountTxs)
        .map((tx: ITxReceipt) => {
          const network = networks.find(({ id }) => tx.asset.networkId === id) as Network;

          // if Txhistory contains a deleted network ie. MATIC remove from history.
          if (!network) return {} as ITxHistoryEntry;

          const toAddressBookEntry = getContactByAddressAndNetworkId(contacts, contracts)(
            tx.receiverAddress || tx.to,
            network.id
          );
          const fromAddressBookEntry = getContactByAddressAndNetworkId(contacts, contracts)(
            tx.from,
            network.id
          );
          return {
            ...tx,
            timestamp: tx.timestamp || 0,
            txType: deriveTxType(accounts, tx) || ITxHistoryType.UNKNOWN,
            toAddressBookEntry,
            fromAddressBookEntry,
            networkId: network.id
          };
        })
        // Remove eventual empty items from list
        .filter((item) => !isEmpty(item))
    );
  }
);

export const selectCurrentAccounts = createSelector(
  [getStoreAccounts, getCurrents],
  (accounts, currents) => {
    return accounts.filter(({ uuid }) => currents.indexOf(uuid) >= 0);
  }
);

/**
 * Actions
 */
export const addTxToAccount = createAction<{
  account: IAccount;
  tx: ITxReceipt;
}>(`${slice.name}/addTxToAccount`);

export const startTxPolling = createAction(`${slice.name}/startTxPolling`);
export const stopTxPolling = createAction(`${slice.name}/stopTxPolling`);

export const startBalancesPolling = createAction(`${slice.name}/startBalancesPolling`);
export const stopBalancesPolling = createAction(`${slice.name}/stopBalancesPolling`);

/**
 * Sagas
 */
export function* accountsSaga() {
  yield all([
    takeLatest(addTxToAccount.type, addTxToAccountWorker),
    takeLatest(addNewAccounts.type, addNewAccountsWorker),
    pollingSaga(pendingTxPollingPayload),
    pollingSaga(balancesPollingPayload)
  ]);
}

// Polling Config
const pendingTxPollingPayload: IPollingPayload = {
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

export function* addNewAccountsWorker({
  payload: { networkId, accountType, newAccounts }
}: PayloadAction<{
  networkId: NetworkId;
  accountType?: WalletId;
  newAccounts: IAccountAdditionData[];
}>) {
  const accounts: StoreAccount[] = yield select(getStoreAccounts);
  const networks: Network[] = yield select(selectNetworks);
  const assets: Asset[] = yield select(getAssets);
  const contacts = yield select(selectContacts);
  const contracts = yield select(selectContracts);

  const network = getNetworkById(networkId, networks);
  if (!network || newAccounts.length === 0) return;
  const accountsToAdd = newAccounts.filter(
    ({ address }) => !getAccountByAddressAndNetworkName(accounts)(address, networkId)
  );
  const walletType = accountType! === WalletId.WEB3 ? getWeb3Config().id : accountType!;
  const newAsset = getNewDefaultAssetTemplateByNetwork(assets)(network);
  const newRawAccounts = accountsToAdd.map(({ address, dPath }) => ({
    uuid: generateDeterministicAddressUUID(networkId, address),
    address,
    networkId,
    wallet: walletType,
    dPath,
    assets: [{ uuid: newAsset.uuid, balance: '0', mtime: Date.now() }],
    transactions: [],
    mtime: 0,
    favorite: false,
    isPrivate: undefined
  }));
  if (newRawAccounts.length === 0) {
    yield put(displayNotification({ templateName: NotificationTemplates.walletsNotAdded }));
    return;
  }
  const newLabels = findMultipleNextUnusedDefaultLabels(
    newRawAccounts[0].wallet,
    newRawAccounts.length
  )(contacts);
  const newContacts = newRawAccounts
    .map((rawAccount, idx) => {
      const existingContact = getContactByAddressAndNetworkId(contacts, contracts)(
        rawAccount.address,
        networkId
      );
      if (existingContact && existingContact.label === translateRaw('NO_LABEL')) {
        return {
          ...existingContact,
          label: newLabels[idx]
        };
      } else if (!existingContact) {
        return {
          label: newLabels[idx],
          address: rawAccount.address,
          notes: '',
          network: rawAccount.networkId,
          uuid: generateUUID()
        };
      }
      return undefined;
    })
    .filter((a) => a !== undefined) as ExtendedContact[];
  if (newContacts.length > 0) {
    yield put(createOrUpdateContacts(newContacts));
  }
  const isDemoMode: boolean = yield select(getIsDemoMode);
  // This is where demo mode is disabled when adding new accounts.
  if (isDemoMode) {
    yield put(slice.actions.resetAndCreateMany(newRawAccounts));
  } else {
    yield put(slice.actions.createMany(newRawAccounts));
  }
  yield put(addAccountsToCurrents(newRawAccounts.map(({ uuid }) => uuid)));
  yield put(scanTokens({ accounts: newRawAccounts }));
  yield put(fetchMemberships(newRawAccounts));
  if (newRawAccounts.length > 1) {
    yield put(
      displayNotification({
        templateName: NotificationTemplates.walletsAdded,
        templateData: {
          accounts: newAccounts
        }
      })
    );
  } else {
    yield put(
      displayNotification({
        templateName: NotificationTemplates.walletAdded,
        templateData: {
          address: newAccounts[0].address
        }
      })
    );
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
  const networks: Network[] = yield select(selectNetworks);

  for (const pendingTxReceipt of pendingTransactions) {
    const senderAccount = getAccountByAddressAndNetworkName(accounts)(
      pendingTxReceipt.from,
      pendingTxReceipt.asset.networkId
    ) as StoreAccount;

    if (!senderAccount) continue;

    const txs: ITxHistoryEntry[] = yield select(getMergedTxHistory);
    const userTxs = txs.filter(
      (t) => t.networkId === senderAccount.networkId && isSameAddress(t.from, senderAccount.address)
    );
    const overwritingTx = userTxs.find(
      (t) =>
        t.nonce === pendingTxReceipt.nonce &&
        t.asset.networkId === pendingTxReceipt.asset.networkId &&
        t.hash !== pendingTxReceipt.hash &&
        t.status === ITxStatus.SUCCESS
    );

    if (overwritingTx) {
      const updatedAccount = {
        ...senderAccount,
        transactions: senderAccount.transactions.filter((t) => t.hash !== pendingTxReceipt.hash)
      };
      yield put(updateAccount(updatedAccount));
      continue;
    }

    const network = getNetworkById(pendingTxReceipt.asset.networkId, networks);
    // If network is not found in the pendingTransactionObject, we cannot continue.
    if (!network) continue;
    const provider = new ProviderHandler(network);

    // Special notation for calling class functions that reference `this`
    const txResponse = yield call([provider, provider.getTransactionByHash], pendingTxReceipt.hash);
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

const balancesPollingPayload: IPollingPayload = {
  startAction: startBalancesPolling,
  stopAction: stopBalancesPolling,
  params: {
    interval: 60000,
    retryOnFailure: true,
    retries: 3,
    retryAfter: 3000
  },
  saga: fetchBalances
};

export function* fetchBalances() {
  const accounts: StoreAccount[] = yield select(selectCurrentAccounts);

  const accountsWithBalances: StoreAccount[] = yield call(getAccountsAssetsBalances, accounts);

  yield put(updateAccounts(accountsWithBalances));
}
