import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { translate, translateRaw } from 'v2/translations';
import BreakdownChart from './BreakdownChart';
import NoAssets from './NoAssets';
import { WalletBreakdownProps, Balance } from './types';
import { COLORS, BREAK_POINTS } from 'v2/theme';
import { TSymbol } from 'v2/types';
import { AssetIcon, Currency, Typography } from 'v2/components';

import moreIcon from 'common/assets/images/icn-more.svg';

export const SMALLEST_CHART_SHARE_SUPPORTED = 0.03; // 3%
export const NUMBER_OF_ASSETS_DISPLAYED = 4;

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
  margin-top: 15px;
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

  display: flex;
  flex-direction: column;

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
  align-items: center;

  &:first-of-type {
    margin-top: 16px;
  }
`;

const BreakDownBalanceAssetIcon = styled(AssetIcon)`
  margin-right: 10px;
`;

const BreakDownBalanceAssetInfo = styled.div`
  display: flex;
  align-items: center;
`;

const BreakDownBalanceAssetName = styled.div`
  margin: 0;
`;

const BreakDownBalanceAssetAmount = styled(BreakDownBalanceAssetName)`
  a {
    color: ${BRIGHT_SKY_BLUE};
  }
  ${(props: { silent?: boolean }) =>
    props.silent === true &&
    css`
      color: ${COLORS.CLOUDY_BLUE};
      font-size: 0.8em;
    `}
`;

const BalanceTotalWrapper = styled.div`
  margin-top: auto;
  margin-bottom: 30px;
`;

const BreakDownBalanceTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: normal;
`;

const ViewDetailsLink = styled.a`
  color: #1eb8e7;
`;

export default function WalletBreakdownView({
  balances,
  toggleShowChart,
  totalFiatValue,
  fiat
}: WalletBreakdownProps) {
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [previousBalances, setPreviousBalances] = useState<Balance[]>([]);

  const chartBalances = createChartBalances(balances, totalFiatValue);
  const breakdownBalances =
    balances.length > NUMBER_OF_ASSETS_DISPLAYED ? createBreakdownBalances(balances) : balances;

  const shownSelectedIndex = chartBalances.length > selectedAssetIndex ? selectedAssetIndex : 0;
  const balance = chartBalances[shownSelectedIndex];
  const selectedAssetPercentage = parseFloat(
    ((balance.fiatValue / totalFiatValue) * 100).toFixed(2)
  );
  if (chartBalances.length !== previousBalances.length) {
    setSelectedAssetIndex(0);
    setPreviousBalances(chartBalances);
  }
  return (
    <>
      <BreakDownChartWrapper>
        <BreakDownHeading>{translate('WALLET_BREAKDOWN_TITLE')}</BreakDownHeading>
        {totalFiatValue === 0 ? (
          <NoAssets />
        ) : (
          <>
            <BreakdownChart
              balances={chartBalances}
              setSelectedAssetIndex={setSelectedAssetIndex}
              selectedAssetIndex={selectedAssetIndex}
            />
            <PanelFigures>
              <PanelFigure>
                <PanelFigureValue>
                  <Typography bold={true} fontSize={'1.3rem'}>
                    {balance.name}
                  </Typography>
                </PanelFigureValue>
                <PanelFigureLabel>
                  {selectedAssetPercentage}
                  {translate('WALLET_BREAKDOWN_PERCENTAGE')}
                </PanelFigureLabel>
              </PanelFigure>
              <PanelFigure>
                <PanelFigureValue>
                  <Currency
                    amount={balance.fiatValue.toString()}
                    symbol={fiat.symbol}
                    prefix={fiat.prefix}
                    decimals={2}
                    bold={true}
                    fontSize={'1.3rem'}
                  />
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
          <BreakDownHeading>{translate('WALLET_BREAKDOWN_BALANCES')}</BreakDownHeading>
          <BreakDownMore src={moreIcon} alt="More" onClick={toggleShowChart} />
        </BreakDownHeadingWrapper>
        <BreakDownBalanceList>
          {breakdownBalances.map(({ name, amount, fiatValue, ticker, isOther }) => (
            <BreakDownBalance key={name}>
              <BreakDownBalanceAssetInfo>
                <div>
                  <BreakDownBalanceAssetIcon symbol={ticker as TSymbol} size={'26px'} />
                </div>
                <div>
                  <BreakDownBalanceAssetName>{name}</BreakDownBalanceAssetName>
                  <BreakDownBalanceAssetAmount silent={true}>
                    {!isOther && `${amount.toFixed(4)} ${ticker}`}
                  </BreakDownBalanceAssetAmount>
                </div>
              </BreakDownBalanceAssetInfo>
              <BreakDownBalanceAssetAmount>
                <Currency
                  amount={fiatValue.toString()}
                  symbol={fiat.symbol}
                  prefix={fiat.prefix}
                  decimals={2}
                />
              </BreakDownBalanceAssetAmount>
            </BreakDownBalance>
          ))}
        </BreakDownBalanceList>
        <BalanceTotalWrapper>
          <ViewDetailsLink onClick={toggleShowChart}>
            {translate('WALLET_BREAKDOWN_MORE')}
          </ViewDetailsLink>
          <PanelDivider />
          <BreakDownBalanceTotal>
            <div>{translate('WALLET_BREAKDOWN_TOTAL')}</div>
            <div>
              <Currency
                amount={totalFiatValue.toString()}
                symbol={fiat.symbol}
                prefix={fiat.prefix}
                decimals={2}
              />
            </div>
          </BreakDownBalanceTotal>
        </BalanceTotalWrapper>
      </BreakDownBalances>
    </>
  );
}

const createChartBalances = (balances: Balance[], totalFiatValue: number) => {
  /* Construct a chartBalances array which consists of assets and a otherTokensAsset
  which combines the fiat value of all remaining tokens that are in the balances array*/
  const chartBalances = balances.filter(
    balanceObject => balanceObject.fiatValue / totalFiatValue >= SMALLEST_CHART_SHARE_SUPPORTED
  );
  const otherBalances = balances.filter(
    balanceObject => balanceObject.fiatValue / totalFiatValue <= SMALLEST_CHART_SHARE_SUPPORTED
  );
  const otherTokensAsset = createOtherTokenAsset(otherBalances);
  chartBalances.push(otherTokensAsset);
  return chartBalances;
};

const createBreakdownBalances = (balances: Balance[]) => {
  /* Construct a finalBalances array which consists of top X assets and a otherTokensAsset
  which combines the fiat value of all remaining tokens that are in the balances array*/
  const otherBalances = balances.slice(NUMBER_OF_ASSETS_DISPLAYED, balances.length);
  const otherTokensAssets = createOtherTokenAsset(otherBalances);
  const finalBalances = balances.slice(0, NUMBER_OF_ASSETS_DISPLAYED);
  finalBalances.push(otherTokensAssets);
  return finalBalances;
};

const createOtherTokenAsset = (otherBalances: Balance[]) => ({
  name: translateRaw('WALLET_BREAKDOWN_OTHER'),
  ticker: translateRaw('WALLET_BREAKDOWN_OTHER_TICKER'),
  isOther: true,
  amount: 0,
  fiatValue: otherBalances.reduce((sum, asset) => {
    return (sum += asset.fiatValue);
  }, 0)
});
