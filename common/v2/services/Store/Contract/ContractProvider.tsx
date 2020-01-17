import React, { createContext, useContext } from 'react';

import { ExtendedContract, LSKeys, TUuid } from 'v2/types';
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

export const ContractProvider: React.FC = ({ children }) => {
  const { createActions, contracts } = useContext(DataContext);
  const model = createActions(LSKeys.CONTRACTS);

  const state: ProviderState = {
    contracts,
    createContract: (contractsData: ExtendedContract) => {
      model.create(contractsData);
    },
    createContractWithId: (contractsData: ExtendedContract, id: TUuid) => {
      model.createWithID(contractsData, id);
    },
    deleteContracts: (uuid: TUuid) => {
      model.destroy(contracts.find(a => a.uuid === uuid) as ExtendedContract);
    },
    updateContracts: (uuid: TUuid, contractsData: ExtendedContract) => {
      model.update(uuid, contractsData);
    },
    getContractsByIds: (uuids: string[]) =>
      uuids.map(contractId => contracts.find(c => c.uuid === contractId)!).filter(Boolean)
  };
  return <ContractContext.Provider value={state}>{children}</ContractContext.Provider>;
};
