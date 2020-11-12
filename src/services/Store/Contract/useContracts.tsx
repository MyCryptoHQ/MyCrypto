import { useContext } from 'react';

import { DataContext } from '@services/Store';
import { createContract as createContractStore, destroyContract, useDispatch } from '@store';
import { Contract, TAddress, TUuid } from '@types';
import { generateDeterministicAddressUUID, isSameAddress } from '@utils';

function useContracts() {
  const { contracts } = useContext(DataContext);
  const dispatch = useDispatch();

  const createContract = (contract: Omit<Contract, 'uuid'>): Contract => {
    const uuid = generateDeterministicAddressUUID(contract.networkId, contract.address);
    const contractWithUUID: Contract = { ...contract, uuid };
    dispatch(createContractStore(contractWithUUID));
    return contractWithUUID;
  };

  const deleteContract = (uuid: TUuid) => {
    dispatch(destroyContract(uuid));
  };

  const getContractsByIds = (uuids: TUuid[]) => {
    return uuids.map((contractId) => contracts.find((c) => c.uuid === contractId)!).filter(Boolean);
  };

  const getContractByAddress = (address: TAddress) =>
    contracts.find((x: Contract) => isSameAddress(x.address, address));

  return {
    contracts,
    createContract,
    deleteContract,
    getContractsByIds,
    getContractByAddress
  };
}

export default useContracts;
