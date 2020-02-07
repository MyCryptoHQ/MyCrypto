import React from 'react';
import styled, { css } from 'styled-components';

import { COLORS, BREAK_POINTS } from 'v2/theme';
import { default as Typography } from './Typography';

const SAmount = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  font-size: 16px;
  @media(min-width: ${BREAK_POINTS.SCREEN_XS} {
    font-size: 18px;
  })
`;

const Asset = styled(Typography)<{ discrete?: boolean }>`
  ${props =>
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

const Fiat = styled(Typography)`
  font-size: 0.9em;
  color: ${COLORS.BLUE_GREY};
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    font-size: 1em;
  }
`;

interface Props {
  assetValue: string;
  fiatValue?: string;
  baseAssetValue?: string;
  bold?: boolean;
}

// @TODO:
// - use Currency component for Fiat
// - accept BN instead of string for asset and fiat and define default decimals
export default function Amount({ assetValue, fiatValue, baseAssetValue, bold = false }: Props) {
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
      {fiatValue && <Fiat as="span">{fiatValue}</Fiat>}
    </SAmount>
  );
}
