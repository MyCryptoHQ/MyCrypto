import React, { Component, createContext } from 'react';

import { Contract, ExtendedContract } from 'v2/types';
import * as service from './Contract';

export interface ProviderState {
  contracts: ExtendedContract[];
  createContract(contractsData: ExtendedContract): void;
  readContracts(uuid: string): Contract;
  deleteContracts(uuid: string): void;
  updateContracts(uuid: string, contractsData: ExtendedContract): void;
  getContractsByIds(uuids: string[]): Contract[];
}

export const ContractContext = createContext({} as ProviderState);

export class ContractProvider extends Component {
  public readonly state: ProviderState = {
    contracts: service.readAllContracts() || [],
    createContract: (contractsData: ExtendedContract) => {
      service.createContract(contractsData);
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
    getContractsByIds: (uuids: string[]) => {
      const newContracts = uuids.map(contractId => service.readContracts(contractId));
      return newContracts;
    }
  };

  public render() {
    const { children } = this.props;
    return <ContractContext.Provider value={this.state}>{children}</ContractContext.Provider>;
  }

  private getContracts = () => {
    const contracts: ExtendedContract[] = service.readAllContracts() || [];
    this.setState({ contracts });
  };
}
