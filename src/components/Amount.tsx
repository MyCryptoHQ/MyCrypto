import { CSSProperties } from 'react';

import { COLORS } from '@theme';
import { TCurrencySymbol, TTicker, TUuid } from '@types';

import Box from './Box';
import Currency from './Currency';
import { Text } from './NewTypography';

interface Props {
  text?: string; // Allow the caller to format text. eg. SwapQuote
  asset?: {
    // Formatted Currency display
    amount: string;
    ticker: TTicker;
    uuid?: TUuid;
  };
  fiat?: {
    // Converted Fiat
    amount: string;
    symbol: TCurrencySymbol;
    ticker: TTicker;
  };
  // When sending a token we display the equivalent baseAsset value.
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
  asset,
  text,
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
      {asset && (
        <Currency amount={asset.amount} ticker={asset.ticker} icon={true} uuid={asset.uuid} />
      )}

      {text && (
        <Text as="span" isBold={bold}>
          {text}
        </Text>
      )}
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
