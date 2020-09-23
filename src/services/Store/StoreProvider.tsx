import React, { createContext, useEffect, useMemo, useState } from 'react';

import { getUnlockTimestamps } from '@mycrypto/unlock-scan';
import { BigNumber } from 'bignumber.js';
import isEmpty from 'lodash/isEmpty';
import property from 'lodash/property';
import unionBy from 'lodash/unionBy';
import flatten from 'ramda/src/flatten';
import prop from 'ramda/src/prop';
import sortBy from 'ramda/src/sortBy';
import uniqBy from 'ramda/src/uniqBy';

import { DEFAULT_NETWORK } from '@config';
import {
  MEMBERSHIP_CONFIG,
  MEMBERSHIP_CONTRACTS,
  MembershipState,
  MembershipStatus
} from '@features/PurchaseMembership/config';
import { HistoryService, ITxHistoryApiResponse } from '@services/ApiService/History';
import { getTimestampFromBlockNum, getTxStatus, ProviderHandler } from '@services/EthService';
import { translateRaw } from '@translations';
import {
  Asset,
  Contact,
  ExtendedAsset,
  IAccount,
  IAccountAdditionData,
  IPendingTxReceipt,
  IRawAccount,
  ITxStatus,
  ITxType,
  Network,
  NetworkId,
  ReserveAsset,
  StoreAccount,
  StoreAsset,
  TAddress,
  TTicker,
  TUuid,
  WalletId
} from '@types';
import {
  convertToFiatFromAsset,
  generateDeterministicAddressUUID,
  getWeb3Config,
  isArrayEqual,
  isSameAddress,
  multiplyBNFloats,
  sortByLabel,
  useAnalytics,
  useInterval,
  weiToFloat
} from '@utils';
import { makeFinishedTxReceipt } from '@utils/transaction';
import { isEmpty as isVoid, useEffectOnce } from '@vendor';

import { ANALYTICS_CATEGORIES, MyCryptoApiService } from '../ApiService';
import { getDashboardAccounts, useAccounts } from './Account';
import {
  getAssetByTicker,
  getNewDefaultAssetTemplateByNetwork,
  getTotalByAsset,
  useAssets
} from './Asset';
import { getAccountsAssetsBalances, nestedToBigNumberJS } from './BalanceService';
import { findNextUnusedDefaultLabel, useContacts } from './Contact';
import { findMultipleNextUnusedDefaultLabels } from './Contact/helpers';
import {
  getPendingTransactionsFromAccounts,
  getStoreAccounts,
  getTxsFromAccount,
  isNotExcludedAsset
} from './helpers';
import { getNetworkById, useNetworks } from './Network';
import { useSettings } from './Settings';

export interface CoinGeckoManifest {
  [uuid: string]: string;
}

interface IAddAccount {
  address: TAddress;
  dPath: string;
}

export interface State {
  readonly defaultAccount: StoreAccount;
  readonly accounts: StoreAccount[];
  readonly networks: Network[];
  readonly isMyCryptoMember: boolean;
  readonly membershipState: MembershipState;
  readonly memberships?: MembershipStatus[];
  readonly membershipExpirations: BigNumber[];
  readonly currentAccounts: StoreAccount[];
  readonly userAssets: Asset[];
  readonly coinGeckoAssetManifest: CoinGeckoManifest;
  readonly txHistory: ITxHistoryApiResponse[];
  readonly accountRestore: { [name: string]: IAccount | undefined };
  isDefault: boolean;
  tokens(selectedAssets?: StoreAsset[]): StoreAsset[];
  assets(selectedAccounts?: StoreAccount[]): StoreAsset[];
  totals(selectedAccounts?: StoreAccount[]): StoreAsset[];
  totalFiat(
    selectedAccounts?: StoreAccount[]
  ): (getAssetRate: (asset: Asset) => number | undefined) => number;
  assetTickers(targetAssets?: StoreAsset[]): TTicker[];
  assetUUIDs(targetAssets?: StoreAsset[]): any[];
  scanAccountTokens(account: StoreAccount, asset?: ExtendedAsset): Promise<void>;
  scanTokens(asset?: ExtendedAsset): Promise<void>;
  deleteAccountFromCache(account: IAccount): void;
  restoreDeletedAccount(accountId: TUuid): void;
  addMultipleAccounts(
    networkId: NetworkId,
    walletId: WalletId | undefined,
    accounts: IAccountAdditionData[]
  ): IAccount[] | undefined;
  addAccount(
    networkId: NetworkId,
    address: string,
    accountType: WalletId | undefined,
    dPath: string
  ): IRawAccount | undefined;
  getAssetByTicker(ticker: TTicker): Asset | undefined;
  getAccount(a: IRawAccount): StoreAccount | undefined;
  getDeFiAssetReserveAssets(
    asset: StoreAsset
  ): (
    getPoolAssetReserveRate: (poolTokenUUID: string, assets: Asset[]) => ReserveAsset[]
  ) => StoreAsset[];
  scanForMemberships(accounts: StoreAccount[]): void;
}
export const StoreContext = createContext({} as State);

// App Store that combines all data values required by the components such
// as accounts, currentAccount, tokens, and fiatValues etc.
export const StoreProvider: React.FC = ({ children }) => {
  const {
    accounts: rawAccounts,
    addTxToAccount,
    removeTxFromAccount,
    getAccountByAddressAndNetworkName,
    updateAccountAssets,
    updateAllAccountsAssets,
    updateAccounts,
    deleteAccount,
    createAccountWithID,
    createMultipleAccountsWithIDs
  } = useAccounts();
  const { assets, addAssetsFromAPI } = useAssets();
  const { settings, updateSettingsAccounts } = useSettings();
  const { networks } = useNetworks();
  const { createContact, contacts, getContactByAddressAndNetworkId, updateContact } = useContacts();

  const [accountRestore, setAccountRestore] = useState<{ [name: string]: IAccount | undefined }>(
    {}
  );

  const [pendingTransactions, setPendingTransactions] = useState([] as IPendingTxReceipt[]);
  // We transform rawAccounts into StoreAccount. Since the operation is exponential to the number of
  // accounts, make sure it is done only when rawAccounts change.
  const accounts = useMemo(() => getStoreAccounts(rawAccounts, assets, networks, contacts), [
    rawAccounts,
    assets,
    contacts,
    networks
  ]);
  const currentAccounts = useMemo(
    () => getDashboardAccounts(accounts, settings.dashboardAccounts),
    [rawAccounts, settings.dashboardAccounts, assets]
  );

  const [memberships, setMemberships] = useState<MembershipStatus[] | undefined>([]);

  const membershipExpirations = memberships
    ? flatten(
        Object.values(memberships).map((m) => Object.values(m.memberships).map((e) => e.expiry))
      )
    : [];

  const membershipState = (() => {
    if (!memberships) {
      return MembershipState.ERROR;
    } else if (Object.values(memberships).length === 0) {
      return MembershipState.NOTMEMBER;
    } else {
      const currentTime = new BigNumber(Math.round(Date.now() / 1000));
      if (
        membershipExpirations.some((expirationTime) => expirationTime.isGreaterThan(currentTime))
      ) {
        return MembershipState.MEMBER;
      } else {
        return MembershipState.EXPIRED;
      }
    }
  })();
  const isMyCryptoMember = membershipState === MembershipState.MEMBER;

  // Naive polling to get the Balances of baseAsset and tokens for each account.
  useInterval(
    () => {
      // Pattern to cancel setState call if ever the component is unmounted
      // before the async requests completes.
      // @todo: extract into seperate hook e.g. react-use
      // https://www.robinwieruch.de/react-hooks-fetch-data
      let isMounted = true;
      getAccountsAssetsBalances(currentAccounts).then((accountsWithBalances: StoreAccount[]) => {
        // Avoid the state change if the balances are identical.
        if (isMounted && !isArrayEqual(currentAccounts, accountsWithBalances.filter(Boolean))) {
          updateAccounts(accountsWithBalances);
        }
      });

      return () => {
        isMounted = false;
      };
    },
    60000,
    true,
    [currentAccounts]
  );

  // Utility method to scan and populate memberships list
  const scanForMemberships = (accountToScan?: StoreAccount[]) => {
    const relevantAccounts = (accountToScan ? accountToScan : currentAccounts)
      .filter((account) => account.networkId === DEFAULT_NETWORK)
      .filter((account) => account.wallet !== WalletId.VIEW_ONLY);
    const network = networks.find(({ id }) => DEFAULT_NETWORK === id);
    if (!network || relevantAccounts.length === 0) return;
    const provider = new ProviderHandler(network);
    getUnlockTimestamps(
      provider,
      relevantAccounts.map((account) => account.address),
      {
        contracts: Object.values(MEMBERSHIP_CONFIG).map((membership) => membership.contractAddress)
      }
    )
      .catch(() => {
        setMemberships(undefined);
      })
      .then(nestedToBigNumberJS)
      .then((expiries) => {
        const newMemberships = Object.keys(expiries)
          .map((address: TAddress) => ({
            address,
            memberships: Object.keys(expiries[address])
              .filter((contract) => expiries[address][contract].isGreaterThan(new BigNumber(0)))
              .map((contract) => ({
                type: MEMBERSHIP_CONTRACTS[contract],
                expiry: expiries[address][contract]
              }))
          }))
          .filter((m) => m.memberships.length > 0);
        setMemberships(
          unionBy(newMemberships, memberships ? memberships : [], property('address'))
        );
      });
  };

  useAnalytics({
    category: ANALYTICS_CATEGORIES.ROOT,
    actionName: accounts.length === 0 ? 'New User' : 'Returning User',
    eventParams: {
      visitStartAccountNumber: accounts.length
    },
    triggerOnMount: true
  });

  useEffectOnce(() => {
    scanForMemberships();
  });

  useEffect(() => {
    setPendingTransactions(getPendingTransactionsFromAccounts(currentAccounts));
  }, [currentAccounts]);

  // fetch assets from api
  useEffect(() => {
    MyCryptoApiService.instance.getAssets().then(addAssetsFromAPI);
  }, [assets.length]);

  // A change to pending txs is detected
  useEffect(() => {
    if (pendingTransactions.length === 0) return;
    // A pending transaction is detected.
    let isMounted = true;
    // This interval is used to poll for status of txs.
    const txStatusLookupInterval = setInterval(() => {
      pendingTransactions.forEach((pendingTxReceipt) => {
        const senderAccount = getAccountByAddressAndNetworkName(
          pendingTxReceipt.from,
          pendingTxReceipt.asset.networkId
        );
        if (!senderAccount) return;

        const storeAccount = accounts.find((acc) =>
          isSameAddress(senderAccount.address, acc.address)
        ) as StoreAccount;

        const txs = getTxsFromAccount([storeAccount]);
        const overwritingTx = txs.find(
          (t) =>
            t.nonce === pendingTxReceipt.nonce &&
            t.asset.networkId === pendingTxReceipt.asset.networkId &&
            t.hash !== pendingTxReceipt.hash &&
            t.status === ITxStatus.SUCCESS
        );

        if (overwritingTx) {
          removeTxFromAccount(senderAccount, pendingTxReceipt);
          return;
        }

        const network = getNetworkById(pendingTxReceipt.asset.networkId, networks);
        // If network is not found in the pendingTransactionObject, we cannot continue.
        if (!network) return;
        const provider = new ProviderHandler(network);

        provider.getTransactionByHash(pendingTxReceipt.hash).then((txResponse) => {
          // Fail out if tx receipt cant be found.
          // This initial check stops us from spamming node for data before there is data to fetch.
          if (!txResponse || !txResponse.blockNumber) return;

          // Get block tx success/fail and timestamp for block number, then overwrite existing tx in account.
          Promise.all([
            getTxStatus(provider, pendingTxReceipt.hash),
            getTimestampFromBlockNum(txResponse.blockNumber, provider)
          ]).then(([txStatus, txTimestamp]) => {
            // txStatus and txTimestamp return undefined on failed lookups.
            if (!isMounted || !txStatus || !txTimestamp) return;

            const finishedTxReceipt = makeFinishedTxReceipt(
              pendingTxReceipt,
              txStatus,
              txTimestamp,
              txResponse.blockNumber
            );
            addTxToAccount(senderAccount, finishedTxReceipt);
            if (finishedTxReceipt.txType === ITxType.DEFIZAP) {
              state.scanAccountTokens(storeAccount);
            } else if (finishedTxReceipt.txType === ITxType.PURCHASE_MEMBERSHIP) {
              scanForMemberships([storeAccount]);
            }
          });
        });
      });
    }, 5 * 1000); // Period to reset interval on
    return () => {
      isMounted = false;
      clearInterval(txStatusLookupInterval);
    };
  }, [pendingTransactions]);

  const coinGeckoAssetManifest =
    assets.reduce((manifest, asset) => {
      if (asset && asset.mappings && asset.mappings.coinGeckoId) {
        return { ...manifest, [asset.uuid]: asset.mappings.coinGeckoId };
      }
      return manifest;
    }, {}) || {};

  // TX HISTORY
  const [txHistory, setTxHistory] = useState<ITxHistoryApiResponse[]>([]);

  const mainnetAccounts = accounts
    .filter((a) => a.networkId === DEFAULT_NETWORK)
    .map((a) => a.address);

  useEffect(() => {
    if (mainnetAccounts.length > 0) {
      HistoryService.instance.getHistory(mainnetAccounts).then((history) => {
        if (history !== null) {
          setTxHistory(history);
        }
      });
    }
  }, [mainnetAccounts.length]);

  const state: State = {
    accounts,
    networks,
    isMyCryptoMember,
    membershipState,
    memberships,
    membershipExpirations,
    currentAccounts,
    accountRestore,
    coinGeckoAssetManifest,
    txHistory,
    get defaultAccount() {
      return sortByLabel(state.accounts)[0];
    },
    /**
     * Check if the user has already added an account to our persistence layer.
     */
    get isDefault() {
      return (
        (!state.accounts || isVoid(state.accounts)) && (!isVoid(contacts) || contacts.length < 1)
      );
    },
    get userAssets() {
      const userAssets = state.accounts
        .filter((a: StoreAccount) => a.wallet !== WalletId.VIEW_ONLY)
        .flatMap((a: StoreAccount) => a.assets)
        .filter(isNotExcludedAsset(settings.excludedAssets));
      const uniq = uniqBy(prop('uuid'), userAssets);
      return sortBy(prop('ticker'), uniq);
    },
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
        .reduce(
          (sum, asset) => (sum += parseFloat(convertToFiatFromAsset(asset, getAssetRate(asset)))),
          0
        ),

    assetTickers: (targetAssets = state.assets()) => [
      ...new Set(targetAssets.map((a) => a.ticker))
    ],
    assetUUIDs: (targetAssets = state.assets()) => {
      return [...new Set(targetAssets.map((a: StoreAsset) => a.uuid))];
    },
    scanAccountTokens: async (account: StoreAccount, asset?: ExtendedAsset) =>
      updateAccountAssets(account, asset ? [...assets, asset] : assets),
    scanTokens: async (asset?: ExtendedAsset) =>
      updateAllAccountsAssets(accounts, asset ? [...assets, asset] : assets),
    deleteAccountFromCache: (account) => {
      setAccountRestore((prevState) => ({ ...prevState, [account.uuid]: account }));
      deleteAccount(account);
      updateSettingsAccounts(
        settings.dashboardAccounts.filter((dashboardUUID) => dashboardUUID !== account.uuid)
      );
      setMemberships((prevState) => prevState?.filter((s) => s.address !== account.address));
    },
    restoreDeletedAccount: (accountId) => {
      const account = accountRestore[accountId];
      if (isEmpty(account)) {
        throw new Error('Unable to restore account! No account with id specified.');
      }

      const { uuid, ...restAccount } = account!;
      createAccountWithID(uuid, restAccount);
      setAccountRestore((prevState) => ({ ...prevState, [uuid]: undefined }));
    },
    addMultipleAccounts: (
      networkId: NetworkId,
      accountType: WalletId | undefined,
      newAccounts: IAddAccount[]
    ) => {
      const network: Network | undefined = getNetworkById(networkId, networks);
      if (!network || newAccounts.length === 0) return;
      const accountsToAdd = newAccounts.filter(
        ({ address }) => !getAccountByAddressAndNetworkName(address, networkId)
      );
      const walletType =
        accountType! === WalletId.WEB3 ? WalletId[getWeb3Config().id] : accountType!;
      const newAsset: Asset = getNewDefaultAssetTemplateByNetwork(assets)(network);
      const newRawAccounts = accountsToAdd.map(({ address, dPath }) => ({
        address,
        networkId,
        wallet: walletType,
        dPath,
        assets: [{ uuid: newAsset.uuid, balance: '0', mtime: Date.now() }],
        transactions: [],
        favorite: false,
        mtime: 0,
        uuid: generateDeterministicAddressUUID(networkId, address)
      }));
      if (newRawAccounts.length === 0) return;
      const newLabels = findMultipleNextUnusedDefaultLabels(
        newRawAccounts[0].wallet,
        newRawAccounts.length
      )(contacts);
      newRawAccounts.forEach((rawAccount, idx) => {
        const existingContact = getContactByAddressAndNetworkId(rawAccount.address, networkId);
        if (existingContact && existingContact.label === translateRaw('NO_LABEL')) {
          updateContact(existingContact.uuid, {
            ...existingContact,
            label: newLabels[idx]
          });
        } else if (!existingContact) {
          const newLabel: Contact = {
            label: newLabels[idx],
            address: rawAccount.address,
            notes: '',
            network: rawAccount.networkId
          };
          createContact(newLabel);
        }
      });
      createMultipleAccountsWithIDs(newRawAccounts);
      return newRawAccounts;
    },
    addAccount: (
      networkId: NetworkId,
      address: TAddress,
      accountType: WalletId | undefined,
      dPath: string
    ) => {
      const network: Network | undefined = getNetworkById(networkId, networks);
      if (!network || !address || !!getAccountByAddressAndNetworkName(address, networkId)) return;

      const walletType =
        accountType! === WalletId.WEB3 ? WalletId[getWeb3Config().id] : accountType!;
      const newAsset: Asset = getNewDefaultAssetTemplateByNetwork(assets)(network);
      const accountUUID = generateDeterministicAddressUUID(networkId, address);
      const account: IRawAccount = {
        address,
        networkId,
        wallet: walletType,
        dPath,
        assets: [{ uuid: newAsset.uuid, balance: '0', mtime: Date.now() }],
        transactions: [],
        favorite: false,
        mtime: 0
      };

      const existingContact = getContactByAddressAndNetworkId(account.address, networkId);
      if (existingContact) {
        updateContact(existingContact.uuid, {
          ...existingContact,
          label: findNextUnusedDefaultLabel(account.wallet)(contacts)
        });
      } else {
        const newLabel: Contact = {
          label: findNextUnusedDefaultLabel(account.wallet)(contacts),
          address: account.address,
          notes: '',
          network: account.networkId
        };
        createContact(newLabel);
      }
      createAccountWithID(accountUUID, account);

      return account;
    },
    getAssetByTicker: getAssetByTicker(assets),
    getAccount: ({ address, networkId }) =>
      accounts.find((a) => isSameAddress(a.address, address) && a.networkId === networkId),
    getDeFiAssetReserveAssets: (poolAsset: StoreAsset) => (
      getPoolAssetReserveRate: (poolTokenUuid: string, assets: Asset[]) => ReserveAsset[]
    ) =>
      getPoolAssetReserveRate(poolAsset.uuid, assets).map((reserveAsset) => ({
        ...reserveAsset,
        balance: multiplyBNFloats(
          weiToFloat(poolAsset.balance, poolAsset.decimal).toString(),
          reserveAsset.reserveExchangeRate
        ),
        mtime: Date.now()
      })),
    scanForMemberships
  };

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};
