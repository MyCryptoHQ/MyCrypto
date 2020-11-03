import { useContext } from 'react';

import { DataContext } from '@services/Store';
import { createContract as createContractStore, destroyContract, useDispatch } from '@store';
import { Contract, ExtendedContract, TAddress, TUuid } from '@types';
import { generateDeterministicAddressUUID, isSameAddress } from '@utils';

function useContracts() {
  const { contracts } = useContext(DataContext);
  const dispatch = useDispatch();

  const createContract = (contract: Contract): ExtendedContract => {
    const uuid = generateDeterministicAddressUUID(contract.networkId, contract.address);
    const contractWithUUID: ExtendedContract = { ...contract, uuid };
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
    contracts.find((x: ExtendedContract) => isSameAddress(x.address, address));

  return {
    contracts,
    createContract,
    deleteContract,
    getContractsByIds,
    getContractByAddress
  };
}

export default useContracts;
