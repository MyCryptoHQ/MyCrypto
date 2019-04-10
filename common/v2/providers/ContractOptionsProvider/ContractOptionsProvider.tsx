import React, { Component, createContext } from 'react';
import * as service from 'v2/services/ContractOptions/ContractOptions';
import { ContractOptions, ExtendedContractOptions } from 'v2/services/ContractOptions';

export interface ProviderState {
  contractOptions: ExtendedContractOptions[];
  createContractOptions(contractOptionsData: ExtendedContractOptions): void;
  readContractOptions(uuid: string): ContractOptions;
  deleteContractOptions(uuid: string): void;
  updateContractOptions(uuid: string, contractOptionsData: ExtendedContractOptions): void;
}

export const ContractOptionsContext = createContext({} as ProviderState);

export class ContractOptionsProvider extends Component {
  public readonly state: ProviderState = {
    contractOptions: service.readAllContractOptions() || [],
    createContractOptions: (contractOptionsData: ExtendedContractOptions) => {
      service.createContractOptions(contractOptionsData);
      this.getContractOptions();
    },
    readContractOptions: (uuid: string) => {
      return service.readContractOptions(uuid);
    },
    deleteContractOptions: (uuid: string) => {
      service.deleteContractOptions(uuid);
      this.getContractOptions();
    },
    updateContractOptions: (uuid: string, contractOptionsData: ExtendedContractOptions) => {
      service.updateContractOptions(uuid, contractOptionsData);
      this.getContractOptions();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <ContractOptionsContext.Provider value={this.state}>
        {children}
      </ContractOptionsContext.Provider>
    );
  }

  private getContractOptions = () => {
    const contractOptions: ExtendedContractOptions[] = service.readAllContractOptions() || [];
    this.setState({ contractOptions });
  };
}
