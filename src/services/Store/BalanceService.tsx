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
import {
  Asset,
  Bigish,
  ExtendedAsset,
  Network,
  NetworkId,
  StoreAccount,
  StoreAsset,
  TAddress
} from '@types';
import { bigify, mapAsync } from '@utils';
import { mapObjIndexed } from '@vendor';

export type BalanceMap<T = BN> = EthScanBalanceMap<T>;

const isEthScanCompatible = (networkId: NetworkId) => ETHSCAN_NETWORKS.includes(networkId);

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

const getAddressTokenBalancesWithJsonRpc = async (
  provider: ProviderHandler,
  address: TAddress,
  tokens: Asset[]
): Promise<BalanceMap<BN>> => {
  const tokenBalances = await mapAsync(tokens, async (token) => {
    const balance = await provider.getRawTokenBalance(address, token);
    return {
      contractAddress: token.contractAddress!,
      balance
    };
  });
  const out = bigifyBalanceMap(
    tokenBalances.reduce<BalanceMap<bigint>>((balances, tokenOutput) => {
      return {
        ...balances,
        [tokenOutput.contractAddress as TAddress]: tokenOutput.balance
      };
    }, {})
  );
  return out;
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
    getAddressTokenBalancesWithJsonRpc(provider, address, tokens)
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

export const getSingleTokenBalanceForAddresses = async (
  asset: Asset | ExtendedAsset | StoreAsset,
  network: Network | undefined,
  addresses: TAddress[]
): Promise<BalanceMap<BN>> => {
  if (!network || !asset.contractAddress) {
    return {};
  }
  const providerSingleton = new ProviderHandler(network);

  if (isEthScanCompatible(network.id)) {
    const provider = ProviderHandler.fetchProvider(network);
    return getTokenBalancesFromEthScan(provider, addresses, asset.contractAddress, {
      batchSize: ETH_SCAN_BATCH_SIZE
    })
      .then(bigifyBalanceMap)
      .catch(() => ({} as BalanceMap));
  } else {
    const result = await mapAsync(addresses, (address) =>
      providerSingleton.getTokenBalance(address, asset)
    );
    return bigifyBalanceMap(toBalanceMap(addresses, result));
  }
};

export const getTokenBalancesForAddresses = async (
  assets: ExtendedAsset[],
  network: Network | undefined,
  addresses: TAddress[]
): Promise<BalanceMap<BalanceMap<BN>>> => {
  if (!network) {
    return {};
  }
  const provider = new ProviderHandler(network);
  const assetsInNetwork = assets
    .filter((x) => x.networkId === network.id)
    .filter(({ contractAddress }) => contractAddress);
  const assetAddresses = getAssetAddresses(assetsInNetwork) as string[];
  if (isEthScanCompatible(network.id)) {
    return getTokensBalances(provider, addresses, assetAddresses, {
      batchSize: ETH_SCAN_BATCH_SIZE
    })
      .then(bigifyNestedBalanceMap)
      .catch((_) => {
        return {} as BalanceMap<BalanceMap<BN>>;
      });
  } else {
    return await mapAsync(addresses, (address) =>
      getAddressTokenBalancesWithJsonRpc(provider, address, assetsInNetwork).then((d) => ({
        address,
        data: d
      }))
    ).then((d) =>
      d.reduce((acc, item) => {
        acc[item.address] = { ...acc[item.address], ...item.data };
        return acc;
      }, {} as BalanceMap<BalanceMap<BigNumber>>)
    );
  }
};

export const getBaseAssetBalancesForAddresses = async (
  addresses: string[],
  network: Network | undefined
) => {
  if (!network) {
    return {};
  }
  const providerHandler = new ProviderHandler(network);
  if (isEthScanCompatible(network.id)) {
    const provider = ProviderHandler.fetchProvider(network);
    return getEtherBalances(provider, addresses, { batchSize: ETH_SCAN_BATCH_SIZE })
      .then(bigifyBalanceMap)
      .catch(() => ({} as BalanceMap));
  } else {
    const result = await mapAsync(addresses, (address) => providerHandler.getRawBalance(address));
    return bigifyBalanceMap(toBalanceMap(addresses, result));
  }
};

export const getAssetBalance = ({
  asset,
  network,
  addresses
}: {
  asset: ExtendedAsset;
  network: Network;
  addresses: TAddress[];
}) =>
  asset.type === 'base'
    ? getBaseAssetBalancesForAddresses(addresses, network)
    : getSingleTokenBalanceForAddresses(asset, network, addresses);
