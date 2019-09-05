import EthScan, { HttpProvider } from '@mycrypto/eth-scan';

import { TAddress, StoreAccount, StoreAsset, Asset, NodeConfig } from 'v2/types';
import { ProviderHandler } from 'v2/services/EthService';

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

export const otherAccountBalance = async (account: StoreAccount): Promise<any[]> => {
  const { address, assets, network } = account;
  const provider = new ProviderHandler(network);
  const tokens = assets.filter((a: StoreAsset) => a.type === 'erc20');

  const baseBalance = await provider
    .getRawBalance(account.address)
    .then(balance => ({ [address]: balance }));
  const tokenBalances = await getTokenBalances(provider, address as TAddress, tokens);

  return [baseBalance, tokenBalances];
};
