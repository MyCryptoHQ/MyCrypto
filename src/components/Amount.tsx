import React from 'react';
import styled, { css } from 'styled-components';

import { COLORS, BREAK_POINTS } from '@theme';
import { TSymbol } from '@types';

import { default as Typography } from './Typography';
import Currency from './Currency';

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

const Asset = styled(Typography)<{ discrete?: boolean }>`
  ${(props) =>
    props.discrete
      ? css`
        color: ${COLORS.BLUE_GREY};
        font-size: 0.9em;
        @media(min-width: ${BREAK_POINTS.SCREEN_XS} {
          font-size: 1em;
        })
      `
      : ``};
`;

const Fiat = styled(Currency)`
  font-size: 0.9em;
  color: ${COLORS.BLUE_GREY};
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    font-size: 1em;
  }
`;

interface Props {
  assetValue: string;
  fiat?: {
    amount: string;
    symbol: TSymbol;
  };
  baseAssetValue?: string;
  bold?: boolean;
}

// @todo:
// - accept BN instead of string for asset and fiat and define default decimals
export default function Amount({ assetValue, fiat, baseAssetValue, bold = false }: Props) {
  return (
    <SAmount>
      <Asset as="span" bold={bold}>
        {assetValue}
      </Asset>
      {baseAssetValue && (
        <Asset as="span" discrete={true}>
          {baseAssetValue}
        </Asset>
      )}
      {fiat && <Fiat amount={fiat.amount} symbol={fiat.symbol} decimals={2} />}
    </SAmount>
  );
}
