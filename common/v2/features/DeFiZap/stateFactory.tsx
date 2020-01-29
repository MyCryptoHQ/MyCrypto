import { TUseStateReducerFactory, fromTxReceiptObj } from 'v2/utils';

import { isWeb3Wallet } from 'v2/utils/web3';
import { ITxObject, Asset } from 'v2/types';
import { hexWeiToString, ProviderHandler } from 'v2/services/EthService';
import { createSimpleTxObject } from './helpers';
import { ZapInteractionState, TStepAction, ISimpleTxFormFull } from './types';
import { IZapConfig } from './config';

const ZapInteractionFactory: TUseStateReducerFactory<ZapInteractionState> = ({
  state,
  setState
}) => {
  const handleZapSelection = (zapSelected: IZapConfig) => {
    setState({
      ...state,
      zapSelected
    });
  };

  const handleTxSigned = async (signResponse: any, after: () => void) => {
    const { txConfig } = state;

    if (!txConfig.senderAccount) {
      return;
    }

    if (isWeb3Wallet(txConfig.senderAccount.wallet)) {
      const txReceipt =
        signResponse && signResponse.hash
          ? signResponse
          : { hash: signResponse, asset: txConfig.asset };
      setState((prevState: ZapInteractionState) => ({
        ...prevState,
        txReceipt
      }));

      after();
    } else {
      const provider = new ProviderHandler(txConfig.network);
      provider
        .sendRawTx(signResponse)
        .then(retrievedTxReceipt => retrievedTxReceipt)
        .catch(hash => provider.getTransactionByHash(hash))
        .then(retrievedTransactionReceipt => {
          const txReceipt = fromTxReceiptObj(retrievedTransactionReceipt);
          setState((prevState: ZapInteractionState) => ({
            ...prevState,
            txReceipt
          }));
        })
        .finally(after);
    }
  };

  const handleUserInputFormSubmit: TStepAction = (payload: ISimpleTxFormFull) => {
    console.debug('[ZapInteractionFactory]: fields: ', payload);
    const rawTransaction: ITxObject = createSimpleTxObject({
      ...payload,
      gasLimit: state.zapSelected!.minimumGasLimit.toString()
    });

    const txConfig = {
      rawTransaction,
      amount: payload.amount,
      senderAccount: payload.account,
      receiverAddress: state.zapSelected!.contractAddress,
      network: payload.network,
      asset: payload.asset,
      baseAsset: payload.asset || ({} as Asset),
      from: payload.account.address,
      gasPrice: hexWeiToString(rawTransaction.gasPrice),
      gasLimit: state.zapSelected!.minimumGasLimit.toString(),
      nonce: payload.nonce,
      data: rawTransaction.data,
      value: hexWeiToString(rawTransaction.value)
    };
    console.debug('[ZapInteractionFactory]: processed: ', txConfig);
    setState({
      ...state,
      txConfig
    });
  };

  return {
    handleZapSelection,
    handleUserInputFormSubmit,
    handleTxSigned,
    zapFlowState: state
  };
};

export default ZapInteractionFactory;
