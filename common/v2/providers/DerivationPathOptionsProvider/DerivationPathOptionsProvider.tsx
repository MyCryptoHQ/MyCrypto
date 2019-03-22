import React, { Component, createContext } from 'react';
import DerivationPathOptionsServiceBase from 'v2/services/DerivationPathOptions/DerivationPathOptions';
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

const DerivationPathOptions = new DerivationPathOptionsServiceBase();

export class DerivationPathOptionsProvider extends Component {
  public readonly state: ProviderState = {
    derivationPathOptions: DerivationPathOptions.readAllDerivationPathOptions() || [],
    createDerivationPathOptions: (derivationPathOptionsData: ExtendedDerivationPathOptions) => {
      DerivationPathOptions.createDerivationPathOptions(derivationPathOptionsData);
      this.getDerivationPathOptions();
    },
    readDerivationPathOptions: (uuid: string): DerivationPathOptions => {
      return DerivationPathOptions.readDerivationPathOptions(uuid);
    },
    deleteDerivationPathOptions: (uuid: string) => {
      DerivationPathOptions.deleteDerivationPathOptions(uuid);
      this.getDerivationPathOptions();
    },
    updateDerivationPathOptions: (
      uuid: string,
      derivationPathOptionsData: ExtendedDerivationPathOptions
    ) => {
      DerivationPathOptions.updateDerivationPathOptions(uuid, derivationPathOptionsData);
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
      DerivationPathOptions.readAllDerivationPathOptions() || [];
    this.setState({ derivationPathOptions });
  };
}
