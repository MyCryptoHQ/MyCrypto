import { CSSProperties } from 'react';

import { COLORS } from '@theme';
import { TAssetType, TCurrencySymbol, TTicker, TUuid } from '@types';
import { getDecimals } from '@utils';

import Box from './Box';
import Currency from './Currency';
import { Text } from './NewTypography';

interface Props {
  text?: string; // Allow the caller to format text. eg. SwapQuote
  asset?: {
    // Formatted Currency display
    amount: string;
    ticker: TTicker;
    type: TAssetType;
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
        <Currency
          amount={asset.amount}
          assetType={asset.type}
          ticker={asset.ticker}
          icon={true}
          uuid={asset.uuid}
          decimals={getDecimals(asset.amount)}
        />
      )}

      {text && (
        <Text as="span" isBold={bold} textAlign="right">
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
