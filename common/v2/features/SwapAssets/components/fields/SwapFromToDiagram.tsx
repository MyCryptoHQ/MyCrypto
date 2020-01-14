import React from 'react';
import styled from 'styled-components';

import { TSymbol } from 'v2/types';
import { AssetIcon, Currency } from 'v2/components';

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
  margin: 0 15px;
  width: 148px;
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
        <AssetIcon symbol={fromSymbol} size="72px" />
        <AssetAmount>
          <Currency
            bold={true}
            fontSize="1em"
            amount={fromAmount}
            symbol={fromSymbol}
            decimals={6}
          />
        </AssetAmount>
      </AssetWrapper>
      <Arrow src={arrowIcon} />
      <AssetWrapper>
        <AssetIcon symbol={toSymbol} size="72px" />
        <AssetAmount>
          <Currency bold={true} fontSize="1em" amount={toAmount} symbol={toSymbol} decimals={6} />
        </AssetAmount>
      </AssetWrapper>
    </Wrapper>
  );
}
