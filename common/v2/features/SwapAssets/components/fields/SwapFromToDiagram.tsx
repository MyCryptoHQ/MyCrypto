import React from 'react';
import styled from 'styled-components';

import { TSymbol } from 'v2/types';
import { AssetIcon } from 'v2/components';

import arrowIcon from 'assets/images/arrow-right.svg';

interface Props {
  fromSymbol: TSymbol;
  toSymbol: TSymbol;
  fromAmount: string;
  toAmount: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 18px 0;
`;

const AssetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 15px;
  width: 128px;
`;

const Arrow = styled.img`
  width: 54px;
  height: 38px;
  margin-bottom: 64px;
`;

const AssetAmount = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-top: 14px;
  height: 50px;
  text-align: center;
`;

export default function SwapFromToDiagram(props: Props) {
  const { fromSymbol, toSymbol, fromAmount, toAmount } = props;
  return (
    <Wrapper>
      <AssetWrapper>
        <AssetIcon symbol={fromSymbol} size={'72px'} />
        <AssetAmount>
          {Number(fromAmount).toFixed(6)} {fromSymbol}
        </AssetAmount>
      </AssetWrapper>
      <Arrow src={arrowIcon} />
      <AssetWrapper>
        <AssetIcon symbol={toSymbol} size={'72px'} />
        <AssetAmount>
          {Number(toAmount).toFixed(6)} {toSymbol}
        </AssetAmount>
      </AssetWrapper>
    </Wrapper>
  );
}
