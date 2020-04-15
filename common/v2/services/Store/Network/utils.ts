import { NodeOptions, NodeType, Network, ExtendedAddressBook } from 'v2/types';

export abstract class NetworkUtils {
  public static createWeb3Node = (): NodeOptions => ({
    name: 'web3',
    isCustom: false,
    type: NodeType.WEB3,
    url: '',
    service: 'MetaMask / Web3',
    hidden: true
  });

  public static getSelectedNode = (network: Network): NodeOptions => {
    if (network.selectedNode) {
      const selectedNode = network.nodes.find(n => n.name === network.selectedNode);
      if (selectedNode) {
        return selectedNode;
      }
    }

    return NetworkUtils.getAutoNode(network);
  };

  public static getAutoNode = (network: Network): NodeOptions => {
    if (network.autoNode) {
      const autoNode = network.nodes.find(n => n.name === network.autoNode);
      if (autoNode) {
        return autoNode;
      }
    }

    return network.nodes[0];
  };

  public static makeNodeName = (network: string, name: string) =>
    `${network.toLowerCase()}_${name.replace(/ /g, '_')}`;

  public static getDistinctNetworks(
    addressBook: ExtendedAddressBook[],
    getNetworkByName: (name: string) => Network | undefined
  ) {
    const addressBookNetworksIds = [...new Set(addressBook.map(a => a.network))];
    return addressBookNetworksIds.map(addressId => getNetworkByName(addressId)!);
  }
}
