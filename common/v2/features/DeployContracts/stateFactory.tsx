import { isHexString } from 'ethjs-util';

import { TUseStateReducerFactory, fromTxReceiptObj } from 'v2/utils';
import { StoreAccount, NetworkId } from 'v2/types';
import { ProviderHandler, getGasEstimate } from 'v2/services';
import { isWeb3Wallet } from 'v2/utils/web3';
import { translateRaw } from 'v2/translations';
import { DEFAULT_NONCE, GAS_LIMIT_LOWER_BOUND, GAS_PRICE_GWEI_DEFAULT_HEX } from 'v2/config';

import { DeployContractsState } from './types';
import { makeTxConfigFromTransaction, constructGasCallProps } from './helpers';

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
  networkId: undefined
};

const DeployContractsFactory: TUseStateReducerFactory<DeployContractsState> = ({
  state,
  setState
}) => {
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

    try {
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

      const txConfig = makeTxConfigFromTransaction(transaction, account, '0');

      setState((prevState: DeployContractsState) => ({
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
        signResponse && signResponse.hash
          ? signResponse
          : { hash: signResponse, asset: txConfig.asset };
      setState((prevState: DeployContractsState) => ({
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
          setState((prevState: DeployContractsState) => ({
            ...prevState,
            txReceipt
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
