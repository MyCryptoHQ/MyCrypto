import React from 'react';

import styled, { css } from 'styled-components';

import { BREAK_POINTS, COLORS } from '@theme';
import { TCurrencySymbol, TTicker } from '@types';

import Currency from './Currency';
import { default as Typography } from './Typography';

const SAmount = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  font-size: 16px;
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    font-size: 18px;
  }
`;

const Asset = styled(Typography)<typeof Typography & { $discrete?: boolean }>`
  ${(props) =>
    props.$discrete
      ? css`
        color: ${COLORS.BLUE_GREY};
        font-size: 0.9em;
        @media(min-width: ${BREAK_POINTS.SCREEN_XS} {
          font-size: 1em;
        })
      `
      : ``};
`;

const SCurrency = styled(Currency)`
  font-size: 0.9em;
  span {
    color: ${COLORS.BLUE_GREY};
  }
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    font-size: 1em;
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
  bold?: boolean;
}

// @todo:
// - accept BN instead of string for asset and fiat and define default decimals
export default function Amount({ assetValue, fiat, baseAssetValue, bold = false }: Props) {
  return (
    <SAmount>
      <Asset bold={bold}>{assetValue}</Asset>
      {baseAssetValue && <Asset $discrete={true}>{baseAssetValue}</Asset>}
      {fiat && (
        <SCurrency amount={fiat.amount} symbol={fiat.symbol} ticker={fiat.ticker} decimals={2} />
      )}
    </SAmount>
  );
}
