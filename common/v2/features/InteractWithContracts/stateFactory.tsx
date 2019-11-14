import { useContext } from 'react';

import { TUseStateReducerFactory } from 'v2/utils';
import { DEFAULT_NETWORK } from 'v2/config';
import { Contract, NetworkId } from 'v2/types';
import { getNetworkById, ContractContext, isValidETHAddress, ProviderHandler } from 'v2/services';

import { customContract, CUSTOM_CONTRACT_ADDRESS } from './constants';
import { ABIItem } from './types';
import { AbiFunction } from 'v2/services/EthService/contracts/ABIFunction';

const interactWithContractsInitialState = {
  networkId: DEFAULT_NETWORK,
  contractAddress: '',
  contract: undefined,
  contracts: [],
  abi: '',
  showGeneratedForm: false,
  submitedFunction: undefined
};

interface State {
  networkId: NetworkId;
  contractAddress: string;
  contract: Contract | undefined;
  contracts: Contract[];
  abi: string;
  showGeneratedForm: boolean;
  submitedFunction: ABIItem;
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

    const contracts = [customContractOption, ...networkContracts].map(x =>
      Object.assign(x, { label: x.name })
    );

    setState((prevState: State) => ({
      ...prevState,
      contracts
    }));
  };

  const handleContractSelected = (contract: Contract) => {
    let contractAddress = '';
    let contractAbi = '';

    if (contract.address !== CUSTOM_CONTRACT_ADDRESS) {
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

  const setGeneratedFormVisible = (visible: boolean) => {
    setState((prevState: State) => ({
      ...prevState,
      showGeneratedForm: visible
    }));
  };

  const handleInteractionFormSubmit = async (submitedFunction: ABIItem) => {
    const { encodeInput, decodeOutput } = new AbiFunction(submitedFunction, []);

    const parsedInputs = submitedFunction.inputs.reduce(
      (accu, input) => ({ ...accu, [input.name]: input.value }),
      {}
    );

    const { networkId, contractAddress } = state;

    const network = getNetworkById(networkId)!;
    const providerHandler = new ProviderHandler(network);
    const data = { to: contractAddress, data: encodeInput(parsedInputs) };

    const result = await providerHandler.call(data);

    return decodeOutput(result, network.chainId);
  };

  return {
    handleNetworkSelected,
    handleContractAddressChanged,
    handleContractSelected,
    handleAbiChanged,
    updateNetworkContractOptions,
    setGeneratedFormVisible,
    handleInteractionFormSubmit,
    interactWithContractsState: state
  };
};

export { interactWithContractsInitialState, InteractWithContractsFactory };
