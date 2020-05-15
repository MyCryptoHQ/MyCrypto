import { FallbackProvider } from 'ethers/providers/fallback-provider';
import { BaseProvider } from 'ethers/providers/base-provider';
import { EtherscanProvider } from 'ethers/providers/etherscan-provider';
import { Web3Provider } from 'ethers/providers/web3-provider';
import { JsonRpcProvider } from 'ethers/providers/json-rpc-provider';
import equals from 'ramda/src/equals';
import isEmpty from 'lodash/isEmpty';

import {
  Network,
  NetworkId,
  NodeType,
  DPathFormat,
  CustomNodeConfig,
  StaticNodeConfig
} from '@types';

// Network names accepted by ethers.EtherscanProvider
type TValidEtherscanNetwork = 'homestead' | 'ropsten' | 'rinkeby' | 'kovan' | 'goerli';

const getValidEthscanNetworkId = (id: NetworkId): TValidEtherscanNetwork =>
  id === 'Ethereum' ? 'homestead' : (id.toLowerCase() as TValidEtherscanNetwork);

const getProvider = (
  networkId: NetworkId,
  { type, url, auth }: CustomNodeConfig & StaticNodeConfig
) => {
  switch (type) {
    case NodeType.ETHERSCAN: {
      const networkName = getValidEthscanNetworkId(networkId);
      return new EtherscanProvider(networkName);
    }
    case NodeType.WEB3: {
      const ethereumProvider = window.ethereum;
      const networkName = getValidEthscanNetworkId(networkId);
      return new Web3Provider(ethereumProvider, networkName);
    }

    // Option to use the EthersJs InfuraProvider, but need figure out the apiAcessKey
    // https://docs.ethers.io/ethers.js/html/api-providers.html#jsonrpcprovider-inherits-from-provider
    // case NodeType.INFURA:
    //   return new ethers.providers.InfuraProvider(name);

    // default case covers the remaining NodeTypes.
    default: {
      if (auth) {
        return new JsonRpcProvider({
          url,
          user: auth.username,
          password: auth.password,
          allowInsecure: true
        });
      }
      return new JsonRpcProvider(url);
    }
  }
};

export const createCustomNodeProvider = (network: Network): BaseProvider => {
  const { id, nodes } = network;
  if (nodes.length < 1) {
    throw new Error('At least one node required!');
  }

  return getProvider(id, nodes[0] as any);
};

export const createFallbackNetworkProviders = (network: Network): FallbackProvider => {
  const { id, nodes, selectedNode } = network;

  let sortedNodes = nodes;
  if (!isEmpty(selectedNode)) {
    const sNode = nodes.find((n) => n.name === selectedNode);
    if (sNode) {
      const restNodes = nodes.filter((n) => n.name !== selectedNode);
      sortedNodes = [sNode, ...restNodes];
    }
  }

  const providers: BaseProvider[] = sortedNodes.map((n) => getProvider(id, n as any));

  return new FallbackProvider(providers);
};

export const getDPath = (network: Network | undefined, type: DPathFormat): DPath | undefined => {
  return network ? network.dPaths[type] : undefined;
};

export const getDPaths = (networks: Network[], type: DPathFormat): DPath[] =>
  networks.reduce((acc, n) => {
    const dPath = getDPath(n, type);
    if (dPath && !acc.find((x) => equals(x, dPath))) {
      acc.push(dPath);
    }
    return acc;
  }, [] as DPath[]);
