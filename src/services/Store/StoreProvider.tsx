import React, { createContext, useEffect, useMemo, useState } from 'react';

import isEmpty from 'lodash/isEmpty';
import prop from 'ramda/src/prop';
import sortBy from 'ramda/src/sortBy';
import uniqBy from 'ramda/src/uniqBy';

import { DEFAULT_NETWORK } from '@config';
import { MembershipState, MembershipStatus } from '@features/PurchaseMembership/config';
import { makeFinishedTxReceipt } from '@helpers';
import { useAnalytics } from '@hooks';
import { ENSService, isEthereumAccount } from '@services';
import { HistoryService, ITxHistoryApiResponse } from '@services/ApiService/History';
import { UniClaimResult } from '@services/ApiService/Uniswap/Uniswap';
import { getTimestampFromBlockNum, getTxStatus, ProviderHandler } from '@services/EthService';
import {
  deleteMembership,
  fetchAssets,
  fetchMemberships,
  getMemberships,
  getMembershipState,
  isMyCryptoMember,
  scanTokens,
  useDispatch,
  useSelector
} from '@store';
import { translateRaw } from '@translations';
import {
  Asset,
  DomainNameRecord,
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
  generateUUID,
  getAccountsInNetwork,
  getWeb3Config,
  isArrayEqual,
  isSameAddress,
  multiplyBNFloats,
  sortByLabel,
  useInterval,
  weiToFloat
} from '@utils';
import { isEmpty as isVoid, useEffectOnce } from '@vendor';

import { ANALYTICS_CATEGORIES, UniswapService } from '../ApiService';
import { getDashboardAccounts, useAccounts } from './Account';
import {
  getAssetByTicker,
  getNewDefaultAssetTemplateByNetwork,
  getTotalByAsset,
  useAssets
} from './Asset';
import { getAccountsAssetsBalances } from './BalanceService';
import { useContacts } from './Contact';
import { findMultipleNextUnusedDefaultLabels } from './Contact/helpers';
import {
  getPendingTransactionsFromAccounts,
  getStoreAccounts,
  getTxsFromAccount,
  isNotExcludedAsset,
  isTokenMigration
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
  readonly accounts: StoreAccount[];
  readonly networks: Network[];
  readonly isMyCryptoMember: boolean;
  readonly membershipState: MembershipState;
  readonly memberships?: MembershipStatus[];
  readonly currentAccounts: StoreAccount[];
  readonly userAssets: Asset[];
  readonly coinGeckoAssetManifest: CoinGeckoManifest;
  readonly txHistory: ITxHistoryApiResponse[];
  readonly uniClaims: UniClaimResult[];
  readonly ensOwnershipRecords: DomainNameRecord[];
  readonly isEnsFetched: boolean;
  readonly accountRestore: { [name: string]: IAccount | undefined };
  isDefault: boolean;
  getDefaultAccount(networkId?: NetworkId): StoreAccount;
  tokens(selectedAssets?: StoreAsset[]): StoreAsset[];
  assets(selectedAccounts?: StoreAccount[]): StoreAsset[];
  totals(selectedAccounts?: StoreAccount[]): StoreAsset[];
  totalFiat(
    selectedAccounts?: StoreAccount[]
  ): (getAssetRate: (asset: Asset) => number | undefined) => number;
  assetTickers(targetAssets?: StoreAsset[]): TTicker[];
  assetUUIDs(targetAssets?: StoreAsset[]): any[];
  deleteAccountFromCache(account: IAccount): void;
  restoreDeletedAccount(accountId: TUuid): void;
  addMultipleAccounts(
    networkId: NetworkId,
    walletId: WalletId | undefined,
    accounts: IAccountAdditionData[]
  ): IAccount[] | undefined;
  getAssetByTicker(ticker: TTicker): Asset | undefined;
  getAccount(a: IRawAccount): StoreAccount | undefined;
  getDeFiAssetReserveAssets(
    asset: StoreAsset
  ): (
    getPoolAssetReserveRate: (poolTokenUUID: string, assets: Asset[]) => ReserveAsset[]
  ) => StoreAsset[];
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
    updateAccounts,
    deleteAccount,
    createAccountWithID,
    createMultipleAccountsWithIDs
  } = useAccounts();
  const { assets } = useAssets();
  const { settings, updateSettingsAccounts } = useSettings();
  const { networks } = useNetworks();
  const { createContact, contacts, getContactByAddressAndNetworkId, updateContact } = useContacts();
  const dispatch = useDispatch();
  const memberships = useSelector(getMemberships);
  const membershipState = useSelector(getMembershipState);

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

  // Naive polling to get the Balances of baseAsset and tokens for each account.
  useInterval(
    () => {
      // Pattern to cancel setState call if ever the component is unmounted
      // before the async requests completes.
      // @todo: extract into seperate hook e.g. react-use
      // https://www.robinwieruch.de/react-hooks-fetch-data
      if (isVoid(networks)) return;
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
    [networks]
  );

  useAnalytics({
    category: ANALYTICS_CATEGORIES.ROOT,
    actionName: accounts.length === 0 ? 'New User' : 'Returning User',
    eventParams: {
      visitStartAccountNumber: accounts.length
    },
    triggerOnMount: true
  });

  useEffectOnce(() => {
    dispatch(fetchMemberships());
  });

  useEffect(() => {
    setPendingTransactions(getPendingTransactionsFromAccounts(currentAccounts));
  }, [currentAccounts]);

  // fetch assets from api
  useEffectOnce(() => {
    dispatch(fetchAssets());
  });

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
            if (
              finishedTxReceipt.txType === ITxType.DEFIZAP ||
              isTokenMigration(finishedTxReceipt.txType)
            ) {
              dispatch(scanTokens({ accounts: [storeAccount] }));
            } else if (finishedTxReceipt.txType === ITxType.PURCHASE_MEMBERSHIP) {
              dispatch(fetchMemberships([storeAccount]));
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

  // Uniswap UNI token claims
  const [uniClaims, setUniClaims] = useState<UniClaimResult[]>([]);

  useEffect(() => {
    if (mainnetAccounts.length > 0) {
      HistoryService.instance.getHistory(mainnetAccounts).then((history) => {
        if (history !== null) {
          setTxHistory(history);
        }
      });

      UniswapService.instance.getClaims(mainnetAccounts).then((rawClaims) => {
        if (rawClaims !== null) {
          UniswapService.instance
            .isClaimed(networks.find((n) => n.id === DEFAULT_NETWORK)!, rawClaims)
            .then((claims) => {
              setUniClaims(claims);
            });
        }
      });
    }
  }, [mainnetAccounts.length]);

  const [ensOwnershipRecords, setEnsOwnershipRecords] = useState<DomainNameRecord[]>(
    [] as DomainNameRecord[]
  );
  const [isEnsFetched, setIsEnsFetched] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setEnsOwnershipRecords(
        await ENSService.fetchOwnershipRecords(accounts.filter(isEthereumAccount))
      );
      setIsEnsFetched(true);
    })();
  }, [accounts.length]);

  const state: State = {
    accounts,
    networks,
    isMyCryptoMember: useSelector(isMyCryptoMember),
    membershipState,
    memberships,
    currentAccounts,
    accountRestore,
    coinGeckoAssetManifest,
    txHistory,
    uniClaims,
    ensOwnershipRecords,
    isEnsFetched,
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
    getDefaultAccount: (networkId?: NetworkId) =>
      sortByLabel(getAccountsInNetwork(accounts, networkId || DEFAULT_NETWORK))[0],
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
    deleteAccountFromCache: (account) => {
      setAccountRestore((prevState) => ({ ...prevState, [account.uuid]: account }));
      deleteAccount(account);
      updateSettingsAccounts(
        settings.dashboardAccounts.filter((dashboardUUID) => dashboardUUID !== account.uuid)
      );
      dispatch(deleteMembership(account.address));
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
          updateContact({
            ...existingContact,
            label: newLabels[idx]
          });
        } else if (!existingContact) {
          const newLabel = {
            label: newLabels[idx],
            address: rawAccount.address,
            notes: '',
            network: rawAccount.networkId,
            uuid: generateUUID()
          };
          createContact(newLabel);
        }
      });
      createMultipleAccountsWithIDs(newRawAccounts);
      return newRawAccounts;
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
      }))
  };

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
