import { useCallback } from 'react';

import debounce from 'lodash/debounce';

import { CREATION_ADDRESS } from '@config';
import { makePendingTxReceipt } from '@helpers';
import {
  EtherscanService,
  getGasEstimate,
  getNetworkById,
  getResolvedENSAddress,
  isValidETHAddress,
  ProviderHandler,
  useAccounts,
  useContracts,
  useNetworks
} from '@services';
import { AbiFunction } from '@services/EthService/contracts/ABIFunction';
import { getIsValidENSAddressFunction } from '@services/EthService/ens';
import { translateRaw } from '@translations';
import {
  Contract,
  ExtendedContract,
  ITxHash,
  ITxStatus,
  ITxType,
  NetworkId,
  StoreAccount,
  TAddress,
  TUuid
} from '@types';
import { addHexPrefix, bigify, isSameAddress, isWeb3Wallet, TUseStateReducerFactory } from '@utils';

import { CUSTOM_CONTRACT_ADDRESS, customContract } from './constants';
import {
  constructGasCallProps,
  makeContractInteractionTxConfig,
  reduceInputParams
} from './helpers';
import { ABIItem, InteractWithContractState } from './types';

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
  const { getContractsByNetwork, createContract, deleteContract } = useContracts();
  const { networks } = useNetworks();
  const { addTxToAccount } = useAccounts();

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
    const networkContracts = getContractsByNetwork(state.network.id);

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
      isSameAddress(c.address, address as TAddress)
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
    const contract: ExtendedContract = createContract({
      abi: state.abi,
      address: state.contractAddress as TAddress,
      name: state.customContractName,
      label: state.customContractName,
      networkId: state.network.id,
      isCustom: true
    });
    updateNetworkContractOptions();
    handleContractSelected(contract);
  };

  const handleDeleteContract = (contractUuid: TUuid) => {
    deleteContract(contractUuid);
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

    const hexlify = (str: string) => addHexPrefix(bigify(str).toString(16));

    const { network } = account;
    const { gasPrice, gasLimit, nonce } = rawTransaction;
    const transaction: any = Object.assign(
      constructGasCallProps(contractAddress, submitedFunction, account),
      {
        gasPrice: hexlify(gasPrice),
        chainId: network.chainId,
        nonce: hexlify(nonce)
      }
    );
    // check if transaction fails everytime
    await getGasEstimate(network, transaction);
    transaction.gasLimit = hexlify(gasLimit);
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
      addTxToAccount(state.txConfig.senderAccount, {
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
          addTxToAccount(state.txConfig.senderAccount, pendingTxReceipt);
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
