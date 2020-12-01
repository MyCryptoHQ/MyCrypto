import { useContext } from 'react';

import { createContract as createAContract, destroyContract, useDispatch } from '@store';

import { DataContext } from '@services/Store';
import { ExtendedContract, NetworkId, TAddress, TUuid } from '@types';
import { isSameAddress } from '@utils';

function useContracts() {
  const { contracts } = useContext(DataContext);
  const dispatch = useDispatch();

  /**
   * Save a valid contract. We rely on static typing to verify
   * params.
   * @param contract
   */
  const createContract = (contract: ExtendedContract): ExtendedContract => {
    dispatch(createAContract(contract));
    return contract;
  };

  const deleteContract = (uuid: TUuid) => {
    dispatch(destroyContract(uuid));
  };

  const getContractsByIds = (uuids: TUuid[]) =>
    uuids.map((contractId) => contracts.find((c) => c.uuid === contractId)!).filter(Boolean);

  const getContractByAddress = (address: TAddress) =>
    contracts.find((x: ExtendedContract) => isSameAddress(x.address, address));

  const getContractsByNetwork = (networkId: NetworkId) =>
    contracts.filter((c) => c.networkId === networkId);

  return {
    contracts,
    createContract,
    deleteContract,
    getContractsByIds,
    getContractByAddress,
    getContractsByNetwork
  };
}

export default useContracts;
