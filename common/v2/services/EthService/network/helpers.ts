import { ethers } from 'ethers';
import { FallbackProvider, BaseProvider } from 'ethers/providers';
import * as R from 'ramda';

import { Network, NetworkId, NodeType, DPathFormat } from 'v2/types';
import { hasWeb3Provider } from 'v2/utils';

// Network names accepted by ethers.EtherscanProvider
type TValidEtherscanNetwork = 'homestead' | 'ropsten' | 'rinkeby' | 'kovan' | 'goerli';

const getValidEthscanNetworkId = (id: NetworkId): TValidEtherscanNetwork =>
  id === 'Ethereum' ? 'homestead' : (id.toLowerCase() as TValidEtherscanNetwork);

export const createNetworkProviders = (network: Network): FallbackProvider => {
  const { id, nodes } = network;
  // Remove WEB3 nodes if no Web3 provider is available at this moment
  const providers: BaseProvider[] = nodes
    .filter(n => (n.type === NodeType.WEB3 && hasWeb3Provider()) || n.type !== NodeType.WEB3)
    .map(({ type, url }) => {
      switch (type) {
        case NodeType.ETHERSCAN: {
          const networkName = getValidEthscanNetworkId(id);
          return new ethers.providers.EtherscanProvider(networkName);
        }
        case NodeType.WEB3: {
          const ethereumProvider = window.ethereum;
          const networkName = getValidEthscanNetworkId(id);
          return new ethers.providers.Web3Provider(ethereumProvider, networkName);
        }

        // Option to use the EthersJs InfuraProvider, but need figure out the apiAcessKey
        // https://docs.ethers.io/ethers.js/html/api-providers.html#jsonrpcprovider-inherits-from-provider
        // case NodeType.INFURA:
        //   return new ethers.providers.InfuraProvider(name);

        // default case covers the remaining NodeTypes.
        default:
          return new ethers.providers.JsonRpcProvider(url);
      }
    });

  return new ethers.providers.FallbackProvider(providers);
};

export const getDPath = (network: Network | undefined, type: DPathFormat): DPath | undefined => {
  return network ? network.dPaths[type] : undefined;
};

export const getDPaths = (networks: Network[], type: DPathFormat): DPath[] =>
  networks.reduce((acc, n) => {
    const dPath = getDPath(n, type);
    if (dPath && !acc.find(x => R.equals(x, dPath))) {
      acc.push(dPath);
    }
    return acc;
  }, [] as DPath[]);
