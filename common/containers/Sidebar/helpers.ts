import { NodeConfig } from 'types/node';

interface NetworkOptions {
  [key: string]: NodeConfig[];
}

interface PrioritizedNetworkOptions {
  primaryNetworks: any[];
  secondaryNetworks: any[];
}

export const CORE_NETWORKS = ['ETH', 'ETC', 'Ropsten', 'Kovan', 'Rinkeby', 'Goerli'];

export function generateNetworksToNodes(nodes: NodeConfig[]): NetworkOptions {
  return Object.values(nodes).reduce((networksToNodes: NetworkOptions, nextNode) => {
    const { network } = nextNode;
    const newNetworkEntry = (networksToNodes[network] || []).concat(nextNode);

    networksToNodes[network] = newNetworkEntry;

    return networksToNodes;
  }, {});
}

export function splitUpNetworkOptions(networksToNodes: NetworkOptions): PrioritizedNetworkOptions {
  return Object.entries(networksToNodes).reduce(
    (networkOptions, [network, nodes]) => {
      const { primaryNetworks, secondaryNetworks } = networkOptions;
      const collection = CORE_NETWORKS.includes(network) ? primaryNetworks : secondaryNetworks;

      collection.push({
        network,
        nodes
      });

      return networkOptions;
    },
    {
      primaryNetworks: [],
      secondaryNetworks: []
    } as PrioritizedNetworkOptions
  );
}
