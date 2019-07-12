import React, { Component, createContext } from 'react';
import * as service from 'v2/services/Network/Network';
import { Network, ExtendedNetwork, NodeOptions } from 'v2/services/Network';

export interface ProviderState {
  networks: ExtendedNetwork[];
  createNetworks(networksData: ExtendedNetwork): void;
  readNetworks(uuid: string): Network;
  deleteNetworks(uuid: string): void;
  createNetworksNode(uuid: string, nodeData: NodeOptions): void;
  updateNetworks(uuid: string, networksData: ExtendedNetwork): void;
  getNetworkByName(name: string): Network | undefined;
}

export const NetworksContext = createContext({} as ProviderState);

export class NetworksProvider extends Component {
  public readonly state: ProviderState = {
    networks: service.readAllNetworks() || [],
    createNetworks: (networksData: ExtendedNetwork) => {
      service.createNetworks(networksData);
      this.getNetworks();
    },
    readNetworks: (uuid: string) => {
      return service.readNetworks(uuid);
    },
    deleteNetworks: (uuid: string) => {
      service.deleteNetworks(uuid);
      this.getNetworks();
    },
    createNetworksNode: (uuid: string, nodeData: NodeOptions) => {
      const networkCurrentData: Network = service.readNetworks(uuid);
      const newNetworkData: Network = {
        ...networkCurrentData,
        nodes: [...networkCurrentData.nodes, nodeData]
      };
      service.updateNetworks(uuid, newNetworkData);
      this.getNetworks();
    },
    updateNetworks: (uuid: string, networksData: ExtendedNetwork) => {
      service.updateNetworks(uuid, networksData);
      this.getNetworks();
    },
    getNetworkByName: (name: string): Network | undefined => {
      const { networks } = this.state;
      return networks.find((network: Network) => network.name === name);
    }
  };

  public render() {
    const { children } = this.props;
    return <NetworksContext.Provider value={this.state}>{children}</NetworksContext.Provider>;
  }

  private getNetworks = () => {
    const networks: ExtendedNetwork[] = service.readAllNetworks() || [];
    this.setState({ networks });
  };
}
