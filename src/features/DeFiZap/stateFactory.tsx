import { useContext } from 'react';

import { TUseStateReducerFactory, makePendingTxReceipt } from '@utils';
import { isWeb3Wallet } from '@utils/web3';
import {
  Asset,
  ITxStatus,
  ITxType,
  ITxHash,
  TAddress,
  ISimpleTxFormFull,
  TStepAction
} from '@types';
import { hexWeiToString, ProviderHandler } from '@services/EthService';
import { AccountContext } from '@services/Store';

import { createSimpleTxObject } from './helpers';
import { ZapInteractionState } from './types';

const ZapInteractionFactory: TUseStateReducerFactory<ZapInteractionState> = ({
  state,
  setState
}) => {
  const { addNewTxToAccount } = useContext(AccountContext);

  const handleTxSigned = async (signResponse: any, cb: any) => {
    const { txConfig } = state;
    if (!txConfig.senderAccount) return;

    if (isWeb3Wallet(txConfig.senderAccount.wallet)) {
      const txReceipt =
        signResponse && signResponse.hash
          ? signResponse
          : { hash: signResponse, asset: txConfig.asset };
      addNewTxToAccount(state.txConfig.senderAccount, {
        ...txReceipt,
        to: state.txConfig.receiverAddress,
        from: state.txConfig.senderAccount.address,
        amount: state.txConfig.amount,
        txType: ITxType.DEFIZAP,
        stage: ITxStatus.PENDING
      });
      setState((prevState: ZapInteractionState) => ({
        ...prevState,
        txReceipt
      }));
      cb();
    } else {
      const provider = new ProviderHandler(txConfig.network);
      provider
        .sendRawTx(signResponse)
        .then((txResponse) => txResponse.hash as ITxHash)
        .catch((hash) => hash as ITxHash)
        .then((txHash) => {
          const pendingTxReceipt = makePendingTxReceipt(txHash)(ITxType.DEFIZAP, txConfig);
          addNewTxToAccount(state.txConfig.senderAccount, pendingTxReceipt);
          setState((prevState: ZapInteractionState) => ({
            ...prevState,
            txReceipt: pendingTxReceipt
          }));
          cb();
        });
    }
  };

  const handleUserInputFormSubmit: TStepAction = (payload: ISimpleTxFormFull, cb: any) => {
    const rawTransaction = createSimpleTxObject({
      ...payload,
      address: state.zapSelected!.contractAddress,
      gasLimit: state.zapSelected!.minimumGasLimit
    });

    const txConfig = {
      rawTransaction,
      amount: payload.amount,
      senderAccount: payload.account,
      receiverAddress: state.zapSelected!.contractAddress as TAddress,
      network: payload.network,
      asset: payload.asset,
      baseAsset: payload.asset || ({} as Asset),
      from: payload.account.address,
      gasPrice: hexWeiToString(rawTransaction.gasPrice),
      gasLimit: state.zapSelected!.minimumGasLimit.toString(),
      nonce: payload.nonce,
      data: '0x',
      value: hexWeiToString(rawTransaction.value)
    };
    setState({
      ...state,
      txConfig
    });
    cb();
  };

  return {
    handleUserInputFormSubmit,
    handleTxSigned,
    zapFlowState: state
  };
};

export default ZapInteractionFactory;
