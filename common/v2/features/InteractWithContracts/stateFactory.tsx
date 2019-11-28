import { useContext } from 'react';
import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import { TUseStateReducerFactory, generateUUID } from 'v2/utils';
import { DEFAULT_NETWORK } from 'v2/config';
import { Contract, StoreAccount, ITxConfig } from 'v2/types';
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
  hexToNumber,
  updateNetworks,
  inputValueToHex
} from 'v2/services';
import { AbiFunction } from 'v2/services/EthService/contracts/ABIFunction';
import { fromTxReceiptObj } from 'v2/components/TransactionFlow/helpers';
import { isWeb3Wallet } from 'v2/utils/web3';

import { customContract, CUSTOM_CONTRACT_ADDRESS } from './constants';
import { ABIItem, InteractWithContractState } from './types';
import { makeTxConfigFromTransaction, reduceInputParams } from './helpers';

const interactWithContractsInitialState = {
  networkId: DEFAULT_NETWORK,
  contractAddress: '',
  contract: undefined,
  customContractName: '',
  contracts: [],
  abi: '',
  showGeneratedForm: false,
  submitedFunction: undefined,
  data: undefined,
  account: undefined,
  rawTransaction: {
    gasPrice: '0xee6b2800',
    gasLimit: 21000,
    nonce: 0
  },
  txConfig: undefined,
  txReceipt: undefined
};

const InteractWithContractsFactory: TUseStateReducerFactory<InteractWithContractState> = ({
  state,
  setState
}) => {
  const { getContractsByIds, createContractWithId } = useContext(ContractContext);

  const handleNetworkSelected = (networkId: any) => {
    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      networkId,
      contract: undefined,
      contractAddress: '',
      abi: '',
      customContractName: ''
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
      abi: contractAbi,
      customContractName: ''
    }));
  };

  const handleContractAddressChanged = (contractAddress: string) => {
    const existingContract = state.contracts.find(c => c.address === contractAddress);
    if (existingContract) {
      handleContractSelected(existingContract);
      return;
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

  const handleCustomContractNameChanged = (customContractName: string) => {
    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      customContractName
    }));
  };

  const handleSaveContractSubmit = () => {
    const uuid = generateUUID();

    if (!state.contractAddress || !state.customContractName || !state.abi) {
      throw new Error('Please enter contract name, address and ABI.');
    }

    if (!isValidETHAddress(state.contractAddress)) {
      throw new Error('Please enter a valid contract address.');
    }

    try {
      JSON.parse(state.abi);
    } catch (e) {
      throw new Error(`ABI Error: ${e.message}`);
    }

    if (state.contracts.find(item => item.name === state.customContractName)) {
      throw new Error('Contract name already exists.');
    }

    const newContract = {
      abi: state.abi,
      address: state.contractAddress,
      name: state.customContractName,
      label: state.customContractName,
      networkId: state.networkId,
      uuid
    };

    createContractWithId(newContract, uuid);
    const network = getNetworkById(state.networkId)!;
    network.contracts.unshift(uuid);
    updateNetworks(state.networkId, network);
    updateNetworkContractOptions(state.networkId);
    handleContractSelected(newContract);
  };

  const setGeneratedFormVisible = (visible: boolean) => {
    if (visible) {
      if (!state.contractAddress || !state.abi) {
        throw new Error(
          'Please select an existing contract or enter custom contract address and ABI.'
        );
      }

      if (!isValidETHAddress(state.contractAddress)) {
        throw new Error('Please enter a valid contract address.');
      }

      try {
        JSON.parse(state.abi);
      } catch (e) {
        throw new Error(`ABI Error: ${e.message}`);
      }
    }

    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      showGeneratedForm: visible
    }));
  };

  const handleInteractionFormSubmit = async (submitedFunction: ABIItem) => {
    const { networkId, contractAddress } = state;
    const { encodeInput, decodeOutput } = new AbiFunction(submitedFunction, []);
    const parsedInputs = reduceInputParams(submitedFunction);
    const network = getNetworkById(networkId)!;
    const providerHandler = new ProviderHandler(network);
    const data = { to: contractAddress, data: encodeInput(parsedInputs) };

    const result = await providerHandler.call(data);

    return decodeOutput(result, network.chainId);
  };

  const handleInteractionFormWriteSubmit = async (submitedFunction: ABIItem, after: () => void) => {
    const { networkId, contractAddress, account, rawTransaction } = state;

    if (!account) {
      throw new Error('No account selected.');
    }

    try {
      const { encodeInput } = new AbiFunction(submitedFunction, []);
      const parsedInputs = reduceInputParams(submitedFunction);
      const network = getNetworkById(networkId)!;
      const data = encodeInput(parsedInputs);
      const { gasPrice, gasLimit, nonce } = rawTransaction;
      const transaction: any = {
        to: contractAddress,
        data,
        gasPrice,
        gasLimit,
        value: inputValueToHex(submitedFunction.payAmount),
        chainId: network.chainId,
        nonce
      };

      const txConfig = makeTxConfigFromTransaction(
        transaction,
        account,
        submitedFunction.payAmount
      );

      setState((prevState: InteractWithContractState) => ({
        ...prevState,
        rawTransaction: transaction,
        txConfig
      }));

      after();
    } catch (e) {
      throw e;
    }
  };

  const handleAccountSelected = (account: StoreAccount | undefined) => {
    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      account
    }));
  };

  const handleTxSigned = async (signResponse: any, after: () => void) => {
    const { account, txConfig } = state;

    if (!account) {
      return;
    }

    if (isWeb3Wallet(account.wallet)) {
      const txReceipt =
        signResponse && signResponse.hash
          ? signResponse
          : { hash: signResponse, asset: txConfig.asset };
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

  const estimateGas = async (submitedFunction: ABIItem) => {
    const { account, rawTransaction, networkId, contractAddress } = state;

    if (!account) {
      return;
    }

    const rawTransactionCopy: any = Object.assign({}, rawTransaction);

    try {
      const { encodeInput } = new AbiFunction(submitedFunction, []);
      const parsedInputs = reduceInputParams(submitedFunction);
      const network = getNetworkById(networkId)!;
      const { fast } = await fetchGasPriceEstimates(network.id);
      const gasPrice = hexWeiToString(inputGasPriceToHex(fast.toString()));
      const nonce = await getNonce(network, account);
      const data = encodeInput(parsedInputs);

      Object.assign(rawTransactionCopy, {
        to: contractAddress,
        data,
        from: account.address,
        gasPrice: addHexPrefix(new BN(gasPrice).toString(16)),
        value: inputValueToHex(submitedFunction.payAmount),
        chainId: network.chainId,
        nonce
      });
      const gasLimit = await getGasEstimate(network, rawTransactionCopy);
      rawTransactionCopy.gasLimit = hexToNumber(gasLimit);
      delete rawTransactionCopy.from;
    } catch (e) {
      throw e;
    } finally {
      setState((prevState: InteractWithContractState) => ({
        ...prevState,
        rawTransaction: rawTransactionCopy
      }));
    }
  };

  const handleGasSelectorChange = (payload: ITxConfig) => {
    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      rawTransaction: { ...prevState.rawTransaction, ...payload }
    }));
  };

  return {
    handleNetworkSelected,
    handleContractAddressChanged,
    handleContractSelected,
    handleAbiChanged,
    handleCustomContractNameChanged,
    handleSaveContractSubmit,
    updateNetworkContractOptions,
    setGeneratedFormVisible,
    handleInteractionFormSubmit,
    handleInteractionFormWriteSubmit,
    handleAccountSelected,
    handleTxSigned,
    estimateGas,
    handleGasSelectorChange,
    interactWithContractsState: state
  };
};

export { interactWithContractsInitialState, InteractWithContractsFactory };
