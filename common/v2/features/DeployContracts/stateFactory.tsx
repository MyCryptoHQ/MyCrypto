import { useContext } from 'react';
import { isHexString } from 'ethjs-util';

import { TUseStateReducerFactory, fromTransactionResponseToITxReceipt } from 'v2/utils';
import { StoreAccount, NetworkId, ITxType, ITxStatus } from 'v2/types';
import {
  ProviderHandler,
  getGasEstimate,
  AssetContext,
  NetworkContext,
  AccountContext
} from 'v2/services';
import { isWeb3Wallet } from 'v2/utils/web3';
import { translateRaw } from 'v2/translations';
import {
  DEFAULT_NONCE,
  GAS_LIMIT_LOWER_BOUND,
  GAS_PRICE_GWEI_DEFAULT_HEX,
  DEFAULT_NETWORK
} from 'v2/config';

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
  networkId: DEFAULT_NETWORK
};

const DeployContractsFactory: TUseStateReducerFactory<DeployContractsState> = ({
  state,
  setState
}) => {
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const { addNewTransactionToAccount } = useContext(AccountContext);

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
        signResponse && signResponse.hash ? signResponse : { ...txConfig, hash: signResponse };
      addNewTransactionToAccount(state.txConfig.senderAccount, {
        ...txReceipt,
        to: state.txConfig.receiverAddress,
        from: state.txConfig.senderAccount.address,
        amount: state.txConfig.amount,
        type: ITxType.DEPLOY_CONTRACT,
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
        .then(retrievedTxReceipt => retrievedTxReceipt)
        .catch(hash => provider.getTransactionByHash(hash))
        .then(retrievedTransactionReceipt => {
          const txReceipt = fromTransactionResponseToITxReceipt(retrievedTransactionReceipt)(
            assets,
            networks
          );
          addNewTransactionToAccount(state.txConfig.senderAccount, {
            ...txReceipt!,
            type: ITxType.DEPLOY_CONTRACT,
            stage: ITxStatus.PENDING
          });
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
