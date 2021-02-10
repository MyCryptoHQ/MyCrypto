import React from 'react';

import { Amount, Box, Heading, Icon, Text, TimeCountdown, Tooltip } from '@components';
import { getFiat } from '@config/fiats';
import { COLORS, SPACING } from '@theme';
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
  handleRefreshQuote(): void;
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
  settings,
  handleRefreshQuote
}: Props) => (
  <Box border="1px solid #55b6e2" p="3">
    <Box variant="rowAlign" justifyContent="space-between" mb="3">
      <Heading m="0" fontWeight="bold">
        {translateRaw('YOUR_QUOTE')}
      </Heading>
      <Box variant="rowAlign" onClick={() => handleRefreshQuote()}>
        <Icon type="refresh" width="16px" />
        <Text variant="defaultLink" ml={SPACING.XS} mb={0} color="BLUE_BRIGHT">
          {translateRaw('GET_NEW_QUOTE')}
        </Text>
      </Box>
    </Box>
    <Box variant="rowAlign" justifyContent="space-between" mb="3">
      <Box>
        {translateRaw('Amount')} <Tooltip tooltip={translateRaw('SWAP_AMOUNT_TOOLTIP')} />
      </Box>
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
      <Box>
        {translateRaw('SWAP_RATE_LABEL')} <Tooltip tooltip={translateRaw('SWAP_RATE_TOOLTIP')} />
      </Box>
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
      <Box>
        {translateRaw('MAX_TX_FEE')} <Tooltip tooltip={translateRaw('SWAP_TX_FEE_TOOLTIP')} />
      </Box>
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
      <Box>
        {translateRaw('EXPIRES_IN')} <Tooltip tooltip={translateRaw('SWAP_EXPIRY_TOOLTIP')} />
      </Box>
      <Box>
        <TimeCountdown value={parseInt(expiration, 10)} />
      </Box>
    </Box>
  </Box>
);
