import { isHexString } from 'ethjs-util';

import {
  DEFAULT_NETWORK,
  DEFAULT_NONCE,
  GAS_LIMIT_LOWER_BOUND,
  GAS_PRICE_GWEI_DEFAULT_HEX
} from '@config';
import { getGasEstimate, ProviderHandler, useAccounts } from '@services';
import { translateRaw } from '@translations';
import { ITxHash, ITxStatus, ITxType, NetworkId, StoreAccount } from '@types';
import { makePendingTxReceipt, TUseStateReducerFactory } from '@utils';
import { isWeb3Wallet } from '@utils/web3';

import { constructGasCallProps, makeDeployContractTxConfig } from './helpers';
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
    const { account, rawTransaction, byteCode } = state;

    if (!byteCode || !isHexString(byteCode)) {
      throw new Error(translateRaw('DEPLOY_ERROR_INVALID_DATA'));
    }

    if (!account) {
      throw new Error(translateRaw('DEPLOY_ERROR_NO_ACCOUNT'));
    }

    const { network } = account;
    const { gasPrice, gasLimit, nonce } = rawTransaction;
    const transaction: any = Object.assign(constructGasCallProps(byteCode, account), {
      gasPrice,
      chainId: network.chainId,
      nonce
    });
    // check if transaction fails everytime
    await getGasEstimate(network, transaction);
    transaction.gasLimit = gasLimit;
    delete transaction.from;

    const txConfig = makeDeployContractTxConfig(transaction, account, '0');

    setState((prevState: DeployContractsState) => ({
      ...prevState,
      rawTransaction: transaction,
      txConfig
    }));

    after();
  };

  const handleAccountSelected = (account: StoreAccount | undefined) => {
    setState((prevState: DeployContractsState) => ({
      ...prevState,
      account
    }));
  };

  const handleTxSigned = async (signResponse: any, after: () => void) => {
    const { account, txConfig } = state;

    if (!account) return;

    if (isWeb3Wallet(account.wallet)) {
      const txReceipt =
        signResponse && signResponse.hash ? signResponse : { ...txConfig, hash: signResponse };
      addTxToAccount(state.txConfig.senderAccount, {
        ...txReceipt,
        to: state.txConfig.receiverAddress,
        from: state.txConfig.senderAccount.address,
        amount: state.txConfig.amount,
        txType: ITxType.DEPLOY_CONTRACT,
        stage: ITxStatus.PENDING
      });
      setState((prevState: DeployContractsState) => ({
        ...prevState,
        txReceipt
      }));

      after();
    } else {
      const provider = new ProviderHandler(account.network);
      provider
        .sendRawTx(signResponse)
        .then((retrievedTxReceipt) => retrievedTxReceipt)
        .catch((hash) => provider.getTransactionByHash(hash))
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

  const handleGasSelectorChange = (payload: any) => {
    setState((prevState: DeployContractsState) => ({
      ...prevState,
      rawTransaction: { ...prevState.rawTransaction, ...payload }
    }));
  };

  return {
    handleNetworkSelected,
    handleByteCodeChanged,
    handleDeploySubmit,
    handleAccountSelected,
    handleTxSigned,
    handleGasSelectorChange,
    deployContractsState: state
  };
};

export { deployContractsInitialState, DeployContractsFactory };
