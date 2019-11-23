import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import BN from 'bn.js';

import { getNetworkByName, getNetworkByChainId, getAssetByUUID } from 'v2/services/Store';
import { ConfirmTransaction as ConfirmTransactionForm } from 'v2/components/TransactionFlow';
import { toChecksumAddressByChainId, fromTxReceiptObj } from 'v2/utils';
import { fromWei, ProviderHandler } from 'v2/services/EthService';
import { InlineErrorMsg } from 'v2/components/ErrorMessages';
import { translateRaw } from 'v2/translations';
import { ITxReceipt, ITxConfig } from 'v2/types';
import { ToastContext } from 'v2/features/Toasts';

const ErrorWrapper = styled(InlineErrorMsg)`
  margin-top: 12px;
`;

interface Props {
  transaction: any;
  signedTransaction: string;
  network: string;
  goToNextStep(): void;
  selectNetwork(network: string): void;
  setTxReceipt(receipt: ITxReceipt): void;
  setTxConfig(config: ITxConfig): void;
}

export default function ConfirmTransaction(props: Props) {
  const [txError, setTxError] = useState('');
  const { displayToast, toastTemplates } = useContext(ToastContext);

  const { transaction, signedTransaction, network, goToNextStep } = props;
  const { from, to, value, _chainId, gasPrice, gasLimit, nonce, data } = transaction;

  const txNetwork = transaction._chainId
    ? getNetworkByChainId(transaction._chainId)
    : getNetworkByName(network);

  if (!txNetwork) {
    return <InlineErrorMsg>{translateRaw('BROADCAST_TX_INVALID_CHAIN_ID')}</InlineErrorMsg>;
  }

  const txAmount = fromWei(new BN(value, 16), 'ether');
  const txBaseAsset = getAssetByUUID(txNetwork.baseAsset)!;
  const txToAddress = toChecksumAddressByChainId(to.toString('hex'), _chainId);
  const txFromAddress = toChecksumAddressByChainId(from.toString('hex'), _chainId);
  const txGasPrice = new BN(gasPrice, 16).toString();
  const txGasLimit = new BN(gasLimit, 16).toString();
  const txValue = new BN(value, 16).toString();
  const txNonce = new BN(nonce, 16).toString();
  const txData = data.toString('hex');

  const txConfig: any = {
    amount: txAmount,
    receiverAddress: txToAddress,
    senderAccount: { address: txFromAddress, assets: [] },
    network: txNetwork,
    asset: txBaseAsset,
    baseAsset: txBaseAsset,
    gasPrice: txGasPrice,
    gasLimit: txGasLimit,
    value: txValue,
    nonce: txNonce,
    data: txData
  };

  const handleConfirmClick = async () => {
    const provider = new ProviderHandler(txNetwork);
    const { setTxReceipt, setTxConfig } = props;
    setTxError('');

    try {
      const response = await provider.sendRawTx(signedTransaction);
      setTxReceipt(fromTxReceiptObj(response) || {});
      setTxConfig(txConfig);
      goToNextStep();
    } catch (e) {
      setTxError(e.toString());
      displayToast(toastTemplates.failedTransaction);
    }
  };

  return (
    <>
      <ConfirmTransactionForm
        onComplete={handleConfirmClick}
        resetFlow={handleConfirmClick}
        txConfig={txConfig}
      />
      {txError && <ErrorWrapper>{txError}</ErrorWrapper>}
    </>
  );
}
