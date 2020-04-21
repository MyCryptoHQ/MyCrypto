import React, { useState, useContext, useMemo, createContext, useEffect } from 'react';
import * as R from 'ramda';
import isEmpty from 'lodash/isEmpty';

import {
  TAddress,
  IRawAccount,
  StoreAccount,
  StoreAsset,
  Network,
  TTicker,
  ExtendedAsset,
  IAccount,
  WalletId,
  Asset,
  ITxReceipt,
  NetworkId,
  AddressBook,
  ITxType
} from 'v2/types';
import {
  isArrayEqual,
  useInterval,
  convertToFiatFromAsset,
  fromTxReceiptObj,
  getWeb3Config,
  multiplyBNFloats,
  weiToFloat,
  generateAccountUUID
} from 'v2/utils';
import { ReserveAsset } from 'v2/types/asset';
import { ProviderHandler, getTxStatus, getTimestampFromBlockNum } from 'v2/services/EthService';
import { UnlockProtocolHandler } from 'v2/services/EthService/network';
import {
  MembershipStatus,
  MEMBERSHIP_CONFIG,
  MembershipState
} from 'v2/features/PurchaseMembership/config';
import { DEFAULT_NETWORK } from 'v2/config';
import { TUuid } from 'v2/types/uuid';

import { getAccountsAssetsBalances, accountMembershipDetected } from './BalanceService';
import { getStoreAccounts, getPendingTransactionsFromAccounts } from './helpers';
import {
  AssetContext,
  getTotalByAsset,
  getAssetByTicker,
  getNewDefaultAssetTemplateByNetwork
} from './Asset';
import { AccountContext, getDashboardAccounts } from './Account';
import { SettingsContext } from './Settings';
import { NetworkContext, getNetworkById } from './Network';
import { findNextUnusedDefaultLabel, AddressBookContext } from './AddressBook';

interface State {
  readonly accounts: StoreAccount[];
  readonly networks: Network[];
  readonly isMyCryptoMember: boolean;
  readonly membershipState: MembershipState;
  readonly memberships?: MembershipStatus[];
  readonly membershipExpiration: number[];
  readonly currentAccounts: StoreAccount[];
  readonly userAssets: Asset[];
  readonly accountRestore: { [name: string]: IAccount | undefined };
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
  addAccount(
    networkId: NetworkId,
    address: string,
    accountType: WalletId | undefined,
    dPath: string
  ): IRawAccount | undefined;
  getAssetByTicker(symbol: string): Asset | undefined;
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
    addNewTransactionToAccount,
    getAccountByAddressAndNetworkName,
    updateAccountAssets,
    updateAllAccountsAssets,
    updateAccountsBalances,
    deleteAccount,
    createAccountWithID
  } = useContext(AccountContext);
  const { assets } = useContext(AssetContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { networks } = useContext(NetworkContext);
  const {
    createAddressBooks: createContact,
    addressBook: contacts,
    getContactByAddressAndNetworkId,
    updateAddressBooks: updateContact
  } = useContext(AddressBookContext);

  const [accountRestore, setAccountRestore] = useState<{ [name: string]: IAccount | undefined }>(
    {}
  );

  const [pendingTransactions, setPendingTransactions] = useState([] as ITxReceipt[]);
  const [membershipExpiration, setMembershipExpiration] = useState([] as number[]);
  const [isScanTokenRequested, setIsScanTokenRequested] = useState(false);
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
    [rawAccounts, settings.dashboardAccounts]
  );

  const [memberships, setMemberships] = useState<MembershipStatus[] | undefined>([]);

  const membershipState = (() => {
    if (memberships) {
      return Object.values(memberships).length > 0
        ? MembershipState.MEMBER
        : MembershipState.NOTMEMBER;
    }
    return MembershipState.ERROR;
  })();
  const isMyCryptoMember = membershipState === MembershipState.MEMBER;

  // Naive polling to get the Balances of baseAsset and tokens for each account.
  useInterval(
    () => {
      // Pattern to cancel setState call if ever the component is unmounted
      // before the async requests completes.
      // @TODO: extract into seperate hook e.g. react-use
      // https://www.robinwieruch.de/react-hooks-fetch-data
      let isMounted = true;
      getAccountsAssetsBalances(currentAccounts)
        .then((accountsWithBalances: StoreAccount[]) => {
          // Avoid the state change if the balances are identical.
          if (isMounted && !isArrayEqual(currentAccounts, accountsWithBalances.filter(Boolean))) {
            updateAccountsBalances(accountsWithBalances);
          }
          return currentAccounts
            .filter((account) => account.networkId === DEFAULT_NETWORK)
            .filter((account) => account.wallet !== WalletId.VIEW_ONLY);
        })
        .then(accountMembershipDetected)
        .then((e) => {
          if (!isMounted) return;
          setMemberships(e as MembershipStatus[]);
        });

      return () => {
        isMounted = false;
      };
    },
    60000,
    true,
    [currentAccounts]
  );

  useEffect(() => {
    if (!memberships || memberships.length === 0) return;
    const network = networks.find(({ id }) => DEFAULT_NETWORK === id);
    if (!network) return;
    const unlockProvider = new UnlockProtocolHandler(network);
    const membershipLookups = R.flatten(
      memberships.map((membership) =>
        membership.memberships.map((membershipId) => {
          const membershipConfig = MEMBERSHIP_CONFIG[membershipId];
          return { account: membership.address, lockAddress: membershipConfig.contractAddress };
        })
      )
    );

    Promise.all(
      membershipLookups.map((membershipLookupObj) =>
        unlockProvider.fetchUnlockKeyExpiration(
          membershipLookupObj.account,
          membershipLookupObj.lockAddress
        )
      )
    )
      .then((data) => {
        setMembershipExpiration(data);
      })
      .catch((e) => console.debug('[MembershipExpirationPolling]: Err: ', e));
  }, [memberships]);

  useEffect(() => {
    setPendingTransactions(getPendingTransactionsFromAccounts(currentAccounts));
  }, [currentAccounts]);

  // A change to pending txs is detected
  useEffect(() => {
    if (pendingTransactions.length === 0) return;
    // A pending transaction is detected.
    let isMounted = true;
    // This interval is used to poll for status of txs.
    const txStatusLookupInterval = setInterval(() => {
      pendingTransactions.forEach((pendingTransactionObject: ITxReceipt) => {
        const network: Network = pendingTransactionObject.network;
        // If network is not found in the pendingTransactionObject, we cannot continue.
        if (!network) return;
        const provider = new ProviderHandler(network);

        provider.getTransactionByHash(pendingTransactionObject.hash).then((transactionReceipt) => {
          // Fail out if tx receipt cant be found.
          // This initial check stops us from spamming node for data before there is data to fetch.
          if (!transactionReceipt) return;
          const receipt = fromTxReceiptObj(transactionReceipt)(assets, networks);

          // fromTxReceiptObj will return undefined if a network config could not be found with the transaction's chainId
          if (!receipt) return;

          // Get block tx success/fail and timestamp for block number, then overwrite existing tx in account.
          Promise.all([
            getTxStatus(provider, receipt.hash),
            getTimestampFromBlockNum(receipt.blockNumber, provider)
          ]).then(([txStatus, txTimestamp]) => {
            // txStatus and txTimestamp return undefined on failed lookups.
            if (!isMounted || !txStatus || !txTimestamp) return;
            const senderAccount =
              pendingTransactionObject.senderAccount ||
              getAccountByAddressAndNetworkName(receipt.from, pendingTransactionObject.network.id);

            addNewTransactionToAccount(senderAccount, {
              ...receipt,
              txType: pendingTransactionObject.txType || ITxType.STANDARD,
              timestamp: txTimestamp,
              stage: txStatus
            });
            if (pendingTransactionObject.txType === ITxType.DEFIZAP) {
              setIsScanTokenRequested(true);
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

  useEffect(() => {
    if (!isScanTokenRequested) return;
    state.scanTokens();
    setIsScanTokenRequested(false);
  }, [isScanTokenRequested]);

  const state: State = {
    accounts,
    networks,
    isMyCryptoMember,
    membershipState,
    memberships,
    membershipExpiration,
    currentAccounts,
    accountRestore,
    get userAssets() {
      const userAssets = state.accounts
        .filter((a: StoreAccount) => a.wallet !== WalletId.VIEW_ONLY)
        .flatMap((a: StoreAccount) => a.assets);
      const uniq = R.uniqBy(R.prop('uuid'), userAssets);
      return R.sortBy(R.prop('ticker'), uniq);
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
        .reduce((sum, asset) => (sum += convertToFiatFromAsset(asset, getAssetRate(asset))), 0),

    assetTickers: (targetAssets = state.assets()) => [
      ...new Set(targetAssets.map((a) => a.ticker as TTicker))
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
    },
    restoreDeletedAccount: (accountId) => {
      const account = accountRestore[accountId];
      if (isEmpty(account)) {
        throw new Error('Unable to restore account! No account with id specified.');
      }

      const { uuid, ...restAccount } = account!;
      createAccountWithID(restAccount, uuid);
      setAccountRestore((prevState) => ({ ...prevState, [uuid]: undefined }));
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
      const accountUUID = generateAccountUUID(networkId, address);
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
        const newLabel: AddressBook = {
          label: findNextUnusedDefaultLabel(account.wallet)(contacts),
          address: account.address,
          notes: '',
          network: account.networkId
        };
        createContact(newLabel);
      }
      createAccountWithID(account, accountUUID);

      return account;
    },
    getAssetByTicker: getAssetByTicker(assets),
    getAccount: ({ address, networkId }) =>
      accounts.find((a) => a.address === address && a.networkId === networkId),
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
