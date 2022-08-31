import { makePendingTxReceipt, makeTxFromForm } from '@helpers';
import { useAccounts, useNetworks } from '@services';
import { ProviderHandler } from '@services/EthService';
import {
  Asset,
  ISimpleTxFormFull,
  ITxConfig,
  ITxData,
  ITxHash,
  ITxStatus,
  ITxType,
  TAddress,
  TStepAction
} from '@types';
import { inputValueToHex, isWeb3Wallet, TUseStateReducerFactory } from '@utils';

import { ZapInteractionState } from './types';

const ZapInteractionFactory: TUseStateReducerFactory<ZapInteractionState> = ({
  state,
  setState
}) => {
  const { addTxToAccount } = useAccounts();
  const { getNetworkById } = useNetworks();

  const handleTxSigned = async (signResponse: any, cb: any) => {
    const { txConfig } = state;
    if (!txConfig.senderAccount) return;

    if (isWeb3Wallet(txConfig.senderAccount.wallet)) {
      const txReceipt =
        signResponse && signResponse.hash
          ? signResponse
          : { hash: signResponse, asset: txConfig.asset };
      addTxToAccount(state.txConfig.senderAccount, {
        ...txReceipt,
        to: state.txConfig.receiverAddress,
        from: state.txConfig.senderAccount.address,
        amount: state.txConfig.amount,
        txType: ITxType.DEFIZAP,
        status: ITxStatus.PENDING
      });
      setState((prevState: ZapInteractionState) => ({
        ...prevState,
        txReceipt
      }));
      cb();
    } else {
      const provider = new ProviderHandler(getNetworkById(txConfig.networkId));
      provider
        .sendRawTx(signResponse)
        .then((txResponse) => txResponse.hash as ITxHash)
        .catch((hash) => hash as ITxHash)
        .then((txHash) => {
          const pendingTxReceipt = makePendingTxReceipt(txHash)(ITxType.DEFIZAP, txConfig);
          addTxToAccount(state.txConfig.senderAccount, pendingTxReceipt);
          setState((prevState: ZapInteractionState) => ({
            ...prevState,
            txReceipt: pendingTxReceipt
          }));
          cb();
        });
    }
  };

  const handleUserInputFormSubmit: TStepAction = (payload: ISimpleTxFormFull, cb: any) => {
    const rawTransaction = makeTxFromForm(
      {
        ...payload,
        address: state.zapSelected!.contractAddress,
        gasLimit: state.zapSelected!.minimumGasLimit
      },
      inputValueToHex(payload.amount),
      '0x' as ITxData
    );

    const txConfig: ITxConfig = {
      rawTransaction,
      amount: payload.amount,
      senderAccount: payload.account,
      receiverAddress: state.zapSelected!.contractAddress as TAddress,
      networkId: payload.network.id,
      asset: payload.asset,
      baseAsset: payload.asset || ({} as Asset),
      from: payload.account.address
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
