import React from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate from 'v2/translations';

import { StoreAccount } from 'v2/types';
import { COLORS } from 'v2/theme';
import { Typography, Currency } from 'v2/components';
import { FromToAccount, SwapFromToDiagram } from 'v2/components/TransactionFlow/displays';

import { IAssetPair } from '../types';

const StyledButton = styled(Button)`
  margin-top: 28px;
  width: 100%;
`;

const ConversionRateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.GREY_LIGHTEST};
  font-size: 20px;
  font-weight: bold;
  height: 150px;
`;

const ConversionLabel = styled(Typography)`
  color: ${COLORS.GREY};
`;

const LinkLabel = styled(Typography)`
  color: ${COLORS.BLUE_BRIGHT};
  cursor: pointer;
`;

const LinkLabelWrapper = styled.div`
  margin-bottom: 8px;
  text-align: right;
`;
interface Props {
  assetPair: IAssetPair;
  account: StoreAccount;
  isSubmitting: boolean;
  onClick(): void;
}

export default function ConfirmSwap({
  assetPair,
  account,
  isSubmitting,
  onClick: onSuccess
}: Props) {
  const { fromAsset, toAsset, fromAmount, toAmount, rate: exchangeRate } = assetPair;

  return (
    <div>
      <SwapFromToDiagram
        fromSymbol={fromAsset.symbol}
        toSymbol={toAsset.symbol}
        fromAmount={fromAmount.toString(10)}
        toAmount={toAmount.toString(10)}
      />
      <FromToAccount
        from={{ address: account.address, label: account.label }}
        to={{ address: account.address, label: account.label }}
      />
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
            amount={exchangeRate.toString(10)}
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
