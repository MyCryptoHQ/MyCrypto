import React, { Component, createContext } from 'react';
import * as service from './Network';
import { INetwork, ExtendedNetwork, NodeOptions } from 'typeFiles';

export interface ProviderState {
  networks: ExtendedNetwork[];
  createNetworks(networksData: ExtendedNetwork): void;
  readNetworks(uuid: string): INetwork;
  deleteNetworks(uuid: string): void;
  createNetworksNode(uuid: string, nodeData: NodeOptions): void;
  updateNetworks(uuid: string, networksData: ExtendedNetwork): void;
  getNetworkByName(name: string): INetwork | undefined;
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
      const networkCurrentData: INetwork = service.readNetworks(uuid);
      const newNetworkData: INetwork = {
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
    getNetworkByName: (name: string): INetwork | undefined => {
      const { networks } = this.state;
      return networks.find((network: INetwork) => network.name === name);
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
