import { useContext } from 'react';
import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import { TUseStateReducerFactory } from 'v2/utils';
import { DEFAULT_NETWORK } from 'v2/config';
import { Contract, StoreAccount } from 'v2/types';
import {
  getNetworkById,
  ContractContext,
  isValidETHAddress,
  ProviderHandler,
  getNonce,
  inputGasPriceToHex,
  fetchGasPriceEstimates,
  hexWeiToString,
  getGasEstimate,
  hexToNumber
} from 'v2/services';
import { AbiFunction } from 'v2/services/EthService/contracts/ABIFunction';
import { fromTxReceiptObj } from 'v2/components/TransactionFlow/helpers';
import { isWeb3Wallet } from 'v2/utils/web3';

import { customContract, CUSTOM_CONTRACT_ADDRESS } from './constants';
import { ABIItem, InteractWithContractState } from './types';

const interactWithContractsInitialState = {
  networkId: DEFAULT_NETWORK,
  contractAddress: '',
  contract: undefined,
  contracts: [],
  abi: '',
  showGeneratedForm: false,
  submitedFunction: undefined,
  data: undefined,
  account: undefined,
  rawTransaction: undefined
};

const InteractWithContractsFactory: TUseStateReducerFactory<InteractWithContractState> = ({
  state,
  setState
}) => {
  const { getContractsByIds } = useContext(ContractContext);

  const handleNetworkSelected = (networkId: any) => {
    setState((prevState: InteractWithContractState) => ({
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

    setState((prevState: InteractWithContractState) => ({
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

    setState((prevState: InteractWithContractState) => ({
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

    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      contractAddress,
      contract: customContract,
      abi: ''
    }));
  };

  const handleAbiChanged = (abi: string) => {
    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      abi
    }));
  };

  const setGeneratedFormVisible = (visible: boolean) => {
    setState((prevState: InteractWithContractState) => ({
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

  const handleInteractionFormWriteSubmit = async (submitedFunction: ABIItem, after: () => void) => {
    const { encodeInput } = new AbiFunction(submitedFunction, []);

    const parsedInputs = submitedFunction.inputs.reduce(
      (accu, input) => ({ ...accu, [input.name]: input.value }),
      {}
    );

    const { networkId, contractAddress, account } = state;

    const network = getNetworkById(networkId)!;

    const { fast } = await fetchGasPriceEstimates(network.id);
    const gasPrice = hexWeiToString(inputGasPriceToHex(fast.toString()));

    const data = encodeInput(parsedInputs);

    const rawTransaction: any = {
      to: contractAddress,
      data,
      from: account.address,
      gasPrice: addHexPrefix(new BN(gasPrice).toString(16)),
      value: 0, // use correct value
      chainId: network.chainId,
      nonce: await getNonce(network, account)
    };
    const gasLimit = await getGasEstimate(network, rawTransaction);
    rawTransaction.gasLimit = hexToNumber(gasLimit);
    delete rawTransaction.from;

    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      rawTransaction
    }));

    after();
  };

  const handleAccountSelected = (account: StoreAccount) => {
    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      account
    }));
  };

  const handleTxSigned = async (signResponse: any, after: () => void) => {
    const { account } = state;

    if (isWeb3Wallet(account.wallet)) {
      const txReceipt =
        signResponse && signResponse.hash ? signResponse : { hash: signResponse, asset: {} };
      setState((prevState: InteractWithContractState) => ({
        ...prevState,
        txReceipt
      }));

      after();
    } else {
      const provider = new ProviderHandler(account.network);
      provider
        .sendRawTx(signResponse)
        .then(retrievedTxReceipt => retrievedTxReceipt)
        .catch(hash => provider.getTransactionByHash(hash))
        .then(retrievedTransactionReceipt => {
          const txReceipt = fromTxReceiptObj(retrievedTransactionReceipt);
          setState((prevState: InteractWithContractState) => ({
            ...prevState,
            txReceipt
          }));
        })
        .finally(after);
    }
  };

  return {
    handleNetworkSelected,
    handleContractAddressChanged,
    handleContractSelected,
    handleAbiChanged,
    updateNetworkContractOptions,
    setGeneratedFormVisible,
    handleInteractionFormSubmit,
    handleInteractionFormWriteSubmit,
    handleAccountSelected,
    handleTxSigned,
    interactWithContractsState: state
  };
};

export { interactWithContractsInitialState, InteractWithContractsFactory };
