import React from 'react';

import styled from 'styled-components';

import arrowIcon from '@assets/images/arrow-right.svg';
import { AssetIcon, Currency } from '@components';
import { FONT_SIZE } from '@theme';
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
`;

const AssetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 15px;
  width: 148px;
  height: 9em;
  text-align: center;
  & > :first-child {
    margin-bottom: 14px;
  }
`;

const Arrow = styled.img`
  width: 54px;
  height: 38px;
  margin-bottom: 25px;
`;

export default function SwapFromToDiagram(props: Props) {
  const { fromSymbol, toSymbol, fromUUID, toUUID, fromAmount, toAmount } = props;
  return (
    <Wrapper>
      <AssetWrapper>
        <AssetIcon uuid={fromUUID} size="72px" />
        <Currency
          bold={true}
          fontSize={FONT_SIZE.LG}
          amount={fromAmount}
          uuid={fromUUID}
          ticker={fromSymbol}
          decimals={6}
        />
      </AssetWrapper>
      <Arrow src={arrowIcon} />
      <AssetWrapper>
        <AssetIcon uuid={toUUID} size="72px" />
        <Currency
          bold={true}
          fontSize={FONT_SIZE.LG}
          amount={toAmount}
          uuid={toUUID}
          ticker={toSymbol}
          decimals={6}
        />
      </AssetWrapper>
    </Wrapper>
  );
}
