import styled from 'styled-components';

import { AssetIcon, Currency, Icon } from '@components';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
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
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 18px 0;
  background: ${COLORS.GREY_LIGHTEST};
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
        <AssetIcon uuid={fromUUID} size="40px" />
        <Currency
          bold={true}
          fontSize={FONT_SIZE.XS}
          amount={fromAmount}
          uuid={fromUUID}
          ticker={fromSymbol}
          decimals={6}
        />
      </AssetWrapper>
      <Icon type="arrow-right" width="30px" height="21px" />
      <AssetWrapper>
        <AssetIcon uuid={toUUID} size="40px" />
        <Currency
          bold={true}
          fontSize={FONT_SIZE.XS}
          amount={toAmount}
          uuid={toUUID}
          ticker={toSymbol}
          decimals={6}
        />
      </AssetWrapper>
    </Wrapper>
  );
}
