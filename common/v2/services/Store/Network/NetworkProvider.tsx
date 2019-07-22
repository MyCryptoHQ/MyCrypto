import React, { Component, createContext } from 'react';
import * as service from './Network';
import { Network, ExtendedNetwork, NodeOptions } from 'v2/types';

export interface ProviderState {
  networks: ExtendedNetwork[];
  createNetworks(networksData: ExtendedNetwork): void;
  readNetworks(uuid: string): Network;
  deleteNetworks(uuid: string): void;
  createNetworksNode(uuid: string, nodeData: NodeOptions): void;
  updateNetworks(uuid: string, networksData: ExtendedNetwork): void;
}

export const NetworkContext = createContext({} as ProviderState);

export class NetworkProvider extends Component {
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
    }
  };

  public render() {
    const { children } = this.props;
    return <NetworkContext.Provider value={this.state}>{children}</NetworkContext.Provider>;
  }

  private getNetworks = () => {
    const networks: ExtendedNetwork[] = service.readAllNetworks() || [];
    this.setState({ networks });
  };
}
