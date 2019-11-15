import EthScan, { HttpProvider, EthersProvider } from '@mycrypto/eth-scan';
import partition from 'lodash/partition';
import { bigNumberify, BigNumber } from 'ethers/utils';
import { default as BN } from 'bignumber.js';

import { ETHSCAN_NETWORKS, MYCRYPTO_UNLOCK_CONTRACT_ADDRESS } from 'v2/config';
import { TAddress, StoreAccount, StoreAsset, Asset, NodeConfig, Network } from 'v2/types';
import { ProviderHandler } from 'v2/services/EthService';
import { FallbackProvider } from 'ethers/providers';

export interface BalanceMap {
  [key: string]: BN | BigNumber;
}

const getAssetAddresses = (assets: Asset[] = []): (string | undefined)[] => {
  return assets.map(a => a.contractAddress).filter(a => a);
};

const getScanner = (node: NodeConfig) => {
  return new EthScan(new HttpProvider(node.url));
};

export const getScannerWithProvider = (provider: FallbackProvider) => {
  return new EthScan(new EthersProvider(provider));
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
  const scanner = getScanner(account.network.nodes[0]);

  return Promise.all([
    scanner.getEtherBalances([account.address]),
    scanner.getTokensBalance(account.address, list)
  ])
    .then(addBalancesToAccount(account))
    .catch(_ => account);
};

export const getBaseAssetBalances = async (addresses: string[], network: Network | undefined) => {
  if (!network) {
    return ([] as unknown) as BalanceMap;
  }
  const scanner = getScannerWithProvider(new ProviderHandler(network).client);
  return scanner
    .getEtherBalances(addresses)
    .then(data => {
      return data;
    })
    .catch(_ => ([] as unknown) as BalanceMap);
};

// Return an object containing the balance of the different tokens
// e.g { TOKEN_CONTRACT_ADDRESS: <balance> }
const getTokenBalances = (
  provider: ProviderHandler,
  address: TAddress,
  tokens: StoreAsset[]
): BalanceMap => {
  return tokens.reduce(async (balances, token) => {
    return {
      ...balances,
      [token.contractAddress as TAddress]: await provider.getRawTokenBalance(address, token)
    };
  }, {});
};

const getAccountAssetsBalancesWithJsonRPC = async (
  account: StoreAccount
): Promise<StoreAccount> => {
  const { address, assets, network } = account;
  const provider = new ProviderHandler(network);
  const tokens = assets.filter((a: StoreAsset) => a.type === 'erc20');

  return Promise.all([
    provider.getRawBalance(account.address).then(balance => ({ [address]: balance })),
    getTokenBalances(provider, address as TAddress, tokens)
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
  const scanner = getScanner(account.network.nodes[0]);
  const assetsInNetwork = assets.filter(x => x.networkId === account.network.id);
  const assetAddresses = getAssetAddresses(assetsInNetwork) as string[];

  try {
    return scanner.getTokensBalance(account.address, assetAddresses);
  } catch (err) {
    throw new Error(err);
  }
};

export const getAccountsTokenBalance = async (accounts: StoreAccount[], tokenContract: string) => {
  const scanner = getScanner(accounts[0].network.nodes[0]);
  try {
    return scanner.getTokenBalances(accounts.map(account => account.address), tokenContract);
  } catch (err) {
    throw new Error(err);
  }
};

// Unlock Token getBalance will return 0 if no valid unlock token is found for the address.
// If there is an Unlock token found, it will return the id of the token.
export const getAccountsUnlockVIPAddresses = async (accounts: StoreAccount[]) =>
  getAccountsTokenBalance(accounts, MYCRYPTO_UNLOCK_CONTRACT_ADDRESS)
    .then(unlockStatusBalanceMap =>
      Object.keys(unlockStatusBalanceMap).filter(address =>
        unlockStatusBalanceMap[address].isGreaterThan(new BN(0))
      )
    )
    .catch(err => console.error(err));

export const accountUnlockVIPDetected = async (accounts: StoreAccount[]) =>
  !accounts || !(accounts.length > 0)
    ? false
    : getAccountsUnlockVIPAddresses(accounts)
        .then((unlockAccounts: string[]) => !(!unlockAccounts || unlockAccounts.length === 0))
        .catch(_ => false);
