import {
  createContract as createAContract,
  destroyContract,
  selectContracts,
  useDispatch,
  useSelector
} from '@store';
import { Contract, ExtendedContract, NetworkId, TAddress, TUuid } from '@types';
import { generateDeterministicAddressUUID, isSameAddress } from '@utils';

function useContracts() {
  const contracts = useSelector(selectContracts);
  const dispatch = useDispatch();

  /**
   * Save a valid contract. We rely on static typing to verify
   * params.
   * @param contract
   */
  const createContract = (contract: Contract): ExtendedContract => {
    const uuid = generateDeterministicAddressUUID(contract.networkId, contract.address);
    dispatch(createAContract({ ...contract, uuid }));
    return { ...contract, uuid };
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
