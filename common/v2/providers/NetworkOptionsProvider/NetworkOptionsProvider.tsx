import React, { Component, createContext } from 'react';
import NetworkOptionsServiceBase from 'v2/services/NetworkOptions/NetworkOptions';
import { ExtendedNetworkOptions } from 'v2/services/NetworkOptions';

export interface ProviderState {
  networkOptions: ExtendedNetworkOptions[];
  createNetworkOptions(NetworkOptionsData: ExtendedNetworkOptions): void;
  deleteNetworkOptions(uuid: string): void;
  updateNetworkOptions(uuid: string, NetworkOptionsData: ExtendedNetworkOptions): void;
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
