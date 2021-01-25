import { BigNumber } from '@ethersproject/bignumber';
import {
  BalanceMap as EthScanBalanceMap,
  getEtherBalances,
  getTokenBalances as getTokenBalancesFromEthScan,
  getTokensBalance,
  getTokensBalances,
  ProviderLike,
  toBalanceMap
} from '@mycrypto/eth-scan';
import { default as BN } from 'bignumber.js';
import partition from 'lodash/partition';

import { ETH_SCAN_BATCH_SIZE, ETHSCAN_NETWORKS } from '@config';
import { ProviderHandler } from '@services/EthService';
import { Asset, Bigish, ExtendedAsset, Network, StoreAccount, StoreAsset, TAddress } from '@types';
import { bigify, mapAsync } from '@utils';
import { mapObjIndexed } from '@vendor';

export type BalanceMap<T = BN> = EthScanBalanceMap<T>;

const getAssetAddresses = (assets: Asset[] = []): (string | undefined)[] => {
  return assets.map((a) => a.contractAddress).filter((a) => a);
};

export const bigifyBalanceMap = (balances: EthScanBalanceMap<bigint>): BalanceMap => {
  return mapObjIndexed(bigify, balances);
};

export const bigifyNestedBalanceMap = (
  balances: EthScanBalanceMap<EthScanBalanceMap<bigint>>
): BalanceMap<BalanceMap> => {
  return mapObjIndexed(bigifyBalanceMap, balances);
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
    .map((asset) => ({ ...asset, balance: BigNumber.from(asset.balance) }))
});

const getAccountAssetsBalancesWithEthScan = async (account: StoreAccount) => {
  const list = getAssetAddresses(account.assets) as string[];
  const provider = ProviderHandler.fetchProvider(account.network);
  return Promise.all([
    etherBalanceFetchWrapper(provider, account.address, { batchSize: ETH_SCAN_BATCH_SIZE }).then(
      bigifyBalanceMap
    ),
    tokenBalanceFetchWrapper(provider, account.address, list, {
      batchSize: ETH_SCAN_BATCH_SIZE
    }).then(bigifyBalanceMap)
  ])
    .then(addBalancesToAccount(account))
    .catch(() => account);
};

const etherBalanceFetchWrapper = async (
  provider: ProviderLike,
  address: string,
  options: any
): Promise<BalanceMap<bigint>> => {
  try {
    return getEtherBalances(provider, [address], options);
  } catch {
    return {};
  }
};

const tokenBalanceFetchWrapper = async (
  provider: ProviderLike,
  address: string,
  contractList: string[],
  options: any
): Promise<BalanceMap<bigint>> => {
  try {
    return getTokensBalance(provider, address, contractList, options);
  } catch {
    return {};
  }
};

export const getBaseAssetBalances = async (addresses: string[], network: Network | undefined) => {
  if (!network) {
    return {};
  }
  const provider = ProviderHandler.fetchProvider(network);
  if (ETHSCAN_NETWORKS.includes(network.id)) {
    return getEtherBalances(provider, addresses, { batchSize: ETH_SCAN_BATCH_SIZE })
      .then(bigifyBalanceMap)
      .catch(() => ({} as BalanceMap));
  } else {
    const result = await mapAsync(addresses, (address) => provider.getBalance(address));
    return bigifyBalanceMap(toBalanceMap(addresses, result));
  }
};

export const getTokenAssetBalances = async (
  addresses: string[],
  network: Network | undefined,
  asset: ExtendedAsset
) => {
  if (!network) {
    return {};
  }
  const provider = ProviderHandler.fetchProvider(network);
  return getTokenBalancesFromEthScan(provider, addresses, asset.contractAddress!)
    .then(bigifyBalanceMap)
    .catch(() => ({} as BalanceMap));
};

const getTokenBalances = (
  provider: ProviderHandler,
  address: TAddress,
  tokens: StoreAsset[]
): Promise<BalanceMap> => {
  return tokens
    .reduce<Promise<BalanceMap<bigint>>>(async (balances, token) => {
      return {
        ...balances,
        [token.contractAddress as TAddress]: await provider.getRawTokenBalance(address, token)
      };
    }, Promise.resolve<EthScanBalanceMap>({}))
    .then(bigifyBalanceMap);
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
      .then(bigify)
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
    ].map((p) => p.catch((e) => console.debug(e)))
    // convert Promise.all ie. into allSettled https://dev.to/vitalets/what-s-wrong-with-promise-allsettled-and-promise-any-5e6o
    // When you fetch balances of account with 0 balance, updatedAccounts returns an array of 1 undefined elem `[ undefined ]`
    // filter before continuing.
  ).then((res) => res.filter(Boolean));

  const filterZeroBN = (n: Bigish) => n.isZero();

  return updatedAccounts.map((updatedAccount) => ({
    ...updatedAccount,
    assets:
      (updatedAccount &&
        updatedAccount.assets &&
        updatedAccount.assets.filter(
          ({ balance, type }) => !filterZeroBN(bigify(balance)) || type === 'base'
        )) ||
      []
  }));
};

export const getAllTokensBalancesOfAccounts = async (
  network: Network,
  addresses: string[],
  assets: Asset[]
) => {
  const provider = new ProviderHandler(network);
  const assetsInNetwork = assets.filter((x) => x.networkId === network.id);
  const assetAddresses = getAssetAddresses(assetsInNetwork) as string[];

  return getTokensBalances(provider, addresses, assetAddresses, {
    batchSize: ETH_SCAN_BATCH_SIZE
  })
    .then(bigifyNestedBalanceMap)
    .catch((_) => {
      return {} as BalanceMap<BalanceMap<BN>>;
    });
};
