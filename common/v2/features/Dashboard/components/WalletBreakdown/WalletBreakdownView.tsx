import React from 'react';
import styled from 'styled-components';

import { translate } from 'translations';
import BreakdownChart from './BreakdownChart';
import NoAssets from './NoAssets';
import { WalletBreakdownProps } from './types';
import { COLORS } from 'v2/features/constants';

import moreIcon from 'common/assets/images/icn-more.svg';

const { BRIGHT_SKY_BLUE } = COLORS;

const BreakDownHeading = styled.div`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #424242;

  @media (min-width: 1080px) {
    font-size: 24px;
  }
`;

const BreakDownChartWrapper = styled.div`
  flex: 1;
  padding-left: 15px;
  padding-top: 15px;
  padding-bottom: 15px;

  @media (max-width: 1080px) {
    padding-right: 15px;
  }
`;

const PanelFigures = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 30px 0;
`;

const PanelFigure = styled.div``;

const PanelFigureValue = styled.div`
  margin: 0;
  font-size: 22px;
  font-weight: bold;
`;

const PanelFigureLabel = styled.div`
  margin: 0;
  font-size: 16px;
  font-weight: normal;
`;

interface PanelDividerProps {
  mobileOnly?: boolean;
}

const PanelDivider =
  styled.div <
  PanelDividerProps >
  `
  height: 1px;
  margin-bottom: 15px;
  background: #ddd;
  display: block;

  ${props =>
    props.mobileOnly &&
    `
  @media (min-width: 1080px) {
    display: none;
  }`};
`;

const VerticalPanelDivider = styled.div`
  width: 1px;
  margin: 0 15px;
  background: #ddd;
  display: none;

  @media (min-width: 1080px) {
    display: block;
  }
`;

const BreakDownBalances = styled.div`
  flex: 1;
  padding-right: 15px;
  padding-top: 15px;
  padding-bottom: 15px;

  @media (max-width: 1080px) {
    padding-left: 15px;
  }
`;

const BreakDownHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BreakDownMore = styled.img`
  display: block;
  cursor: pointer;
`;

const BreakDownBalanceList = styled.div`
  display: flex;
  flex-direction: column;
  color: #282d32;
  font-size: 16px;
  font-weight: normal;
`;

const BreakDownBalance = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 11px 0;
  line-height: 1.2;

  &:first-of-type {
    margin-top: 16px;
  }
`;

const BreakDownBalanceAssetName = styled.div`
  margin: 0;
`;

const BreakDownBalanceAssetAmount = styled(BreakDownBalanceAssetName)`
  a {
    color: ${BRIGHT_SKY_BLUE};
  }
`;

const BreakDownBalanceTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: normal;
`;

export default function WalletBreakdownView({
  balances,
  toggleShowChart,
  totalFiatValue,
  fiat
}: WalletBreakdownProps) {
  const highestPercentageAssetName = balances.length > 0 && balances[0].name;
  const highestPercentage =
    balances.length > 0 && Math.floor(balances[0].fiatValue / totalFiatValue * 100);

  return (
    <>
      <BreakDownChartWrapper>
        <BreakDownHeading>{translate('WALLET_BREAKDOWN_TITLE')}</BreakDownHeading>
        {totalFiatValue === 0 ? (
          <NoAssets />
        ) : (
          <>
            <BreakdownChart balances={balances} />
            <PanelFigures>
              <PanelFigure>
                <PanelFigureValue>{highestPercentageAssetName}</PanelFigureValue>
                <PanelFigureLabel>
                  {highestPercentage}
                  {translate('WALLET_BREAKDOWN_PERCENTAGE')}
                </PanelFigureLabel>
              </PanelFigure>
              <PanelFigure>
                <PanelFigureValue>
                  {fiat.symbol}
                  {balances[0].fiatValue.toFixed(2)}
                </PanelFigureValue>
                <PanelFigureLabel>
                  {translate('WALLET_BREAKDOWN_VALUE_IN')} {fiat.name}
                </PanelFigureLabel>
              </PanelFigure>
            </PanelFigures>
          </>
        )}
      </BreakDownChartWrapper>
      <PanelDivider mobileOnly={true} />
      <VerticalPanelDivider />
      <BreakDownBalances>
        <BreakDownHeadingWrapper>
          <BreakDownHeading>{translate('WALLET_BREAKDOWN_BALANCE')}</BreakDownHeading>
          <BreakDownMore src={moreIcon} alt="More" onClick={toggleShowChart} />
        </BreakDownHeadingWrapper>
        <BreakDownBalanceList>
          {balances.map(({ name, amount, fiatValue, ticker, isOther }) => (
            <BreakDownBalance key={name}>
              <div>
                <BreakDownBalanceAssetName>{name}</BreakDownBalanceAssetName>
                <BreakDownBalanceAssetAmount>
                  {!isOther ? (
                    `${amount.toFixed(4)} ${ticker}`
                  ) : (
                    <a onClick={toggleShowChart}>{translate('WALLET_BREAKDOWN_MORE')}</a>
                  )}
                </BreakDownBalanceAssetAmount>
              </div>
              <BreakDownBalanceAssetAmount>
                {fiat.symbol}
                {fiatValue.toFixed(2)}
              </BreakDownBalanceAssetAmount>
            </BreakDownBalance>
          ))}
          <PanelDivider />
          <BreakDownBalanceTotal>
            <div>{translate('WALLET_BREAKDOWN_TOTAL')}</div>
            <div>
              {fiat.symbol}
              {totalFiatValue.toFixed(2)}
            </div>
          </BreakDownBalanceTotal>
        </BreakDownBalanceList>
      </BreakDownBalances>
    </>
  );
}
