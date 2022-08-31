import { BaseProvider, EtherscanProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import { DerivationPath as DPath } from '@mycrypto/wallets';
import isEmpty from 'lodash/isEmpty';
import equals from 'ramda/src/equals';

import { ETHERSCAN_API_KEY } from '@config';
import { DPathFormat, Network, NodeOptions, NodeType } from '@types';
import { FallbackProvider } from '@vendor';

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
  return new StaticJsonRpcProvider(connection, chainId);
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
