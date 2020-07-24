import React from 'react';
import styled from 'styled-components';

import { TTicker, TSymbol, TUuid } from '@types';
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
  symbol?: TSymbol;
  ticker?: TTicker;
  code?: TTicker; // @todo merge with ticker later
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
  code,
  ...props
}: Props) {
  const format = (value: string, decimalPlaces: number) => {
    return new Intl.NumberFormat(navigator.language, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      style: code ? 'currency' : undefined,
      currency: code
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
        {!code && ` ${symbol || ticker}`}
      </Typography>
    </SContainer>
  );
}

export default Currency;
