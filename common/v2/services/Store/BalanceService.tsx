import EthScan, { HttpProvider } from '@mycrypto/eth-scan';
import partition from 'lodash/partition';
import { bigNumberify } from 'ethers/utils';

import { ETHSCAN_NETWORKS } from 'v2/config';
import { TAddress, StoreAccount, StoreAsset, Asset, NodeConfig } from 'v2/types';
import { ProviderHandler } from 'v2/services/EthService';

const getAssetAddresses = (assets: Asset[] = []): (string | undefined)[] => {
  return assets.map(a => a.contractAddress).filter(a => a);
};

const getScanner = (node: NodeConfig) => {
  return new EthScan(new HttpProvider(node.url));
};

const getAccountAssetsBalancesWithEthScan = async (account: StoreAccount): Promise<any[]> => {
  const list = getAssetAddresses(account.assets) as string[];
  const scanner = getScanner(account.network.nodes[0]);
  try {
    const [baseBalance, tokenBalances] = await Promise.all([
      scanner.getEtherBalances([account.address]),
      scanner.getTokensBalance(account.address, list)
    ]);
    return [baseBalance, tokenBalances];
  } catch (err) {
    throw new Error(err);
  }
};

// Return an object containing the balance of the different tokens
// e.g { TOKEN_CONTRACT_ADDRESS: <balance> }
const getTokenBalances = (provider: ProviderHandler, address: TAddress, tokens: StoreAsset[]) => {
  return tokens.reduce(async (balances, token) => {
    return {
      ...balances,
      [token.contractAddress as TAddress]: await provider.getTokenBalance(address, token)
    };
  }, {});
};

const getAccountAssetsBalancesWithJsonRPC = async (account: StoreAccount): Promise<any[]> => {
  const { address, assets, network } = account;
  const provider = new ProviderHandler(network);
  const tokens = assets.filter((a: StoreAsset) => a.type === 'erc20');

  const baseBalance = await provider
    .getRawBalance(account.address)
    .then(balance => ({ [address]: balance }));
  const tokenBalances = await getTokenBalances(provider, address as TAddress, tokens);

  return [baseBalance, tokenBalances];
};

/*
  Currently this effect only fetches the values for Ethereum address once.
  Will be cleaned up once we handle other networks + polling.
*/
export const getAccountsAssetsBalances = async (accounts: StoreAccount[]) => {
  // for the moment EthScan is only deployed on Ethereum.
  const [ethScanCompatibleAccounts, jsonRPCAccounts] = partition(accounts, ({ network }) =>
    ETHSCAN_NETWORKS.some(supportedNetwork => network.id === supportedNetwork)
  );

  const accountBalances = await Promise.all([
    ...ethScanCompatibleAccounts.map(getAccountAssetsBalancesWithEthScan),
    ...jsonRPCAccounts.map(getAccountAssetsBalancesWithJsonRPC)
  ]);

  // Since accountBalances is an array of resolved Promises, we create an array of
  // accounts with the same order so we can find the account again.
  const orderedAccounts = [...ethScanCompatibleAccounts, ...jsonRPCAccounts];

  const accountsWithBalances = accountBalances.map(([baseBalance, tokenBalances], index) => {
    const account = orderedAccounts[index];
    return {
      ...account,
      assets: account.assets
        .map(asset => {
          switch (asset.type) {
            case 'base': {
              const balance = baseBalance[account.address];
              return {
                ...asset,
                balance: balance ? balance.toString() : asset.balance
              };
            }
            case 'erc20': {
              const balance = tokenBalances[asset.contractAddress!];
              return {
                ...asset,
                balance: balance ? balance.toString() : asset.balance
              };
            }
            default:
              break;
          }
        })
        .map(asset => ({
          ...asset!,
          balance: bigNumberify(asset!.balance)
        }))
    };
  });

  return accountsWithBalances;
};
