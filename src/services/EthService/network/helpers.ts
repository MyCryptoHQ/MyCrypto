import { BaseProvider, EtherscanProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import { DerivationPath as DPath } from '@mycrypto/wallets';
import isEmpty from 'lodash/isEmpty';
import equals from 'ramda/src/equals';

import { ETHERSCAN_API_KEY } from '@config';
import { DPathFormat, Network, NodeOptions, NodeType } from '@types';
import { FallbackProvider } from '@vendor';

const CHAIN_ID_TO_REGISTRY: { [key: number]: string } = {
  30: '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5',
  31: '0x7d284aaac6e925aad802a53c0c69efe3764597b8'
};

const getProvider = (node: NodeOptions, chainId: number) => {
  const { type, url } = node;
  if (type === NodeType.ETHERSCAN) {
    return new EtherscanProvider(chainId, ETHERSCAN_API_KEY);
  }

  const connection = { url, throttleLimit: 3 };
  if ('auth' in node && node.auth) {
    return new StaticJsonRpcProvider(
      {
        ...connection,
        user: node.auth.username,
        password: node.auth.password,
        allowInsecureAuthentication: true
      },
      chainId
    );
  }

  const provider = new StaticJsonRpcProvider(connection, chainId);
  if ([30, 31].includes(chainId)) {
    provider.network.ensAddress = CHAIN_ID_TO_REGISTRY[chainId];
  }

  return provider;
};

export const createCustomNodeProvider = (network: Network): BaseProvider => {
  const { nodes, chainId } = network;
  if (nodes.length < 1) {
    throw new Error('At least one node required!');
  }

  return getProvider(nodes[0] as any, chainId);
};

export const createFallbackNetworkProviders = (network: Network): FallbackProvider => {
  const { nodes, selectedNode, chainId } = network;

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

  const providers = sortedNodes.map((n) => getProvider(n, chainId));

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
