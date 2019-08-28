import { bigNumberify } from 'ethers/utils';
import EthScan, { HttpProvider } from '@mycrypto/eth-scan';

import { StoreAccount, Asset, NodeConfig } from 'v2/types';

const getAssetAddresses = (assets: Asset[] = []): (string | undefined)[] => {
  return assets.map(a => a.contractAddress);
};

const getScanner = (node: NodeConfig) => {
  return new EthScan(new HttpProvider(node.url));
};

export const getAccountBalance = async (account: StoreAccount): Promise<StoreAccount> => {
  const list = getAssetAddresses(account.assets) as string[];
  const scanner = getScanner(account.network.nodes[0]);
  try {
    const [addressBalance, tokenBalances] = await Promise.all([
      scanner.getEtherBalances([account.address]),
      scanner.getTokensBalance(account.address, list)
    ]);

    return {
      ...account,
      // @ts-ignore
      balance: bigNumberify(addressBalance[account.address].toString()),
      assets: account.assets
        .filter(a => a.contractAddress || a.type === 'base')
        .map(asset => ({
          ...asset,
          balance: bigNumberify(tokenBalances[asset.contractAddress!].toString())
        }))
    };
  } catch (err) {
    throw new Error(err);
  }
};
