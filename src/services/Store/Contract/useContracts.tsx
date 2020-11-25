import { useContext } from 'react';

import { DataContext } from '@services/Store';
import { Contract, ExtendedContract, LSKeys, NetworkId, TAddress, TUuid } from '@types';
import { generateDeterministicAddressUUID, isSameAddress } from '@utils';

function useContracts() {
  const { contracts, createActions } = useContext(DataContext);
  const model = createActions(LSKeys.CONTRACTS);

  /**
   * Save a valid contract. We rely on static typing to verify
   * params.
   * @param contract
   */
  const createContract = (contract: Contract): ExtendedContract => {
    const uuid = generateDeterministicAddressUUID(contract.networkId, contract.address);
    const contractWithUUID: ExtendedContract = { ...contract, uuid };
    model.create(contractWithUUID);
    return contractWithUUID;
  };

  const deleteContract = (uuid: TUuid) => {
    model.destroy(contracts.find((a) => a.uuid === uuid) as ExtendedContract);
  };

  const getContractsByIds = (uuids: TUuid[]) => {
    return uuids.map((contractId) => contracts.find((c) => c.uuid === contractId)!).filter(Boolean);
  };

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
