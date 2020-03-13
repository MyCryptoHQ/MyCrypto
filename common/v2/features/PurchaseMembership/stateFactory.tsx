import { TUseStateReducerFactory, fromTxReceiptObj } from 'v2/utils';

import { isWeb3Wallet } from 'v2/utils/web3';
import { Asset } from 'v2/types';
import { hexWeiToString, ProviderHandler } from 'v2/services/EthService';
import { createSimpleTxObject } from './helpers';
import { MembershipPurchaseState, TStepAction, MembershipSimpleTxFormFull } from './types';
import { MEMBERSHIP_PURCHASE_GAS_LIMIT } from './config';

const MembershipPurchaseFactory: TUseStateReducerFactory<MembershipPurchaseState> = ({
  state,
  setState
}) => {
  const handleTxSigned = async (signResponse: any, cb: any) => {
    const { txConfig } = state;
    if (!txConfig.senderAccount) return;

    if (isWeb3Wallet(txConfig.senderAccount.wallet)) {
      const txReceipt =
        signResponse && signResponse.hash
          ? signResponse
          : { hash: signResponse, asset: txConfig.asset };
      setState((prevState: MembershipPurchaseState) => ({
        ...prevState,
        txReceipt
      }));
      cb();
    } else {
      const provider = new ProviderHandler(txConfig.network);
      provider
        .sendRawTx(signResponse)
        .then(retrievedTxReceipt => retrievedTxReceipt)
        .catch(hash => provider.getTransactionByHash(hash))
        .then(retrievedTransactionReceipt => {
          const txReceipt = fromTxReceiptObj(retrievedTransactionReceipt);
          setState((prevState: MembershipPurchaseState) => ({
            ...prevState,
            txReceipt
          }));
          cb();
        });
    }
  };

  const handleUserInputFormSubmit: TStepAction = (payload: MembershipSimpleTxFormFull, cb: any) => {
    const membershipSelected = payload.membershipSelected;
    const rawTransaction = createSimpleTxObject({
      ...payload,
      address: membershipSelected.contractAddress,
      gasLimit: MEMBERSHIP_PURCHASE_GAS_LIMIT
    });

    const txConfig = {
      rawTransaction,
      amount: payload.amount,
      senderAccount: payload.account,
      receiverAddress: membershipSelected.contractAddress,
      network: payload.network,
      asset: payload.asset,
      baseAsset: payload.asset || ({} as Asset),
      from: payload.account.address,
      gasPrice: hexWeiToString(rawTransaction.gasPrice),
      gasLimit: MEMBERSHIP_PURCHASE_GAS_LIMIT.toString(),
      nonce: payload.nonce,
      data: '0x',
      value: hexWeiToString(rawTransaction.value)
    };
    setState({
      ...state,
      membershipSelected,
      txConfig
    });
    cb();
  };

  return {
    handleUserInputFormSubmit,
    handleTxSigned,
    purchaseMembershipFlowState: state
  };
};

export default MembershipPurchaseFactory;
