import { ethers } from 'ethers';
import { FallbackProvider, BaseProvider } from 'ethers/providers';

import { INetwork, NetworkId, NodeType, DPathFormat } from 'typeFiles';

// Network names accepted by ethers.EtherscanProvider
type TValidEtherscanNetwork = 'homestead' | 'ropsten' | 'rinkeby' | 'kovan' | 'goerli';

const getValidEthscanNetworkId = (id: NetworkId): TValidEtherscanNetwork =>
  id === 'Ethereum' ? 'homestead' : (id.toLowerCase() as TValidEtherscanNetwork);

export const createNetworkProviders = (network: INetwork): FallbackProvider => {
  const { id, nodes }: Partial<INetwork> = network;

  const providers: BaseProvider[] = nodes.map(({ type, url }) => {
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

export const getDPath = (network: INetwork | undefined, type: DPathFormat): DPath | undefined => {
  return network ? network.dPaths[type] : undefined;
};

export const getDPaths = (networks: INetwork[], type: DPathFormat): DPath[] => {
  return networks
    .map((n: INetwork) => getDPath(n, type))
    .filter((d: DPath | undefined) => d !== undefined) as DPath[];
};
