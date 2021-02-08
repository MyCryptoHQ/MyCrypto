import React from 'react';

import { Amount, Box, Heading, TimeCountdown } from '@components';
import { getFiat } from '@config/fiats';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';
import { Asset, ISettings, ISwapAsset } from '@types';
import { bigify, convertToFiat } from '@utils';

interface Props {
  exchangeRate: string;
  fromAsset: ISwapAsset;
  fromAssetRate: number;
  toAsset: ISwapAsset;
  fromAmount: string;
  toAmount: string;
  baseAsset: Asset;
  baseAssetRate: number;
  settings: ISettings;
  expiration: string;
  estimatedGasFee: string;
}

export const SwapQuote = ({
  exchangeRate,
  fromAsset,
  fromAssetRate,
  toAsset,
  fromAmount,
  toAmount,
  baseAsset,
  baseAssetRate,
  estimatedGasFee,
  expiration,
  settings
}: Props) => (
  <Box border="1px solid #55b6e2" p="3">
    <Box>
      <Heading m="0">{translateRaw('YOUR_QUOTE')}</Heading>
    </Box>
    <Box variant="rowAlign" justifyContent="space-between" mb="3">
      {translateRaw('Amount')}
      <Amount
        fiatColor={COLORS.BLUE_SKY}
        assetValue={`${bigify(fromAmount).toFixed(6)} ${fromAsset.ticker} = ${bigify(
          toAmount
        ).toFixed(6)} ${toAsset.ticker}`}
        fiat={{
          symbol: getFiat(settings).symbol,
          ticker: getFiat(settings).ticker,
          amount: convertToFiat(fromAmount, fromAssetRate).toFixed(2)
        }}
      />
    </Box>
    <Box variant="rowAlign" justifyContent="space-between" mb="3">
      {translateRaw('SWAP_RATE_LABEL')}
      <Amount
        fiatColor={COLORS.BLUE_SKY}
        assetValue={`1 ${fromAsset.ticker} = ${bigify(exchangeRate).toFixed(6)} ${toAsset.ticker}`}
        fiat={{
          symbol: getFiat(settings).symbol,
          ticker: getFiat(settings).ticker,
          amount: convertToFiat(bigify(1), fromAssetRate).toFixed(2)
        }}
      />
    </Box>
    <Box variant="rowAlign" justifyContent="space-between" mb="3">
      {translateRaw('MAX_TX_FEE')}
      <Amount
        fiatColor={COLORS.BLUE_SKY}
        assetValue={`${estimatedGasFee} ${baseAsset.ticker}`}
        fiat={{
          symbol: getFiat(settings).symbol,
          ticker: getFiat(settings).ticker,
          amount: convertToFiat(estimatedGasFee, baseAssetRate).toFixed(2)
        }}
      />
    </Box>
    <Box variant="rowAlign" justifyContent="space-between">
      {translateRaw('EXPIRES_IN')}
      <Box>
        <TimeCountdown value={parseInt(expiration, 10)} />
      </Box>
    </Box>
  </Box>
);
