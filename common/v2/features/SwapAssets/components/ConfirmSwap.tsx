import React from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { SwapFromToDiagram, FromToAccount } from './fields';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from '../types';
import { StoreAccount, Network, WalletId } from 'v2/types';
import { COLORS } from 'v2/theme';
import { DexService } from 'v2/services/ApiService/Dex';
import { getNonce, hexToNumber, inputGasPriceToHex, hexWeiToString } from 'v2/services/EthService';
import { getGasEstimate, fetchGasPriceEstimates } from 'v2/services/ApiService';

const { SILVER, BRIGHT_SKY_BLUE, GREY } = COLORS;

const StyledButton = styled(Button)`
  margin-top: 28px;
  width: 100%;
`;

const ConversionRateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${SILVER};
  font-size: 20px;
  font-weight: bold;
  height: 150px;
`;

const ConversionLabel = styled.div`
  color: ${GREY};
  font-weight: bold;
  font-size: 13px;
`;

const LinkLabel = styled.div`
  color: ${BRIGHT_SKY_BLUE};
  font-weight: normal;
  font-size: 13px;
  margin-bottom: 8px;
  text-align: right;
  cursor: pointer;
`;
interface Props {
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: string;
  toAmount: string;
  account: StoreAccount;
  network: Network;
  swapPrice: number;
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  setRawTransaction(tx: any): void;
  setDexTrade(trade: any): void;
  goToNextStep(): void;
}

export default function ConfirmSwap(props: Props) {
  const {
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    account,
    setDexTrade,
    goToNextStep,
    setRawTransaction,
    network,
    swapPrice,
    lastChangedAmount
  } = props;

  async function getTransactionFromDexTrade(trade: any) {
    const nonce = await getNonce(network, account);
    const { fast } = await fetchGasPriceEstimates(network.id);
    let gasPrice = hexWeiToString(inputGasPriceToHex(fast.toString()));

    if (trade.metadata.gasPrice) {
      gasPrice = trade.metadata.gasPrice;
    }

    const transaction = trade.trade;
    let gasLimit = null;

    if (account.wallet !== WalletId.METAMASK) {
      gasLimit = await getGasEstimate(network, transaction);
      transaction.gasLimit = hexToNumber(gasLimit);
      transaction.nonce = nonce;
      transaction.gasPrice = Number(gasPrice);
    }

    transaction.value = Number(transaction.value);
    transaction.chainId = network.chainId;
    /* console.log('TRANSACTION', transaction); */

    return transaction;
  }

  const handleNextClicked = async () => {
    const trade = await DexService.instance.getOrderDetailsFrom(
      fromAsset.symbol,
      toAsset.symbol,
      0.0001
    );

    setDexTrade(trade);

    const rawTransaction = await getTransactionFromDexTrade(trade);
    setRawTransaction(rawTransaction);

    goToNextStep();
  };

  const conversionRate = lastChangedAmount === LAST_CHANGED_AMOUNT.TO ? 1 / swapPrice : swapPrice;

  return (
    <div>
      <SwapFromToDiagram
        fromSymbol={fromAsset.symbol}
        toSymbol={toAsset.symbol}
        fromAmount={fromAmount}
        toAmount={toAmount}
      />
      <FromToAccount fromAccount={account} toAccount={account} />
      <LinkLabel>why this rate?</LinkLabel>
      <ConversionRateBox>
        <ConversionLabel>Conversion Rate</ConversionLabel>
        {`1 ${fromAsset.symbol} ≈ ${conversionRate} ${toAsset.symbol}`}
      </ConversionRateBox>
      <StyledButton onClick={handleNextClicked}>Confirm and Send</StyledButton>
    </div>
  );
}
