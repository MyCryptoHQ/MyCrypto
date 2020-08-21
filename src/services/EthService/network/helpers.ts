import { ethers } from 'ethers';
import { FallbackProvider, BaseProvider } from 'ethers/providers';
import equals from 'ramda/src/equals';
import isEmpty from 'lodash/isEmpty';

import { Network, NetworkId, NodeType, NodeOptions, DPathFormat } from '@types';
import { INFURA_API_KEY, ETHERSCAN_API_KEY } from '@config';

// Network names accepted by ethers.EtherscanProvider
type TValidEtherscanNetwork = 'homestead' | 'ropsten' | 'rinkeby' | 'kovan' | 'goerli';

const getValidEthscanNetworkId = (id: NetworkId): TValidEtherscanNetwork =>
  id === 'Ethereum' ? 'homestead' : (id.toLowerCase() as TValidEtherscanNetwork);

const getProvider = (networkId: NetworkId, node: NodeOptions) => {
  const networkName = getValidEthscanNetworkId(networkId);
  const { type, url } = node;
  switch (type) {
    case NodeType.ETHERSCAN: {
      return new ethers.providers.EtherscanProvider(networkName, ETHERSCAN_API_KEY);
    }
    case NodeType.WEB3: {
      const ethereumProvider = (window as CustomWindow).ethereum;
      return new ethers.providers.Web3Provider(ethereumProvider, networkName);
    }
    case NodeType.INFURA:
      return new ethers.providers.InfuraProvider(networkName, INFURA_API_KEY);

    // default case covers the remaining NodeTypes.
    default: {
      if ('auth' in node && node.auth) {
        return new ethers.providers.JsonRpcProvider({
          url,
          user: node.auth.username,
          password: node.auth.password,
          allowInsecure: true
        });
      }
      return new ethers.providers.JsonRpcProvider(url);
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
