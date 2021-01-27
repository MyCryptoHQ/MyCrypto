import {
  BaseProvider,
  EtherscanProvider,
  InfuraProvider,
  StaticJsonRpcProvider
} from '@ethersproject/providers';
import isEmpty from 'lodash/isEmpty';
import equals from 'ramda/src/equals';

import { ETHERSCAN_API_KEY, INFURA_API_KEY } from '@config';
import { DPath, DPathFormat, Network, NetworkId, NodeOptions, NodeType } from '@types';
import { FallbackProvider } from '@vendor';

// Network names accepted by ethers.EtherscanProvider
type TValidEthersNetworkish = 'homestead' | 'ropsten' | 'rinkeby' | 'kovan' | 'goerli' | number;
const validNetworkIds = ['homestead', 'ropsten', 'rinkeby', 'kovan', 'goerli'];

const getValidEthersNetworkish = (id: NetworkId, chainId: number): TValidEthersNetworkish => {
  if (id === 'Ethereum') {
    return 'homestead' as TValidEthersNetworkish;
  }
  return validNetworkIds.includes(id.toLowerCase())
    ? (id.toLowerCase() as TValidEthersNetworkish)
    : (chainId as TValidEthersNetworkish);
};

const getProvider = (networkId: NetworkId, node: NodeOptions, chainId: number) => {
  const networkish = getValidEthersNetworkish(networkId, chainId);
  const { type, url } = node;
  switch (type) {
    case NodeType.ETHERSCAN: {
      return new EtherscanProvider(networkish, ETHERSCAN_API_KEY);
    }
    case NodeType.INFURA:
      return new InfuraProvider(networkish, INFURA_API_KEY);
    // default case covers the remaining NodeTypes.
    default: {
      if ('auth' in node && node.auth) {
        return new StaticJsonRpcProvider(
          {
            url,
            user: node.auth.username,
            password: node.auth.password,
            allowInsecureAuthentication: true
          },
          chainId
        );
      }
      return new StaticJsonRpcProvider(url, chainId);
    }
  }
};

export const createCustomNodeProvider = (network: Network): BaseProvider => {
  const { id, nodes, chainId } = network;
  if (nodes.length < 1) {
    throw new Error('At least one node required!');
  }

  return getProvider(id, nodes[0] as any, chainId);
};

export const createFallbackNetworkProviders = (network: Network): FallbackProvider => {
  const { id, nodes, selectedNode, chainId } = network;

  // Filter out WEB3 nodes always
  // Filter out nodes disabled by default if needed
  let sortedNodes = nodes
    .filter((n) => n.type !== NodeType.WEB3)
    .filter((n) => !n.disableByDefault || n.name === selectedNode);
  if (!isEmpty(selectedNode)) {
    const sNode = sortedNodes.find((n) => n.name === selectedNode);
    if (sNode) {
      sortedNodes = [sNode];
    }
  }

  const providers = sortedNodes.map((n) => getProvider(id, n as any, chainId));

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
