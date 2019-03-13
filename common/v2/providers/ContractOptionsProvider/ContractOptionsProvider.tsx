import React, { Component, createContext } from 'react';
import ContractOptionsServiceBase from 'v2/services/ContractOptions/ContractOptions';
import { ExtendedContractOptions } from 'v2/services/ContractOptions';

export interface ProviderState {
  contractOptions: ExtendedContractOptions[];
  createContractOptions(contractOptionsData: ExtendedContractOptions): void;
  deleteContractOptions(uuid: string): void;
  updateContractOptions(uuid: string, contractOptionsData: ExtendedContractOptions): void;
}

export const ContractOptionsContext = createContext({} as ProviderState);

const ContractOptions = new ContractOptionsServiceBase();

export class ContractOptionsProvider extends Component {
  public readonly state: ProviderState = {
    contractOptions: ContractOptions.readAllContractOptions() || [],
    createContractOptions: (contractOptionsData: ExtendedContractOptions) => {
      ContractOptions.createContractOptions(contractOptionsData);
      this.getContractOptions();
    },
    deleteContractOptions: (uuid: string) => {
      ContractOptions.deleteContractOptions(uuid);
      this.getContractOptions();
    },
    updateContractOptions: (uuid: string, contractOptionsData: ExtendedContractOptions) => {
      ContractOptions.updateContractOptions(uuid, contractOptionsData);
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
    const contractOptions: ExtendedContractOptions[] =
      ContractOptions.readAllContractOptions() || [];
    this.setState({ contractOptions });
  };
}
