import { TUseStateReducerFactory } from 'v2/utils';
import { DEFAULT_NETWORK } from 'v2/config';
import { Contract, NetworkId } from 'v2/types';
import { getNetworkById, ContractContext, isValidETHAddress } from 'v2/services';
import { useContext } from 'react';
import { customContract } from './constants';

const interactWithContractsInitialState = {
  networkId: DEFAULT_NETWORK,
  contractAddress: '',
  contract: undefined,
  contracts: [],
  abi: ''
};

interface State {
  networkId: NetworkId;
  contractSelectionForm: any;
  contractAddress: string;
  contract: Contract | undefined;
  contracts: Contract[];
  abi: string;
}

const InteractWithContractsFactory: TUseStateReducerFactory<State> = ({ state, setState }) => {
  const { getContractsByIds } = useContext(ContractContext);

  const handleNetworkSelected = (networkId: any) => {
    setState((prevState: State) => ({
      ...prevState,
      networkId,
      contract: undefined,
      contractAddress: '',
      abi: ''
    }));
  };

  const updateNetworkContractOptions = (networkId: any) => {
    // Get contracts for selected network
    const contractIds = getNetworkById(networkId)!.contracts;
    const networkContracts = getContractsByIds(contractIds);

    const customContractOption = Object.assign(customContract, { networkId });
    setState((prevState: State) => ({
      ...prevState,
      contracts: [customContractOption, ...networkContracts]
    }));
  };

  const handleContractSelected = (contract: Contract) => {
    let contractAddress = '';
    let contractAbi = '';

    if (contract.address !== 'custom') {
      contractAddress = contract.address;
      contractAbi = contract.abi;
    }

    setState((prevState: State) => ({
      ...prevState,
      contract,
      contractAddress,
      abi: contractAbi
    }));
  };

  const handleContractAddressChanged = (contractAddress: string) => {
    if (isValidETHAddress(contractAddress)) {
      const existingContract = state.contracts.find(c => c.address === contractAddress);
      if (existingContract) {
        handleContractSelected(existingContract);
        return;
      }
    }

    setState((prevState: State) => ({
      ...prevState,
      contractAddress,
      contract: customContract,
      abi: ''
    }));
  };

  const handleAbiChanged = (abi: string) => {
    setState((prevState: State) => ({
      ...prevState,
      abi
    }));
  };

  return {
    handleNetworkSelected,
    handleContractAddressChanged,
    handleContractSelected,
    handleAbiChanged,
    updateNetworkContractOptions,
    interactWithContractsState: state
  };
};

export { interactWithContractsInitialState, InteractWithContractsFactory };
