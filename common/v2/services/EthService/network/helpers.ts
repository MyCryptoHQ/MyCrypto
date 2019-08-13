import { ethers } from 'ethers';
import { FallbackProvider, BaseProvider } from 'ethers/providers';

import { Network, NetworkId, NodeType } from 'v2/types';

// Network names accepted by ethers.EtherscanProvider
type TValidEtherscanNetwork = 'homestead' | 'ropsten' | 'rinkeby' | 'kovan' | 'goerli';

const getValidEthscanNetworkId = (id: NetworkId): TValidEtherscanNetwork =>
  id === 'ETH' ? 'homestead' : (id.toLowerCase() as TValidEtherscanNetwork);

export const createNetworkProviders = (network: Network): FallbackProvider => {
  const { id, nodes }: Partial<Network> = network;
  const providers: BaseProvider[] = nodes.map(({ type, url }) => {
    switch (type) {
      case NodeType.ETHERSCAN: {
        const networkName = getValidEthscanNetworkId(id);
        return new ethers.providers.EtherscanProvider(networkName);
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
