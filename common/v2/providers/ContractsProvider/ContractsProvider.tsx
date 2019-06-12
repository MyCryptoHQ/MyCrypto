import React, { Component, createContext } from 'react';
import * as service from 'v2/services/Contracts/Contracts';
import { Contract, ExtendedContract } from 'v2/services/Contracts';

export interface ProviderState {
  contracts: ExtendedContract[];
  createContracts(contractsData: ExtendedContract): void;
  readContracts(uuid: string): Contract;
  deleteContracts(uuid: string): void;
  updateContracts(uuid: string, contractsData: ExtendedContract): void;
}

export const ContractsContext = createContext({} as ProviderState);

export class ContractsProvider extends Component {
  public readonly state: ProviderState = {
    contracts: service.readAllContracts() || [],
    createContracts: (contractsData: ExtendedContract) => {
      service.createContracts(contractsData);
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
    }
  };

  public render() {
    const { children } = this.props;
    return <ContractsContext.Provider value={this.state}>{children}</ContractsContext.Provider>;
  }

  private getContracts = () => {
    const contracts: ExtendedContract[] = service.readAllContracts() || [];
    this.setState({ contracts });
  };
}
