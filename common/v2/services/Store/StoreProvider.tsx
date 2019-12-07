import React, { useState, useContext, useMemo, createContext, useEffect } from 'react';

import {
  StoreAccount,
  StoreAsset,
  Network,
  TTicker,
  ExtendedAsset,
  WalletId,
  Asset,
  ITxReceipt
} from 'v2/types';
import { isArrayEqual, useInterval, convertToFiatFromAsset, fromTxReceiptObj } from 'v2/utils';
import { ProviderHandler, getTxStatus, getTimestampFromBlockNum } from 'v2/services/EthService';

import { getAccountsAssetsBalances, accountUnlockVIPDetected } from './BalanceService';
import { getStoreAccounts, getPendingTransactionsFromAccounts } from './helpers';
import { AssetContext, getTotalByAsset } from './Asset';
import { AccountContext, getDashboardAccounts } from './Account';
import { SettingsContext } from './Settings';
import { NetworkContext } from './Network';

interface State {
  readonly accounts: StoreAccount[];
  readonly networks: Network[];
  readonly isUnlockVIP: boolean;
  tokens(selectedAssets?: StoreAsset[]): StoreAsset[];
  assets(selectedAccounts?: StoreAccount[]): StoreAsset[];
  totals(selectedAccounts?: StoreAccount[]): StoreAsset[];
  totalFiat(
    selectedAccounts?: StoreAccount[]
  ): (getAssetRate: (asset: Asset) => number | undefined) => number;
  currentAccounts(): StoreAccount[];
  assetTickers(targetAssets?: StoreAsset[]): TTicker[];
  assetUUIDs(targetAssets?: StoreAsset[]): any[];
  scanTokens(asset?: ExtendedAsset): Promise<void[]>;
  deleteAccountFromCache(uuid: string): void;
}
export const StoreContext = createContext({} as State);

// App Store that combines all data values required by the components such
// as accounts, currentAccount, tokens, and fiatValues etc.
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    accounts: rawAccounts,
    addNewTransactionToAccount,
    getAccountByAddressAndNetworkName,
    updateAccountAssets,
    deleteAccount
  } = useContext(AccountContext);
  const { assets } = useContext(AssetContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { networks } = useContext(NetworkContext);
  const [pendingTransactions, setPendingTransactions] = useState([] as ITxReceipt[]);
  // We transform rawAccounts into StoreAccount. Since the operation is exponential to the number of
  // accounts, make sure it is done only when rawAccounts change.
  const storeAccounts = useMemo(() => getStoreAccounts(rawAccounts, assets, networks), [
    rawAccounts,
    assets,
    networks
  ]);

  const [accounts, setAccounts] = useState(storeAccounts);
  const [isUnlockVIP, setIsUnlockVerified] = useState(false);
  useEffect(() => {
    setAccounts(storeAccounts);
  }, [storeAccounts]);
  // Naive polling to get the Balances of baseAsset and tokens for each account.
  useInterval(
    () => {
      getAccountsAssetsBalances(accounts)
        .then((accountsWithBalances: StoreAccount[]) => {
          // Avoid the state change if the balances are identical.
          if (isArrayEqual(accounts, accountsWithBalances)) return;
          setAccounts(accountsWithBalances);
          return accounts
            .filter(account => account.networkId === 'Ethereum')
            .filter(account => account.wallet !== WalletId.VIEW_ONLY);
        })
        .then(accountUnlockVIPDetected)
        .then(setIsUnlockVerified);
    },
    60000,
    true,
    [accounts]
  );

  useEffect(() => {
    setPendingTransactions(getPendingTransactionsFromAccounts(accounts));
  }, [accounts]);

  // A change to pending txs is detected
  useEffect(() => {
    // A pending transaction is detected.
    if (pendingTransactions.length <= 0) return;
    // This interval is used to poll for status of txs.
    const txStatusLookupInterval = setInterval(() => {
      pendingTransactions.forEach((pendingTransactionObject: ITxReceipt) => {
        const network: Network = pendingTransactionObject.network;
        // If network is not found in the pendingTransactionObject, we cannot continue.
        if (!network) return;
        const provider = new ProviderHandler(network);

        provider.getTransactionByHash(pendingTransactionObject.hash).then(transactionReceipt => {
          // Fail out if tx receipt cant be found.
          // This initial check stops us from spamming node for data before there is data to fetch.
          if (!transactionReceipt) return;
          const receipt = fromTxReceiptObj(transactionReceipt);

          // fromTxReceiptObj will return undefined if a network config could not be found with the transaction's chainId
          if (!receipt) return;

          // Get block tx success/fail and timestamp for block number, then overwrite existing tx in account.
          Promise.all([
            getTxStatus(provider, receipt.hash),
            getTimestampFromBlockNum(receipt.blockNumber, provider)
          ]).then(([txStatus, txTimestamp]) => {
            // txStatus and txTimestamp return undefined on failed lookups.
            if (!txStatus || !txTimestamp) return;
            const senderAccount =
              pendingTransactionObject.senderAccount ||
              getAccountByAddressAndNetworkName(receipt.from, pendingTransactionObject.network.id);

            addNewTransactionToAccount(senderAccount, {
              ...receipt,
              timestamp: txTimestamp,
              stage: txStatus
            });
          });
        });
      });
    }, 5 * 1000); // Period to reset interval on
    return () => clearInterval(txStatusLookupInterval);
  }, [pendingTransactions]);

  const state: State = {
    accounts,
    networks,
    isUnlockVIP,
    assets: (selectedAccounts = state.accounts) =>
      selectedAccounts.flatMap((account: StoreAccount) => account.assets),
    tokens: (selectedAssets = state.assets()) =>
      selectedAssets.filter((asset: StoreAsset) => asset.type !== 'base'),
    totals: (selectedAccounts = state.accounts) =>
      Object.values(getTotalByAsset(state.assets(selectedAccounts))),
    totalFiat: (selectedAccounts = state.accounts) => (
      getAssetRate: (asset: Asset) => number | undefined
    ) =>
      state
        .totals(selectedAccounts)
        .reduce((sum, asset) => (sum += convertToFiatFromAsset(asset, getAssetRate(asset))), 0),
    currentAccounts: () => getDashboardAccounts(state.accounts, settings.dashboardAccounts),
    assetTickers: (targetAssets = state.assets()) => [
      ...new Set(targetAssets.map(a => a.ticker as TTicker))
    ],
    assetUUIDs: (targetAssets = state.assets()) => [
      ...new Set(targetAssets.map((a: StoreAsset) => a.uuid))
    ],
    scanTokens: async (asset?: ExtendedAsset) =>
      Promise.all(
        accounts
          .map(account => updateAccountAssets(account, asset ? [...assets, asset] : assets))
          .map(p => p.catch(e => console.debug(e)))
      ),
    deleteAccountFromCache: (uuid: string) => {
      deleteAccount(uuid);
      updateSettingsAccounts(
        settings.dashboardAccounts.filter(dashboardUUID => dashboardUUID !== uuid)
      );
    }
  };

  // 1. I actually want to watch all the base and token balance for every
  // account, so the service should receive a list of accounts
  // and return an object of accounts with the updated balances.
  // 2. The store should save the updated accounts.
  // 3. The polling should run every minute.
  // ! Make sure to set the ethScan contractAddress to the correct value per network.
  // 4. With memozation.
  // 5. If it there is a change we update the store.
  // 6. At a different time we decompose accounts object and save it into LocalStorage

  // - [x] getBalances should be able to receive just address ? For AddAccount
  // - [x] getBalances network selection with fallbacks ?
  // - [x] update account.asset types
  // - [x] handle ethScan polling.
  // - [x] handle ethScan accepted networks
  // - [x] handle other networks...
  // - [x] connect to view.
  // - [ ] worry about error handling.
  // - [ ] save to local storage

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};
