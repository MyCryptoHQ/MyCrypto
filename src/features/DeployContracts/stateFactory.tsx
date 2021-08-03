import { isHexString } from 'ethjs-util';

import {
  DEFAULT_NETWORK,
  DEFAULT_NONCE,
  GAS_LIMIT_LOWER_BOUND,
  GAS_PRICE_GWEI_DEFAULT_HEX
} from '@config';
import { makeBasicTxConfig, makePendingTxReceipt, makeTxFromForm, toTxReceipt } from '@helpers';
import { getGasEstimate, ProviderHandler, useAccounts } from '@services';
import { translateRaw } from '@translations';
import {
  ISimpleTxForm,
  ITxData,
  ITxHash,
  ITxStatus,
  ITxType,
  NetworkId,
  StoreAccount
} from '@types';
import { inputGasLimitToHex, isWeb3Wallet, TUseStateReducerFactory } from '@utils';

import { DeployContractsState } from './types';

const deployContractsInitialState = {
  account: undefined,
  rawTransaction: {
    gasPrice: GAS_PRICE_GWEI_DEFAULT_HEX,
    gasLimit: GAS_LIMIT_LOWER_BOUND,
    nonce: DEFAULT_NONCE
  },
  txConfig: undefined,
  txReceipt: undefined,
  byteCode: '',
  networkId: DEFAULT_NETWORK
};

const DeployContractsFactory: TUseStateReducerFactory<DeployContractsState> = ({
  state,
  setState
}) => {
  const { addTxToAccount } = useAccounts();

  const handleNetworkSelected = (networkId: NetworkId) => {
    setState((prevState: DeployContractsState) => ({
      ...prevState,
      networkId,
      account: undefined,
      byteCode: ''
    }));
  };

  const handleByteCodeChanged = (byteCode: string) => {
    setState((prevState: DeployContractsState) => ({
      ...prevState,
      byteCode
    }));
  };

  const handleDeploySubmit = async (after: () => void) => {
    const {
      account,
      byteCode,
      nonce,
      gasLimit,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas
    } = state;

    if (!byteCode || !isHexString(byteCode)) {
      throw new Error(translateRaw('DEPLOY_ERROR_INVALID_DATA'));
    }

    if (!account) {
      throw new Error(translateRaw('DEPLOY_ERROR_NO_ACCOUNT'));
    }

    const { network } = account;
    const { gasLimit: unusedGasLimit, to, ...transaction } = makeTxFromForm(
      {
        gasPrice,
        gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        account,
        address: '',
        network
      },
      '0',
      byteCode as ITxData
    );

    // check if transaction fails everytime
    await getGasEstimate(network, transaction);

    const tx = { ...transaction, gasLimit: inputGasLimitToHex(gasLimit) };

    const txConfig = makeBasicTxConfig(tx, account, '0');

    setState((prevState: DeployContractsState) => ({
      ...prevState,
      rawTransaction: transaction,
      txConfig
    }));

    after();
  };

  const handleAccountSelected = (account?: StoreAccount) => {
    setState((prevState: DeployContractsState) => ({
      ...prevState,
      account
    }));
  };

  const handleTxSigned = async (signResponse: any, after: () => void) => {
    const { account, txConfig } = state;

    if (!account) return;

    if (isWeb3Wallet(account.wallet)) {
      const baseTxReceipt =
        signResponse && signResponse.hash
          ? signResponse
          : toTxReceipt(signResponse, ITxStatus.PENDING)(ITxType.DEPLOY_CONTRACT, txConfig);
      const txReceipt = {
        ...baseTxReceipt,
        to: state.txConfig.receiverAddress,
        from: state.txConfig.senderAccount.address,
        amount: state.txConfig.amount
      };
      addTxToAccount(state.txConfig.senderAccount, txReceipt);
      setState((prevState: DeployContractsState) => ({
        ...prevState,
        txReceipt
      }));

      after();
    } else {
      const provider = new ProviderHandler(account.network);
      provider
        .sendRawTx(signResponse)
        .then((retrievedTransactionReceipt) => {
          const pendingTxReceipt = makePendingTxReceipt(
            retrievedTransactionReceipt.hash as ITxHash
          )(ITxType.DEPLOY_CONTRACT, txConfig);
          addTxToAccount(state.txConfig.senderAccount, pendingTxReceipt);
          setState((prevState: DeployContractsState) => ({
            ...prevState,
            txReceipt: pendingTxReceipt
          }));
        })
        .finally(after);
    }
  };

  const handleGasSelectorChange = (
    payload: Pick<ISimpleTxForm, 'gasPrice' | 'maxFeePerGas' | 'maxPriorityFeePerGas'>
  ) => {
    setState((prevState: DeployContractsState) => ({
      ...prevState,
      ...payload
    }));
  };
  const handleGasLimitChange = (gasLimit: string) => {
    setState((prevState: DeployContractsState) => ({
      ...prevState,
      gasLimit
    }));
  };

  const handleNonceChange = (nonce: string) => {
    setState((prevState: DeployContractsState) => ({
      ...prevState,
      nonce
    }));
  };

  return {
    handleNetworkSelected,
    handleByteCodeChanged,
    handleDeploySubmit,
    handleAccountSelected,
    handleTxSigned,
    handleGasSelectorChange,
    handleNonceChange,
    handleGasLimitChange,
    deployContractsState: state
  };
};

export { deployContractsInitialState, DeployContractsFactory };
