import React from 'react';

import styled from 'styled-components';

import { AssetIcon, Currency, Icon } from '@components';
import { FONT_SIZE, SPACING } from '@theme';
import { TTicker, TUuid } from '@types';

interface Props {
  fromSymbol: TTicker;
  toSymbol: TTicker;
  fromUUID: TUuid;
  toUUID: TUuid;
  fromAmount: string;
  toAmount: string;
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 18px 0;
  background: #f8f8f8;
`;

const AssetWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 15px;
  width: 148px;
  height: 4em;
  text-align: center;
  & > :first-child {
    margin-right: ${SPACING.XS};
  }
`;

export default function SwapFromToDiagram(props: Props) {
  const { fromSymbol, toSymbol, fromUUID, toUUID, fromAmount, toAmount } = props;
  return (
    <Wrapper>
      <AssetWrapper>
        <AssetIcon uuid={fromUUID} size="24px" />
        <Currency
          bold={true}
          fontSize={FONT_SIZE.SM}
          amount={fromAmount}
          uuid={fromUUID}
          ticker={fromSymbol}
          decimals={6}
        />
      </AssetWrapper>
      <Icon type="arrow-right" width="30px" height="21px" />
      <AssetWrapper>
        <AssetIcon uuid={toUUID} size="24px" />
        <Currency
          bold={true}
          fontSize={FONT_SIZE.SM}
          amount={toAmount}
          uuid={toUUID}
          ticker={toSymbol}
          decimals={6}
        />
      </AssetWrapper>
    </Wrapper>
  );
}
