import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import BN from 'bn.js';
import { Transaction } from 'ethereumjs-tx';
import { addHexPrefix } from 'ethereumjs-util';

import { getAssetByUUID, AssetContext, NetworkContext } from 'v2/services/Store';
import { ConfirmTransaction as ConfirmTransactionForm } from 'v2/components/TransactionFlow';
import { toChecksumAddressByChainId, fromTxReceiptObj } from 'v2/utils';
import { fromWei, ProviderHandler } from 'v2/services/EthService';
import { InlineMessage } from 'v2/components/InlineMessage';
import { translateRaw } from 'v2/translations';
import { ITxReceipt, ITxConfig } from 'v2/types';
import { ToastContext } from 'v2/features/Toasts';

const ErrorWrapper = styled(InlineMessage)`
  margin-top: 12px;
`;

interface Props {
  transaction: Transaction;
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
  const { assets } = useContext(AssetContext);
  const { networks, getNetworkByChainId, getNetworkByName } = useContext(NetworkContext);

  const { transaction, signedTransaction, network, goToNextStep } = props;
  const { to, value, gasPrice, gasLimit, nonce, data } = transaction;
  const chainId = transaction.getChainId();
  const from = transaction.getSenderAddress();

  const txNetwork = chainId ? getNetworkByChainId(chainId) : getNetworkByName(network);

  if (!txNetwork) {
    return <InlineMessage>{translateRaw('BROADCAST_TX_INVALID_CHAIN_ID')}</InlineMessage>;
  }

  const txAmount = fromWei(new BN(value, 16), 'ether');
  const txBaseAsset = getAssetByUUID(assets)(txNetwork.baseAsset)!;
  const txToAddress = toChecksumAddressByChainId(to.toString('hex'), chainId);
  const txFromAddress = toChecksumAddressByChainId(from.toString('hex'), chainId);
  const txGasPrice = new BN(gasPrice, 16).toString();
  const txGasLimit = new BN(gasLimit, 16).toString();
  const txValue = new BN(value, 16).toString();
  const txNonce = new BN(nonce, 16).toString();
  const txData = addHexPrefix(data.toString('hex'));

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
      setTxReceipt(fromTxReceiptObj(response)(assets, networks) || {});
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
