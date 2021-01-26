import { ExtendedContact, Network, NodeOptions } from '@types';

export abstract class NetworkUtils {
  public static getSelectedNode = ({ nodes, selectedNode }: Network): NodeOptions | undefined => {
    if (!selectedNode) return undefined;
    return nodes.find((n) => n.name === selectedNode);
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
