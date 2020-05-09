import React from 'react';
import styled from 'styled-components';

import { TSymbol, TUuid } from '@types';
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
  symbol: TSymbol;
  uuid?: TUuid;
  decimals?: number;
  icon?: boolean;
  prefix?: boolean;
  bold?: boolean;
  fontSize?: string;
}

function Currency({
  amount,
  symbol,
  uuid,
  decimals = 5,
  icon = false,
  prefix = false,
  bold = false,
  fontSize,
  ...props
}: Props) {
  const format = (value: string, decimalPlaces: number) => {
    const v = parseFloat(value);
    return Number(v).toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
    // const multiplier = Math.pow(10, decimalPlaces);
    // return Math.round(v * multiplier + Number.EPSILON) / multiplier;
  };

  return (
    <SContainer {...props}>
      {icon && uuid && (
        <SAssetIconContainer>
          <AssetIcon size={'19px'} uuid={uuid} />
        </SAssetIconContainer>
      )}
      <Typography bold={bold} fontSize={fontSize}>
        {prefix && `${symbol}`}
        {format(amount, decimals)}
        {!prefix && ` ${symbol}`}
      </Typography>
    </SContainer>
  );
}

export default Currency;
