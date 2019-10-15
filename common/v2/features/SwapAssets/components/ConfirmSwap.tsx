import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { SwapFromToDiagram, FromToAccount } from './fields';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from '../types';
import { StoreAccount, ITxConfig } from 'v2/types';
import { COLORS } from 'v2/theme';
import { DexService } from 'v2/services/ApiService/Dex';
import { toFixedWithoutZero } from 'v2/utils';
import {
  makeAllowanceTransaction,
  makeTradeTransactionFromDexTrade,
  makeTxConfigFromTransaction
} from '../helpers';
import translate from 'translations';

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
  swapPrice: number;
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  setRawTransaction(tx: ITxConfig): void;
  setDexTrade(trade: any): void;
  setTxConfig(transaction: ITxConfig): void;
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
    lastChangedAmount,
    swapPrice,
    setTxConfig
  } = props;

  const isLastChangedTo = lastChangedAmount === LAST_CHANGED_AMOUNT.TO;

  const [submitting, setSubmitting] = useState(false);

  const handleNextClicked = async () => {
    try {
      const getOrderDetails = isLastChangedTo
        ? DexService.instance.getOrderDetailsTo
        : DexService.instance.getOrderDetailsFrom;

      setSubmitting(true);

      const trade = await getOrderDetails(
        fromAsset.symbol,
        toAsset.symbol,
        isLastChangedTo ? toAmount : fromAmount
      );
      setDexTrade(trade);

      const makeTransaction = trade.metadata.input
        ? makeAllowanceTransaction
        : makeTradeTransactionFromDexTrade;
      const rawTransaction = await makeTransaction(trade, account);

      const mergedTxConfig = makeTxConfigFromTransaction(
        rawTransaction,
        account,
        fromAsset,
        fromAmount
      );
      setTxConfig(mergedTxConfig);

      setRawTransaction(rawTransaction);
      setSubmitting(false);
      goToNextStep();
    } catch (e) {
      setSubmitting(false);
      console.error(e);
    }
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
      <LinkLabel>{translate('SWAP_WHY_RATE')}</LinkLabel>
      <ConversionRateBox>
        <ConversionLabel>{translate('SWAP_RATE')}</ConversionLabel>
        {`1 ${fromAsset.symbol} ≈ ${toFixedWithoutZero(conversionRate, 8)} ${toAsset.symbol}`}
      </ConversionRateBox>
      <StyledButton onClick={handleNextClicked}>
        {submitting ? translate('SUBMITTING') : translate('CONFIRM_AND_SEND')}
      </StyledButton>
    </div>
  );
}
