import React from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { SwapFromToDiagram, FromToAccount } from './fields';
import { ISwapAsset } from '../types';
import { StoreAccount } from 'v2/types';
import { COLORS } from 'v2/theme';
import { DexService } from 'v2/services/ApiService/Dex';

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
  asset: ISwapAsset;
  receiveAsset: ISwapAsset;
  sendAmount: string;
  receiveAmount: string;
  account: StoreAccount;
  setRawTransaction(tx: any): void;
  setDexTrade(trade: any): void;
  goToNextStep(): void;
  makeAllowanceTransaction(trade: any): Promise<string>;
  makeTradeTransactionFromDexTrade(trade: any): Promise<string>;
}

export default function ConfirmSwap(props: Props) {
  const {
    asset,
    receiveAsset,
    sendAmount,
    receiveAmount,
    account,
    setDexTrade,
    goToNextStep,
    setRawTransaction,
    makeAllowanceTransaction,
    makeTradeTransactionFromDexTrade
  } = props;

  const handleNextClicked = async () => {
    const trade = await DexService.instance.getOrderDetailsFrom(
      asset.symbol,
      receiveAsset.symbol,
      2
    );

    setDexTrade(trade);

    const makeTransaction = trade.metadata.input
      ? makeAllowanceTransaction
      : makeTradeTransactionFromDexTrade;
    const rawTransaction = await makeTransaction(trade);
    setRawTransaction(rawTransaction);

    goToNextStep();
  };

  return (
    <div>
      <SwapFromToDiagram
        fromSymbol={asset.symbol}
        toSymbol={receiveAsset.symbol}
        fromAmount={sendAmount}
        toAmount={receiveAmount}
      />
      <FromToAccount fromAccount={account} toAccount={account} />
      <LinkLabel>why this rate?</LinkLabel>
      <ConversionRateBox>
        <ConversionLabel>Conversion Rate</ConversionLabel>1 ETH ≈ 170.2 DAI
      </ConversionRateBox>
      <StyledButton onClick={handleNextClicked}>Confirm and Send</StyledButton>
    </div>
  );
}
