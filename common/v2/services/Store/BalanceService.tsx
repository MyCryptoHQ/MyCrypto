import {
  getEtherBalances,
  getTokensBalance,
  getTokenBalances as getTokenBalancesFromEthScan,
  getTokensBalances,
  BalanceMap as EthScanBalanceMap
} from '@mycrypto/eth-scan';
import partition from 'lodash/partition';
import { default as BN } from 'bignumber.js';
import { bigNumberify } from 'ethers/utils';
import { BigNumber as EthScanBN } from '@ethersproject/bignumber';

import { ETHSCAN_NETWORKS } from 'v2/config';
import { TAddress, StoreAccount, StoreAsset, Asset, Network } from 'v2/types';
import { ProviderHandler } from 'v2/services/EthService';
import { MEMBERSHIP_CONFIG, MEMBERSHIP_CONTRACTS } from 'v2/features/PurchaseMembership/config';

export type BalanceMap<T = BN> = EthScanBalanceMap<T>;

const getAssetAddresses = (assets: Asset[] = []): (string | undefined)[] => {
  return assets.map(a => a.contractAddress).filter(a => a);
};

const convertBNToBigNumberJS = (bn: EthScanBN): BN => {
  return new BN(bn._hex);
};

const toBigNumberJS = (balances: EthScanBalanceMap): BalanceMap => {
  return Object.fromEntries(
    Object.keys(balances).map(key => [key, convertBNToBigNumberJS(balances[key])])
  );
};

const nestedToBigNumberJS = (
  balances: EthScanBalanceMap<EthScanBalanceMap>
): BalanceMap<BalanceMap> => {
  return Object.fromEntries(Object.keys(balances).map(key => [key, toBigNumberJS(balances[key])]));
};

const addBalancesToAccount = (account: StoreAccount) => ([baseBalance, tokenBalances]: [
  BalanceMap,
  BalanceMap
]) => ({
  ...account,
  assets: account.assets
    .map(asset => {
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
    .map(asset => ({ ...asset, balance: bigNumberify(asset.balance) }))
});

const getAccountAssetsBalancesWithEthScan = async (account: StoreAccount) => {
  const list = getAssetAddresses(account.assets) as string[];
  const provider = ProviderHandler.fetchProvider(account.network);
  return Promise.all([
    getEtherBalances(provider, [account.address]).then(toBigNumberJS),
    getTokensBalance(provider, account.address, list).then(toBigNumberJS)
  ])
    .then(addBalancesToAccount(account))
    .catch(_ => account);
};

export const getBaseAssetBalances = async (addresses: string[], network: Network | undefined) => {
  if (!network) {
    return ([] as unknown) as BalanceMap;
  }
  const provider = ProviderHandler.fetchProvider(network);
  return getEtherBalances(provider, addresses)
    .then(data => {
      return data;
    })
    .catch(_ => ([] as unknown) as BalanceMap);
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
      .then(balance => ({ [address]: balance })),
    getTokenBalances(provider, address, tokens)
  ])
    .then(addBalancesToAccount(account))
    .catch(_ => account);
};

export const getAccountsAssetsBalances = async (accounts: StoreAccount[]) => {
  // for the moment EthScan is only deployed on Ethereum, so we use JSON_RPC to get the
  // balance for the accounts on the other networks.
  const [ethScanCompatibleAccounts, jsonRPCAccounts] = partition(accounts, account =>
    ETHSCAN_NETWORKS.some(supportedNetwork => account && account.networkId === supportedNetwork)
  );

  const accountBalances = await Promise.all(
    [
      ...ethScanCompatibleAccounts.map(getAccountAssetsBalancesWithEthScan),
      ...jsonRPCAccounts.map(getAccountAssetsBalancesWithJsonRPC)
    ].map(p => p.catch(e => console.debug(e))) // convert Promise.all ie. into allSettled https://dev.to/vitalets/what-s-wrong-with-promise-allsettled-and-promise-any-5e6o
  );

  return accountBalances;
};

export const getAllTokensBalancesOfAccount = async (account: StoreAccount, assets: Asset[]) => {
  const provider = account.network.nodes[0];
  const assetsInNetwork = assets.filter(x => x.networkId === account.network.id);
  const assetAddresses = getAssetAddresses(assetsInNetwork) as string[];

  try {
    return getTokensBalance(provider, account.address, assetAddresses).then(toBigNumberJS);
  } catch (err) {
    throw new Error(err);
  }
};

export const getAccountsTokenBalance = async (accounts: StoreAccount[], tokenContract: string) => {
  const provider = accounts[0].network.nodes[0];
  try {
    return getTokenBalancesFromEthScan(
      provider,
      accounts.map(account => account.address),
      tokenContract
    ).then(toBigNumberJS);
  } catch (err) {
    throw new Error(err);
  }
};

export const getAccountsTokenBalances = (accounts: StoreAccount[], tokenContracts: string[]) => {
  const provider = accounts[0].network.nodes[0];
  return getTokensBalances(
    provider,
    accounts.map(account => account.address),
    tokenContracts
  ).then(nestedToBigNumberJS);
};

// Unlock Token getBalance will return 0 if no valid unlock token is found for the address.
// If there is an Unlock token found, it will return the id of the token.
export const getAccountMemberships = async (accounts: StoreAccount[]) =>
  getAccountsTokenBalances(
    accounts,
    Object.values(MEMBERSHIP_CONFIG).map(c => c.contractAddress)
  )
    .then(unlockStatusBalanceMap =>
      Object.keys(unlockStatusBalanceMap)
        .map(address => ({
          address,
          memberships: Object.keys(unlockStatusBalanceMap[address])
            .filter(contract => unlockStatusBalanceMap[address][contract].isGreaterThan(new BN(0)))
            .map(contract => MEMBERSHIP_CONTRACTS[contract])
        }))
        .filter(m => m.memberships.length > 0)
    )
    .catch(err => console.error(err));

export const accountMembershipDetected = async (accounts: StoreAccount[]) =>
  !accounts || !(accounts.length > 0) ? [] : getAccountMemberships(accounts).catch(_ => undefined);
