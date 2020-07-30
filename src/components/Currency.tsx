import React from 'react';
import styled from 'styled-components';

import { TTicker, TCurrencySymbol, TUuid } from '@types';
import { default as Typography } from './Typography';
import AssetIcon from './AssetIcon';

const SContainer = styled('div')`
  display: inline-flex;
`;

const SAssetIconContainer = styled('span')`
  padding-right: 5px;
`;

interface Props {
  amount: string;
  symbol?: TCurrencySymbol;
  ticker: TTicker;
  uuid?: TUuid;
  decimals?: number;
  icon?: boolean;
  bold?: boolean;
  fontSize?: string;
}

function Currency({
  amount,
  symbol,
  ticker,
  uuid,
  decimals = 5,
  icon = false,
  bold = false,
  fontSize,
  ...props
}: Props) {
  const format = (value: string, decimalPlaces: number) => {
    return new Intl.NumberFormat(navigator.language, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      style: ticker ? 'currency' : undefined,
      currency: ticker
    }).format(parseFloat(value));
  };

  return (
    <SContainer {...props}>
      {icon && uuid && (
        <SAssetIconContainer>
          <AssetIcon size={'19px'} uuid={uuid} />
        </SAssetIconContainer>
      )}
      <Typography bold={bold} fontSize={fontSize}>
        {format(amount, decimals)}
        {!ticker && ` ${symbol || ticker}`}
      </Typography>
    </SContainer>
  );
}

export default Currency;
