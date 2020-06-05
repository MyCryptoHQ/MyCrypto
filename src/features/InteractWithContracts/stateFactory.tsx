import { useContext, useCallback } from 'react';
import debounce from 'lodash/debounce';

import {
  TUseStateReducerFactory,
  makePendingTxReceipt,
  generateContractUUID,
  isSameAddress
} from '@utils';
import { CREATION_ADDRESS } from '@config';
import { NetworkId, Contract, StoreAccount, ITxType, ITxStatus, TAddress, ITxHash } from '@types';
import {
  getNetworkById,
  ContractContext,
  NetworkContext,
  isValidETHAddress,
  ProviderHandler,
  getGasEstimate,
  getResolvedENSAddress,
  EtherscanService,
  getIsValidENSAddressFunction,
  AccountContext
} from '@services';
import { AbiFunction } from '@services/EthService/contracts/ABIFunction';
import { isWeb3Wallet } from '@utils/web3';
import { translateRaw } from '@translations';

import { customContract, CUSTOM_CONTRACT_ADDRESS } from './constants';
import { ABIItem, InteractWithContractState } from './types';
import {
  reduceInputParams,
  constructGasCallProps,
  makeContractInteractionTxConfig
} from './helpers';

const interactWithContractsInitialState = {
  network: {},
  addressOrDomainInput: '',
  resolvingDomain: false,
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
  const { getContractsByIds, createContractWithId, deleteContracts } = useContext(ContractContext);
  const { networks, updateNetwork } = useContext(NetworkContext);
  const { addNewTxToAccount } = useContext(AccountContext);

  const handleNetworkSelected = (networkId: NetworkId) => {
    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      network: getNetworkById(networkId, networks),
      contract: undefined,
      contractAddress: '',
      addressOrDomainInput: '',
      abi: '',
      customContractName: '',
      resolvingDomain: false
    }));
  };

  const updateNetworkContractOptions = () => {
    // Get contracts for selected network
    const contractIds = state.network.contracts;
    const networkContracts = getContractsByIds(contractIds);

    const contracts = networkContracts.map((x) => Object.assign({}, x, { label: x.name }));

    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      contracts
    }));
  };

  const handleContractSelected = (contract: Contract) => {
    let contractAddress = '';
    let addressOrDomainInput = '';
    let contractAbi = '';

    if (contract.address !== CUSTOM_CONTRACT_ADDRESS && contract.abi) {
      contractAddress = contract.address;
      addressOrDomainInput = contract.address;
      contractAbi = contract.abi;
    }

    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      contract,
      contractAddress,
      addressOrDomainInput,
      abi: contractAbi,
      customContractName: '',
      resolvingDomain: false
    }));
  };

  const debouncedResolveAddressFromDomain = useCallback(
    debounce((value: string) => resolveAddressFromDomain(value), 1500),
    [state.contracts]
  );
  const handleAddressOrDomainChanged = (value: string) => {
    if (selectExistingContract(value) || value === '' || value === undefined) {
      return;
    }

    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      addressOrDomainInput: value,
      contractAddress: value,
      contract: customContract,
      abi: ''
    }));

    if (getIsValidENSAddressFunction(state.network.chainId)(value)) {
      debouncedResolveAddressFromDomain(value);
    }

    if (isValidETHAddress(value)) {
      fetchABI(value);
    }
  };

  const resolveAddressFromDomain = async (domain: string) => {
    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      resolvingDomain: true
    }));

    const resolvedAddress =
      (await getResolvedENSAddress(state.network, domain)) || CREATION_ADDRESS;

    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      contractAddress: resolvedAddress,
      resolvingDomain: false
    }));

    const exists = selectExistingContract(resolvedAddress);
    if (!exists) {
      fetchABI(resolvedAddress);
    }
  };

  const selectExistingContract = (address: string) => {
    const existingContract = state.contracts.find((c) =>
      isSameAddress(c.address as TAddress, address as TAddress)
    );
    if (existingContract) {
      handleContractSelected(existingContract);
      return true;
    }
    return false;
  };

  const fetchABI = async (address: string) => {
    const fetchedAbi = await EtherscanService.instance.getContractAbi(address, state.network.id);
    if (fetchedAbi) {
      setState((prevState: InteractWithContractState) => ({
        ...prevState,
        abi: fetchedAbi
      }));
    }
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
    if (!state.contractAddress || !state.customContractName || !state.abi) {
      throw new Error(translateRaw('INTERACT_WRITE_ERROR_MISSING_DATA'));
    }

    if (!isValidETHAddress(state.contractAddress)) {
      throw new Error(translateRaw('INTERACT_ERROR_INVALID_ADDRESS'));
    }

    try {
      JSON.parse(state.abi);
    } catch (e) {
      throw new Error(`ABI Error: ${e.message}`);
    }

    if (state.contracts.find((item) => item.name === state.customContractName)) {
      throw new Error(translateRaw('INTERACT_SAVE_ERROR_NAME_EXISTS'));
    }

    const uuid = generateContractUUID(state.network.id, state.contractAddress);
    const newContract = {
      abi: state.abi,
      address: state.contractAddress,
      name: state.customContractName,
      label: state.customContractName,
      networkId: state.network.id,
      isCustom: true,
      uuid
    };

    createContractWithId(newContract, uuid);
    const network = Object.assign({}, state.network);
    network.contracts.unshift(uuid);
    updateNetwork(network.id, network);
    updateNetworkContractOptions();
    handleContractSelected(newContract);
  };

  const handleDeleteContract = (contractUuid: string) => {
    deleteContracts(contractUuid);
    const network = state.network;
    network.contracts = network.contracts.filter((item) => item !== contractUuid);
    updateNetwork(network.id, network);
    updateNetworkContractOptions();
    handleContractSelected(customContract);
  };

  const displayGeneratedForm = (visible: boolean) => {
    if (visible) {
      if (!state.contractAddress || !state.abi) {
        throw new Error(translateRaw('INTERACT_ERROR_NO_CONTRACT_SELECTED'));
      }

      if (!isValidETHAddress(state.contractAddress)) {
        throw new Error(translateRaw('INTERACT_ERROR_INVALID_ADDRESS'));
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
    const { network, contractAddress } = state;
    const { encodeInput, decodeOutput } = new AbiFunction(submitedFunction, []);
    const parsedInputs = reduceInputParams(submitedFunction);

    const providerHandler = new ProviderHandler(network);
    const data = { to: contractAddress, data: encodeInput(parsedInputs) };

    const result = await providerHandler.call(data);

    return decodeOutput(result, network.chainId);
  };

  const handleInteractionFormWriteSubmit = async (submitedFunction: ABIItem, after: () => void) => {
    const { contractAddress, account, rawTransaction } = state;

    if (!account) {
      throw new Error(translateRaw('INTERACT_WRITE_ERROR_NO_ACCOUNT'));
    }

    try {
      const { network } = account;
      const { gasPrice, gasLimit, nonce } = rawTransaction;
      const transaction: any = Object.assign(
        constructGasCallProps(contractAddress, submitedFunction, account),
        {
          gasPrice,
          chainId: network.chainId,
          nonce
        }
      );
      // check if transaction fails everytime
      await getGasEstimate(network, transaction);
      transaction.gasLimit = gasLimit;
      delete transaction.from;

      const txConfig = makeContractInteractionTxConfig(
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
        signResponse && signResponse.hash ? signResponse : { ...txConfig, hash: signResponse };
      addNewTxToAccount(state.txConfig.senderAccount, {
        ...txReceipt,
        to: state.txConfig.receiverAddress,
        from: state.txConfig.senderAccount.address,
        amount: state.txConfig.amount,
        txType: ITxType.CONTRACT_INTERACT,
        stage: ITxStatus.PENDING
      });
      setState((prevState: InteractWithContractState) => ({
        ...prevState,
        txReceipt
      }));

      after();
    } else {
      const provider = new ProviderHandler(account.network);
      provider
        .sendRawTx(signResponse)
        .then((retrievedTxReceipt) => retrievedTxReceipt.hash as ITxHash)
        .catch((hash) => hash as ITxHash)
        .then((txHash) => {
          const pendingTxReceipt = makePendingTxReceipt(txHash)(
            ITxType.CONTRACT_INTERACT,
            state.txConfig
          );
          addNewTxToAccount(state.txConfig.senderAccount, pendingTxReceipt);
          setState((prevState: InteractWithContractState) => ({
            ...prevState,
            txReceipt: pendingTxReceipt
          }));
        })
        .finally(after);
    }
  };

  const handleGasSelectorChange = (payload: any) => {
    setState((prevState: InteractWithContractState) => ({
      ...prevState,
      rawTransaction: { ...prevState.rawTransaction, ...payload }
    }));
  };

  return {
    handleNetworkSelected,
    handleAddressOrDomainChanged,
    handleContractSelected,
    handleAbiChanged,
    handleCustomContractNameChanged,
    handleSaveContractSubmit,
    updateNetworkContractOptions,
    displayGeneratedForm,
    handleInteractionFormSubmit,
    handleInteractionFormWriteSubmit,
    handleAccountSelected,
    handleTxSigned,
    handleGasSelectorChange,
    handleDeleteContract,
    interactWithContractsState: state
  };
};

export { interactWithContractsInitialState, InteractWithContractsFactory };
