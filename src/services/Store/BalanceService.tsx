import {
  getEtherBalances,
  getTokensBalance,
  getTokenBalances as getTokenBalancesFromEthScan,
  BalanceMap as EthScanBalanceMap,
  ProviderLike
} from '@mycrypto/eth-scan';
import partition from 'lodash/partition';
import { default as BN } from 'bignumber.js';
import { bigNumberify } from 'ethers/utils';
import { BigNumber as EthScanBN } from '@ethersproject/bignumber';

import { ETHSCAN_NETWORKS, ETH_SCAN_BATCH_SIZE } from '@config';
import { TAddress, StoreAccount, StoreAsset, Asset, Network, TBN, ExtendedAsset } from '@types';
import { ProviderHandler } from '@services/EthService';

export type BalanceMap<T = BN> = EthScanBalanceMap<T>;

const getAssetAddresses = (assets: Asset[] = []): (string | undefined)[] => {
  return assets.map((a) => a.contractAddress).filter((a) => a);
};

export const convertBNToBigNumberJS = (bn: EthScanBN): BN => {
  return new BN(bn._hex);
};

export const toBigNumberJS = (balances: EthScanBalanceMap): BalanceMap => {
  return Object.fromEntries(
    Object.keys(balances).map((key) => [key, convertBNToBigNumberJS(balances[key])])
  );
};

export const nestedToBigNumberJS = (
  balances: EthScanBalanceMap<EthScanBalanceMap>
): BalanceMap<BalanceMap> => {
  return Object.fromEntries(
    Object.keys(balances).map((key) => [key, toBigNumberJS(balances[key])])
  );
};

const addBalancesToAccount = (account: StoreAccount) => ([baseBalance, tokenBalances]: [
  BalanceMap,
  BalanceMap
]) => ({
  ...account,
  assets: account.assets
    .map((asset) => {
      switch (asset.type) {
        case 'base': {
          const balance = baseBalance[account.address];
          return {
            ...asset,
            balance: balance ? balance.toString(10) : asset.balance
          };
        }
        case 'erc20': {
          const balance = tokenBalances[asset.contractAddress!];
          return {
            ...asset,
            balance: balance ? balance.toString(10) : asset.balance
          };
        }
        default:
          return asset;
      }
    })
    .map((asset) => ({ ...asset, balance: bigNumberify(asset.balance) }))
});

const getAccountAssetsBalancesWithEthScan = async (account: StoreAccount) => {
  const list = getAssetAddresses(account.assets) as string[];
  const provider = ProviderHandler.fetchProvider(account.network);
  return Promise.all([
    etherBalanceFetchWrapper(provider, account.address, { batchSize: ETH_SCAN_BATCH_SIZE }).then(
      toBigNumberJS
    ),
    tokenBalanceFetchWrapper(provider, account.address, list, {
      batchSize: ETH_SCAN_BATCH_SIZE
    }).then(toBigNumberJS)
  ])
    .then(addBalancesToAccount(account))
    .catch(() => account);
};

const etherBalanceFetchWrapper = async (
  provider: ProviderLike,
  address: string,
  options: any
): Promise<EthScanBalanceMap<EthScanBN>> => {
  try {
    const balanceMap = await getEtherBalances(provider, [address], options);
    return balanceMap;
  } catch {
    return {} as EthScanBalanceMap<EthScanBN>;
  }
};

const tokenBalanceFetchWrapper = async (
  provider: ProviderLike,
  address: string,
  contractList: string[],
  options: any
): Promise<EthScanBalanceMap<EthScanBN>> => {
  try {
    const tokenBalanceMap = await getTokensBalance(provider, address, contractList, options);
    return tokenBalanceMap;
  } catch {
    return {} as EthScanBalanceMap<EthScanBN>;
  }
};

export const getBaseAssetBalances = async (addresses: string[], network: Network | undefined) => {
  if (!network) {
    return ([] as unknown) as Promise<BalanceMap>;
  }
  const provider = ProviderHandler.fetchProvider(network);
  return getEtherBalances(provider, addresses, { batchSize: ETH_SCAN_BATCH_SIZE })
    .then(toBigNumberJS)
    .catch(() => ({} as BalanceMap));
};

export const getTokenAssetBalances = async (
  addresses: string[],
  network: Network | undefined,
  asset: ExtendedAsset
) => {
  if (!network) {
    return ([] as unknown) as Promise<BalanceMap>;
  }
  const provider = ProviderHandler.fetchProvider(network);
  return getTokenBalancesFromEthScan(provider, addresses, asset.contractAddress!)
    .then(toBigNumberJS)
    .catch(() => ({} as BalanceMap));
};

const getTokenBalances = (
  provider: ProviderHandler,
  address: TAddress,
  tokens: StoreAsset[]
): Promise<BalanceMap> => {
  return tokens
    .reduce<Promise<EthScanBalanceMap>>(async (balances, token) => {
      return {
        ...balances,
        [token.contractAddress as TAddress]: await provider.getRawTokenBalance(address, token)
      };
    }, Promise.resolve<EthScanBalanceMap>({}))
    .then(toBigNumberJS);
};

const getAccountAssetsBalancesWithJsonRPC = async (
  account: StoreAccount
): Promise<StoreAccount> => {
  const { address, assets, network } = account;
  const provider = new ProviderHandler(network);
  const tokens = assets.filter((a: StoreAsset) => a.type === 'erc20');

  return Promise.all([
    provider
      .getRawBalance(account.address)
      // @ts-ignore The types mismatch due to versioning of ethersjs
      .then(convertBNToBigNumberJS)
      // @ts-ignore The types mismatch due to versioning of ethersjs
      .then((balance) => ({ [address]: balance })),
    getTokenBalances(provider, address, tokens)
  ])
    .then(addBalancesToAccount(account))
    .catch(() => account);
};

export const getAccountsAssetsBalances = async (accounts: StoreAccount[]) => {
  // for the moment EthScan is only deployed on Ethereum, so we use JSON_RPC to get the
  // balance for the accounts on the other networks.
  const [ethScanCompatibleAccounts, jsonRPCAccounts] = partition(accounts, (account) =>
    ETHSCAN_NETWORKS.some((supportedNetwork) => account && account.networkId === supportedNetwork)
  );

  const updatedAccounts = await Promise.all(
    [
      ...ethScanCompatibleAccounts.map(getAccountAssetsBalancesWithEthScan),
      ...jsonRPCAccounts.map(getAccountAssetsBalancesWithJsonRPC)
    ].map((p) => p.catch((e) => console.debug(e))) // convert Promise.all ie. into allSettled https://dev.to/vitalets/what-s-wrong-with-promise-allsettled-and-promise-any-5e6o
  );

  const filterZeroBN = (n: TBN) => n.isZero();

  const filteredUpdatedAccounts = updatedAccounts.map((updatedAccount) => ({
    ...updatedAccount,
    assets:
      (updatedAccount &&
        updatedAccount.assets &&
        updatedAccount.assets.filter(
          ({ balance, type }) => !filterZeroBN(balance) || type === 'base'
        )) ||
      []
  }));

  return filteredUpdatedAccounts;
};

export const getAllTokensBalancesOfAccount = async (account: StoreAccount, assets: Asset[]) => {
  const provider = new ProviderHandler(account.network);
  const assetsInNetwork = assets.filter((x) => x.networkId === account.network.id);
  const assetAddresses = getAssetAddresses(assetsInNetwork) as string[];

  try {
    return tokenBalanceFetchWrapper(provider, account.address, assetAddresses, {
      batchSize: ETH_SCAN_BATCH_SIZE
    }).then(toBigNumberJS);
  } catch (err) {
    throw new Error(err);
  }
};
