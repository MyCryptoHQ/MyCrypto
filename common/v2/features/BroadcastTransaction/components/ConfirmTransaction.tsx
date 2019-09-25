import React, { useState } from 'react';
import styled from 'styled-components';
import BN from 'bn.js';

import { getNetworkByName, getNetworkByChainId, getAssetByUUID } from 'v2/services/Store';
import { ConfirmTransaction as ConfirmTransactionForm } from 'v2/features/SendAssets/components';
import { toChecksumAddressByChainId } from 'utils/formatters';
import { fromWei, ProviderHandler } from 'v2/services/EthService';
import { InlineErrorMsg } from 'v2/components/ErrorMessages';
import { translateRaw } from 'translations';

const Heading = styled.p`
  font-size: 36px;
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: bold;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 15px;
  color: ${props => props.theme.headline};
`;

const ErrorWrapper = styled(InlineErrorMsg)`
  margin-top: 12px;
`;

interface Props {
  transaction: any;
  signedTransaction: string;
  network: string;
  selectNetwork(network: string): void;
}

export default function ConfirmTransaction(props: Props) {
  const [txError, setTxError] = useState('');

  const { transaction, signedTransaction, network } = props;
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
    setTxError('');
    try {
      await provider.sendRawTx(signedTransaction);
      //TODO: Navigate to tx receipt step
    } catch (e) {
      setTxError(e.toString());
    }
  };

  return (
    <>
      <Heading>{translateRaw('CONFIRM_TX_MODAL_TITLE')}</Heading>
      <ConfirmTransactionForm onComplete={handleConfirmClick} txConfig={txConfig} />
      {txError && <ErrorWrapper>{txError}</ErrorWrapper>}
    </>
  );
}
