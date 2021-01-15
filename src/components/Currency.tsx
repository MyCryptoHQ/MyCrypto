import React from 'react';

import styled from 'styled-components';

import { TCurrencySymbol, TTicker, TUuid } from '@types';
import { isFiatTicker } from '@utils';

import AssetIcon from './AssetIcon';
import { Body } from './NewTypography';

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
  color?: string;
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
  color,
  ...props
}: Props) {
  const format = (value: string, decimalPlaces: number) => {
    return new Intl.NumberFormat(navigator.language, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      ...(isFiatTicker(ticker) && { style: 'currency', currency: ticker })
    }).format(parseFloat(value));
  };

  return (
    <SContainer {...props}>
      {icon && uuid && (
        <SAssetIconContainer>
          <AssetIcon size={'19px'} uuid={uuid} />
        </SAssetIconContainer>
      )}
      <Body as="span" fontWeight={bold ? 'bold' : 'normal'} fontSize={fontSize} color={color}>
        {format(amount, decimals)}
        {!isFiatTicker(ticker) && ` ${symbol || ticker}`}
      </Body>
    </SContainer>
  );
}

export default Currency;
