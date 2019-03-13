import React, { Component, createContext } from 'react';
import DerivationPathOptionsServiceBase from 'v2/services/DerivationPathOptions/DerivationPathOptions';
import { ExtendedDerivationPathOptions } from 'v2/services/DerivationPathOptions';

export interface ProviderState {
  derivationPathOptions: ExtendedDerivationPathOptions[];
  createDerivationPathOptions(derivationPathOptionsData: ExtendedDerivationPathOptions): void;
  deleteDerivationPathOptions(uuid: string): void;
  updateDerivationPathOptions(
    uuid: string,
    DerivationPathOptionsData: ExtendedDerivationPathOptions
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
