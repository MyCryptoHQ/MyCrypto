import React, { Component, createContext } from 'react';
import NetworkOptionsServiceBase from 'v2/services/NetworkOptions/NetworkOptions';
import { NetworkOptions, ExtendedNetworkOptions } from 'v2/services/NetworkOptions';

export interface ProviderState {
  networkOptions: ExtendedNetworkOptions[];
  createNetworkOptions(networkOptionsData: ExtendedNetworkOptions): void;
  readNetworkOptions(uuid: string): NetworkOptions;
  deleteNetworkOptions(uuid: string): void;
  updateNetworkOptions(uuid: string, networkOptionsData: ExtendedNetworkOptions): void;
}

export const NetworkOptionsContext = createContext({} as ProviderState);

const NetworkOptions = new NetworkOptionsServiceBase();

export class NetworkOptionsProvider extends Component {
  public readonly state: ProviderState = {
    networkOptions: NetworkOptions.readAllNetworkOptions() || [],
    createNetworkOptions: (networkOptionsData: ExtendedNetworkOptions) => {
      NetworkOptions.createNetworkOptions(networkOptionsData);
      this.getNetworkOptions();
    },
    readNetworkOptions: (uuid: string) => {
      return NetworkOptions.readNetworkOptions(uuid);
    },
    deleteNetworkOptions: (uuid: string) => {
      NetworkOptions.deleteNetworkOptions(uuid);
      this.getNetworkOptions();
    },
    updateNetworkOptions: (uuid: string, networkOptionsData: ExtendedNetworkOptions) => {
      NetworkOptions.updateNetworkOptions(uuid, networkOptionsData);
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
    const networkOptions: ExtendedNetworkOptions[] = NetworkOptions.readAllNetworkOptions() || [];
    this.setState({ networkOptions });
  };
}
