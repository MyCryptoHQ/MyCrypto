import React from 'react';
import styled from 'styled-components';

import { TSymbol } from 'v2/types';
import { AssetIcon, Currency } from 'v2/components';
import { FONT_SIZE } from 'v2/theme';

import arrowIcon from 'assets/images/arrow-right.svg';

interface Props {
  fromSymbol: TSymbol;
  toSymbol: TSymbol;
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
  const { fromSymbol, toSymbol, fromAmount, toAmount } = props;
  return (
    <Wrapper>
      <AssetWrapper>
        <AssetIcon symbol={fromSymbol} size="72px" />
        <Currency
          bold={true}
          fontSize={FONT_SIZE.LG}
          amount={fromAmount}
          symbol={fromSymbol}
          decimals={6}
        />
      </AssetWrapper>
      <Arrow src={arrowIcon} />
      <AssetWrapper>
        <AssetIcon symbol={toSymbol} size="72px" />
        <Currency
          bold={true}
          fontSize={FONT_SIZE.LG}
          amount={toAmount}
          symbol={toSymbol}
          decimals={6}
        />
      </AssetWrapper>
    </Wrapper>
  );
}
