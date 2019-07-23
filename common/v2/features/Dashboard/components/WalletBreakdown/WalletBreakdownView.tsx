import React, { useState } from 'react';
import styled from 'styled-components';

import { translate } from 'translations';
import BreakdownChart from './BreakdownChart';
import NoAssets from './NoAssets';
import { WalletBreakdownProps, Balance } from './types';
import { COLORS, BREAK_POINTS } from 'v2/theme';

import moreIcon from 'common/assets/images/icn-more.svg';

const { BRIGHT_SKY_BLUE } = COLORS;
const { SCREEN_MD } = BREAK_POINTS;

const BreakDownHeading = styled.div`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #424242;

  @media (min-width: ${SCREEN_MD}) {
    font-size: 24px;
  }
`;

const BreakDownChartWrapper = styled.div`
  flex: 1;
  padding-left: 15px;
  padding-top: 15px;
  padding-bottom: 15px;

  @media (max-width: ${SCREEN_MD}) {
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

const PanelDivider = styled.div<PanelDividerProps>`
  height: 1px;
  margin-bottom: 15px;
  background: #ddd;
  display: block;

  ${props =>
    props.mobileOnly &&
    `
  @media (min-width: ${SCREEN_MD}) {
    display: none;
  }`};
`;

const VerticalPanelDivider = styled.div`
  width: 1px;
  margin: 0 15px;
  background: #ddd;
  display: none;

  @media (min-width: ${SCREEN_MD}) {
    display: block;
  }
`;

const BreakDownBalances = styled.div`
  flex: 1;
  padding-right: 15px;
  padding-top: 15px;
  padding-bottom: 15px;

  @media (max-width: ${SCREEN_MD}) {
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
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [previousBalances, setPreviousBalances] = useState<Balance[]>([]);

  if (balances.length !== previousBalances.length) {
    setSelectedAssetIndex(0);
    setPreviousBalances(balances);
  }

  const shownSelectedIndex = balances.length > selectedAssetIndex ? selectedAssetIndex : 0;
  const balance = balances[shownSelectedIndex];
  const selectedAssetPercentage = Math.floor((balance.fiatValue / totalFiatValue) * 100);

  return (
    <>
      <BreakDownChartWrapper>
        <BreakDownHeading>{translate('WALLET_BREAKDOWN_TITLE')}</BreakDownHeading>
        {totalFiatValue === 0 ? (
          <NoAssets />
        ) : (
          <>
            <BreakdownChart
              balances={balances}
              setSelectedAssetIndex={setSelectedAssetIndex}
              selectedAssetIndex={selectedAssetIndex}
            />
            <PanelFigures>
              <PanelFigure>
                <PanelFigureValue>{balance.name}</PanelFigureValue>
                <PanelFigureLabel>
                  {selectedAssetPercentage}
                  {translate('WALLET_BREAKDOWN_PERCENTAGE')}
                </PanelFigureLabel>
              </PanelFigure>
              <PanelFigure>
                <PanelFigureValue>
                  {fiat.symbol}
                  {balance.fiatValue.toFixed(2)}
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
