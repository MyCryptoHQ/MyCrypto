import React, { Component, createContext } from 'react';

import { ExtendedContract, LSKeys } from 'v2/types';
import { DataContext } from '../DataManager';

export interface ProviderState {
  contracts: ExtendedContract[];
  createContract(contractsData: ExtendedContract): void;
  createContractWithId(contractsData: ExtendedContract, id: string): void;
  deleteContracts(uuid: string): void;
  updateContracts(uuid: string, contractsData: ExtendedContract): void;
  getContractsByIds(uuids: string[]): ExtendedContract[];
}

export const ContractContext = createContext({} as ProviderState);

export class ContractProvider extends Component {
  public readonly state: ProviderState = {
    contracts: this.context.contracts,
    createContract: (contractsData: ExtendedContract) => {
      this.model.create(contractsData);
    },
    createContractWithId: (contractsData: ExtendedContract, id: string) => {
      this.model.createContractWithId(contractsData, id);
    },

    deleteContracts: (uuid: string) => {
      this.model.delete(uuid);
    },
    updateContracts: (uuid: string, contractsData: ExtendedContract) => {
      this.model.update(uuid, contractsData);
    },
    getContractsByIds: (uuids: string[]) =>
      uuids.map(contractId => this.state.contracts.find(c => c.uuid === contractId)!)
  };

  private model = this.context.createActions(LSKeys.CONTRACTS);

  public render() {
    const { children } = this.props;
    return <ContractContext.Provider value={this.state}>{children}</ContractContext.Provider>;
  }
}

ContractProvider.contextType = DataContext;
