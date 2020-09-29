import { ethers } from 'ethers';
import { BaseProvider, FallbackProvider } from 'ethers/providers';
import isEmpty from 'lodash/isEmpty';
import equals from 'ramda/src/equals';

import { ETHERSCAN_API_KEY, INFURA_API_KEY } from '@config';
import { DPathFormat, Network, NetworkId, NodeOptions, NodeType } from '@types';

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
      return new ethers.providers.EtherscanProvider(networkish, ETHERSCAN_API_KEY);
    }
    case NodeType.WEB3: {
      const ethereumProvider = (window as CustomWindow).ethereum;
      return new ethers.providers.Web3Provider(ethereumProvider, networkish);
    }
    case NodeType.INFURA:
      return new ethers.providers.InfuraProvider(networkish, INFURA_API_KEY);

    // default case covers the remaining NodeTypes.
    default: {
      if ('auth' in node && node.auth) {
        return new ethers.providers.JsonRpcProvider(
          {
            url,
            user: node.auth.username,
            password: node.auth.password,
            allowInsecure: true
          },
          chainId
        );
      }
      return new ethers.providers.JsonRpcProvider(url, chainId);
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

  let sortedNodes = nodes;
  if (!isEmpty(selectedNode)) {
    const sNode = nodes.find((n) => n.name === selectedNode);
    if (sNode) {
      const restNodes = nodes.filter((n) => n.name !== selectedNode);
      sortedNodes = [sNode, ...restNodes];
    }
  }

  const providers: BaseProvider[] = sortedNodes.map((n) => getProvider(id, n as any, chainId));

  return new ethers.providers.FallbackProvider(providers);
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
