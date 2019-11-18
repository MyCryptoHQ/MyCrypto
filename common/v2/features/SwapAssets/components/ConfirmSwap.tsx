import React from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate from 'v2/translations';

import { StoreAccount } from 'v2/types';
import { COLORS } from 'v2/theme';
import { Typography, Currency } from 'v2/components';

import { SwapFromToDiagram, FromToAccount } from './fields';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from '../types';

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

const ConversionLabel = styled(Typography)`
  color: ${GREY};
`;

const LinkLabel = styled(Typography)`
  color: ${BRIGHT_SKY_BLUE};
  cursor: pointer;
`;

const LinkLabelWrapper = styled.div`
  margin-bottom: 8px;
  text-align: right;
`;
interface Props {
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: string;
  toAmount: string;
  account: StoreAccount;
  swapPrice: number;
  lastChangedAmount: LAST_CHANGED_AMOUNT;
  isSubmitting: boolean;
  onSuccess(): void;
}

export default function ConfirmSwap(props: Props) {
  const {
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    account,
    swapPrice,
    lastChangedAmount,
    isSubmitting,
    onSuccess
  } = props;
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
      <LinkLabelWrapper>
        <LinkLabel value={translate('SWAP_WHY_RATE')} fontSize="0.8em" />
      </LinkLabelWrapper>
      <ConversionRateBox>
        <ConversionLabel bold={true} value={translate('SWAP_RATE')} fontSize="0.65em" />
        <div>
          <Currency bold={true} fontSize="1em" amount="1" symbol={fromAsset.symbol} decimals={6} />{' '}
          ≈{' '}
          <Currency
            bold={true}
            fontSize="1em"
            amount={conversionRate.toString()}
            symbol={toAsset.symbol}
            decimals={8}
          />
        </div>
      </ConversionRateBox>
      <StyledButton onClick={onSuccess}>
        {isSubmitting ? translate('SUBMITTING') : translate('CONFIRM_AND_SEND')}
      </StyledButton>
    </div>
  );
}
