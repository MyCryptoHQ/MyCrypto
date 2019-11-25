import React, { Component, createContext } from 'react';

import { ExtendedContract, LSKeys } from 'v2/types';
import { DataContext } from '../DataManager';

export interface ProviderState {
  contracts: ExtendedContract[];
  createContract(contractsData: ExtendedContract): void;
  createContractWithId(contractsData: ExtendedContract, id: string): void;
  readContracts(uuid: string): ExtendedContract;
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
      service.createContractWithId(contractsData, id);
      this.getContracts();
    },
    readContracts: (uuid: string) => {
      return service.readContracts(uuid);
    },
    deleteContracts: (uuid: string) => {
      service.deleteContracts(uuid);
      this.getContracts();
    },
    updateContracts: (uuid: string, contractsData: ExtendedContract) => {
      service.updateContracts(uuid, contractsData);
      this.getContracts();
    },
    getContractsByIds: (uuids: string[]) =>
      uuids.map(contractId => service.readContracts(contractId))
  };

  private model = this.context.createActions(LSKeys.CONTRACTS);

  public render() {
    const { children } = this.props;
    return <ContractContext.Provider value={this.state}>{children}</ContractContext.Provider>;
  }
}

ContractProvider.contextType = DataContext;
