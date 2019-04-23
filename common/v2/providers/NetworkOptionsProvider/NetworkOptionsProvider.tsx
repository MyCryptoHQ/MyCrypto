import React, { Component, createContext } from 'react';
import * as service from 'v2/services/NetworkOptions/NetworkOptions';
import { NetworkOptions, ExtendedNetworkOptions } from 'v2/services/NetworkOptions';

export interface ProviderState {
  networkOptions: ExtendedNetworkOptions[];
  createNetworkOptions(networkOptionsData: ExtendedNetworkOptions): void;
  readNetworkOptions(uuid: string): NetworkOptions;
  deleteNetworkOptions(uuid: string): void;
  updateNetworkOptions(uuid: string, networkOptionsData: ExtendedNetworkOptions): void;
}

export const NetworkOptionsContext = createContext({} as ProviderState);

export class NetworkOptionsProvider extends Component {
  public readonly state: ProviderState = {
    networkOptions: service.readAllNetworkOptions() || [],
    createNetworkOptions: (networkOptionsData: ExtendedNetworkOptions) => {
      service.createNetworkOptions(networkOptionsData);
      this.getNetworkOptions();
    },
    readNetworkOptions: (uuid: string) => {
      return service.readNetworkOptions(uuid);
    },
    deleteNetworkOptions: (uuid: string) => {
      service.deleteNetworkOptions(uuid);
      this.getNetworkOptions();
    },
    updateNetworkOptions: (uuid: string, networkOptionsData: ExtendedNetworkOptions) => {
      service.updateNetworkOptions(uuid, networkOptionsData);
      this.getNetworkOptions();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <NetworkOptionsContext.Provider value={this.state}>{children}</NetworkOptionsContext.Provider>
    );
  }

  private getNetworkOptions = () => {
    const networkOptions: ExtendedNetworkOptions[] = service.readAllNetworkOptions() || [];
    this.setState({ networkOptions });
  };
}
