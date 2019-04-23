import React, { Component, createContext } from 'react';
import * as service from 'v2/services/DerivationPathOptions/DerivationPathOptions';
import {
  ExtendedDerivationPathOptions,
  DerivationPathOptions
} from 'v2/services/DerivationPathOptions';

export interface ProviderState {
  derivationPathOptions: ExtendedDerivationPathOptions[];
  createDerivationPathOptions(derivationPathOptionsData: ExtendedDerivationPathOptions): void;
  readDerivationPathOptions(uuid: string): DerivationPathOptions;
  deleteDerivationPathOptions(uuid: string): void;
  updateDerivationPathOptions(
    uuid: string,
    derivationPathOptionsData: ExtendedDerivationPathOptions
  ): void;
}

export const DerivationPathOptionsContext = createContext({} as ProviderState);

export class DerivationPathOptionsProvider extends Component {
  public readonly state: ProviderState = {
    derivationPathOptions: service.readAllDerivationPathOptions() || [],
    createDerivationPathOptions: (derivationPathOptionsData: ExtendedDerivationPathOptions) => {
      service.createDerivationPathOptions(derivationPathOptionsData);
      this.getDerivationPathOptions();
    },
    readDerivationPathOptions: (uuid: string): DerivationPathOptions => {
      return service.readDerivationPathOptions(uuid);
    },
    deleteDerivationPathOptions: (uuid: string) => {
      service.deleteDerivationPathOptions(uuid);
      this.getDerivationPathOptions();
    },
    updateDerivationPathOptions: (
      uuid: string,
      derivationPathOptionsData: ExtendedDerivationPathOptions
    ) => {
      service.updateDerivationPathOptions(uuid, derivationPathOptionsData);
      this.getDerivationPathOptions();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <DerivationPathOptionsContext.Provider value={this.state}>
        {children}
      </DerivationPathOptionsContext.Provider>
    );
  }

  private getDerivationPathOptions = () => {
    const derivationPathOptions: ExtendedDerivationPathOptions[] =
      service.readAllDerivationPathOptions() || [];
    this.setState({ derivationPathOptions });
  };
}
