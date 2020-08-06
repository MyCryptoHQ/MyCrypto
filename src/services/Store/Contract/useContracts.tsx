import { useContext } from 'react';
import { isSameAddress } from '@utils';

import { ExtendedContract, LSKeys, TUuid, TAddress } from '@types';
import { DataContext } from '@services/Store';

function useContracts() {
  const { contracts, createActions } = useContext(DataContext);
  const model = createActions(LSKeys.CONTRACTS);

  const createContract = (contractsData: ExtendedContract) => {
    model.create(contractsData);
  };

  const createContractWithId = (contractsData: ExtendedContract, id: TUuid) => {
    model.createWithID(contractsData, id);
  };

  const deleteContracts = (uuid: TUuid) => {
    model.destroy(contracts.find((a) => a.uuid === uuid) as ExtendedContract);
  };

  const updateContracts = (uuid: TUuid, contractsData: ExtendedContract) => {
    model.update(uuid, contractsData);
  };

  const getContractsByIds = (uuids: TUuid[]) => {
    return uuids.map((contractId) => contracts.find((c) => c.uuid === contractId)!).filter(Boolean);
  };

  const getContractByAddress = (address: TAddress) =>
    contracts.find((x: ExtendedContract) => isSameAddress(x.address, address));

  return {
    contracts,
    createContract,
    createContractWithId,
    deleteContracts,
    updateContracts,
    getContractsByIds,
    getContractByAddress
  };
}

export default useContracts;
