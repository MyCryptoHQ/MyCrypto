import { ExtendedContact, Network, NodeOptions, NodeType } from '@types';

export abstract class NetworkUtils {
  public static createWeb3Node = (): NodeOptions => ({
    name: 'web3',
    isCustom: false,
    type: NodeType.WEB3,
    url: '',
    service: 'MetaMask / Web3',
    hidden: true
  });

  public static getSelectedNode = (network: Network): NodeOptions | undefined => {
    if (network.selectedNode) {
      const selectedNode = network.nodes.find((n) => n.name === network.selectedNode);
      return selectedNode;
    }

    return undefined;
  };

  public static makeNodeName = (network: string, name: string) =>
    `${network.toLowerCase()}_${name.replace(/ /g, '_')}`;

  public static getDistinctNetworks(
    addressBook: ExtendedContact[],
    getNetworkById: (name: string) => Network
  ) {
    const addressBookNetworksIds = [...new Set(addressBook.map((a) => a.network))];
    return addressBookNetworksIds.map((id) => getNetworkById(id));
  }
}
