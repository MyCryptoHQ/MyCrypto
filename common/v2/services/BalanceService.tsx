import EthScan, { HttpProvider } from '@mycrypto/eth-scan';

import { StoreAccount, Asset, NodeConfig } from 'v2/types';

const getAssetAddresses = (assets: Asset[] = []): (string | undefined)[] => {
  return assets.map(a => a.contractAddress).filter(a => a);
};

const getScanner = (node: NodeConfig) => {
  return new EthScan(new HttpProvider(node.url));
};

export const getAccountBalance = async (account: StoreAccount): Promise<any[]> => {
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

export const getAllTokensBalancesOfAccount = async (account: StoreAccount, assets: Asset[]) => {
  const scanner = getScanner(account.network.nodes[0]);
  const assetAddresses = getAssetAddresses(assets) as string[];

  try {
    return scanner.getTokensBalance(account.address, assetAddresses);
  } catch (err) {
    throw new Error(err);
  }
};
