import React, { CSSProperties } from 'react';

import styled from 'styled-components';

import { COLORS } from '@theme';
import { TCurrencySymbol, TTicker } from '@types';

import Currency from './Currency';
import { Text } from './NewTypography';

const SAmount = styled.div<{ alignLeft: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${({ alignLeft }) => (alignLeft ? 'flex-start' : 'flex-end')};
`;

const SCurrency = styled(Currency)<{ fiatColor: string }>`
  font-size: 0.8em;
  span {
    color: ${(props) => props.fiatColor};
  }
`;

interface Props {
  assetValue: string;
  fiat?: {
    amount: string;
    symbol: TCurrencySymbol;
    ticker: TTicker;
  };
  baseAssetValue?: string;
  fiatColor?: string;
  bold?: boolean;
  style?: CSSProperties;
  alignLeft?: boolean;
}

// @todo:
// - accept BN instead of string for asset and fiat
// - define default decimals
export default function Amount({
  assetValue,
  baseAssetValue,
  fiat,
  fiatColor = COLORS.BLUE_GREY,
  bold = false,
  alignLeft = false,
  ...rest
}: Props) {
  return (
    <SAmount alignLeft={alignLeft} {...rest}>
      <Text as="span" isBold={bold}>
        {assetValue}
      </Text>
      {baseAssetValue && (
        <Text as="span" isDiscrete={true} fontSize="0.85em">
          {baseAssetValue}
        </Text>
      )}
      {fiat && (
        <SCurrency
          amount={fiat.amount}
          symbol={fiat.symbol}
          ticker={fiat.ticker}
          decimals={2}
          fiatColor={fiatColor}
        />
      )}
    </SAmount>
  );
}
