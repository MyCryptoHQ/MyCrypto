import React, { CSSProperties } from 'react';

import { COLORS } from '@theme';
import { TCurrencySymbol, TTicker } from '@types';

import Box from './Box';
import Currency from './Currency';
import { Text } from './NewTypography';

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
  fiatColor = COLORS.BLUE_SKY,
  bold = false,
  alignLeft = false,
  ...rest
}: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={alignLeft ? 'flex-start' : 'flex-end'}
      {...rest}
    >
      <Text as="span" isBold={bold}>
        {assetValue}
      </Text>
      {baseAssetValue && (
        <Text as="span" isDiscrete={true} fontSize="0.9em">
          {baseAssetValue}
        </Text>
      )}
      {fiat && (
        <Currency
          amount={fiat.amount}
          symbol={fiat.symbol}
          ticker={fiat.ticker}
          decimals={2}
          color={fiatColor}
          fontSize="0.9em"
        />
      )}
    </Box>
  );
}
