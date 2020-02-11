import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import translate, { translateRaw } from 'v2/translations';
import BreakdownChart from './BreakdownChart';
import NoAssets from './NoAssets';
import { WalletBreakdownProps, Balance } from './types';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from 'v2/theme';
import { TSymbol } from 'v2/types';
import { AssetIcon, Currency, Typography } from 'v2/components';

import moreIcon from 'common/assets/images/icn-more.svg';
import coinGeckoIcon from 'common/assets/images/credits/credits-coingecko.png'

export const SMALLEST_CHART_SHARE_SUPPORTED = 0.03; // 3%
export const NUMBER_OF_ASSETS_DISPLAYED = 4;

const BreakDownHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  margin: 0;
  font-size: ${FONT_SIZE.LG};
  font-weight: bold;
  color: ${COLORS.BLUE_DARK_SLATE};

  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    font-size: ${FONT_SIZE.XL};
    flex-direction: row;
  }
`;

const BreakDownLabel = styled.div`
  color: ${COLORS.BLUE_GREY};
  font-size: ${FONT_SIZE.BASE};
  font-style: italic;
  font-weight: normal;
  margin: ${SPACING.XS} 0 0 0;

  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    margin: 0 0 0 ${SPACING.XS};
  }
`;

const BreakDownChartWrapper = styled.div`
  position: relative;
  flex: 1;
  padding-left: ${SPACING.BASE};
  padding-top: ${SPACING.BASE};
  padding-bottom: ${SPACING.BASE};
  height: 530px;

  @media (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    padding-right: ${SPACING.BASE};
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
  font-size: ${FONT_SIZE.BASE};
  font-weight: normal;
`;

interface PanelDividerProps {
  mobileOnly?: boolean;
}

const PanelDivider = styled.div<PanelDividerProps>`
  height: 1px;
  margin-bottom: ${SPACING.BASE};
  margin-top: ${SPACING.BASE};
  background: #ddd;
  display: block;

  ${props =>
    props.mobileOnly &&
    `
  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    display: none;
  }`};
`;

const VerticalPanelDivider = styled.div`
  width: 1px;
  margin: 0 ${SPACING.BASE};
  background: ${COLORS.GREY_LIGHT};
  display: none;

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    display: block;
  }
`;

const BreakDownBalances = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: ${SPACING.BASE};
  padding-right: ${SPACING.BASE};
  padding-top: ${SPACING.BASE};

  @media (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    padding-left: ${SPACING.BASE};
  }
`;

const BreakDownHeadingWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const BreakDownMore = styled.img`
  cursor: pointer;
  display: block;
`;

const BreakDownBalanceList = styled.div`
  color: ${COLORS.GREY_DARKEST};
  display: flex;
  flex-direction: column;
  font-size: ${FONT_SIZE.BASE};
  font-weight: normal;
`;

const BreakDownBalance = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  line-height: 1.2;
  margin: ${SPACING.SM} 0;

  &:first-of-type {
    margin-top: 16px;
  }
`;

const BreakDownBalanceAssetIcon = styled(AssetIcon)`
  margin-right: ${SPACING.SM};
`;

const BreakDownBalanceAssetInfo = styled.div`
  display: flex;
  align-items: center;
`;

const BreakDownBalanceAssetName = styled.div`
  margin: 0;
  cursor: pointer;
`;

const BreakDownBalanceAssetAmount = styled(BreakDownBalanceAssetName)`
  a {
    color: ${COLORS.BLUE_BRIGHT};
  }
  ${(props: { silent?: boolean }) =>
    props.silent === true &&
    css`
      color: ${COLORS.BLUE_GREY};
      font-size: ${FONT_SIZE.SM};
    `};
`;

const BalanceTotalWrapper = styled.div`
  margin-top: auto;
`;

const BreakDownBalanceTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${FONT_SIZE.BASE};
  font-weight: normal;
`;

const ViewDetailsLink = styled.a`
  color: ${COLORS.BLUE_BRIGHT};
`;

const PoweredBy = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 14px;
  color: #b5bfc8;

  > img {
    height: 25px;
  }
`;

export default function WalletBreakdownView({
  balances,
  toggleShowChart,
  totalFiatValue,
  fiat,
  accounts,
  selected
}: WalletBreakdownProps) {
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(-1);
  const [previousBalances, setPreviousBalances] = useState<Balance[]>([]);

  const chartBalances = createChartBalances(balances, totalFiatValue);
  const breakdownBalances =
    balances.length > NUMBER_OF_ASSETS_DISPLAYED ? createBreakdownBalances(balances) : balances;

  const handleMouseOver = (_: any, index: number) => setSelectedAssetIndex(index);

  const handleMouseLeave = (_: any) => setSelectedAssetIndex(-1);

  const allVisible = accounts.length !== 0 && accounts.length === selected.length;

  const label = allVisible
    ? translateRaw('WALLET_BREAKDOWN_ALL_ACCOUNTS')
    : translateRaw('WALLET_BREAKDOWN_SOME_WALLETS', {
        $current: `${selected.length}`,
        $total: `${accounts.length}`
      });

  const shownSelectedIndex =
    chartBalances.length > selectedAssetIndex && selectedAssetIndex !== -1 ? selectedAssetIndex : 0;
  const balance = chartBalances[shownSelectedIndex];
  const selectedAssetPercentage = parseFloat(
    ((balance.fiatValue / totalFiatValue) * 100).toFixed(2)
  );
  if (chartBalances.length !== previousBalances.length) {
    setPreviousBalances(chartBalances);
  }
  return (
    <>
      <BreakDownChartWrapper>
        <BreakDownHeading>
          {translate('WALLET_BREAKDOWN_TITLE')}
          <BreakDownLabel>({label})</BreakDownLabel>
        </BreakDownHeading>
        {totalFiatValue === 0 ? (
          <NoAssets />
        ) : (
          <>
            <BreakdownChart
              balances={chartBalances}
              setSelectedAssetIndex={setSelectedAssetIndex}
              selectedAssetIndex={selectedAssetIndex}
            />
            {selectedAssetIndex !== -1 && (
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
            )}
          </>
        )}
        <PoweredBy>
          Powered by <img src={coinGeckoIcon} title="CoinGecko" alt="CoinGecko" />
        </PoweredBy>
      </BreakDownChartWrapper>
      <PanelDivider mobileOnly={true} />
      <VerticalPanelDivider />
      <BreakDownBalances>
        <BreakDownHeadingWrapper>
          <BreakDownHeading>{translate('WALLET_BREAKDOWN_BALANCES')}</BreakDownHeading>
          <BreakDownMore src={moreIcon} alt="More" onClick={toggleShowChart} />
        </BreakDownHeadingWrapper>
        <BreakDownBalanceList>
          {breakdownBalances.map(({ name, amount, fiatValue, ticker, isOther }, index) => (
            <BreakDownBalance
              key={name}
              onMouseOver={e => handleMouseOver(e, index)}
              onMouseLeave={handleMouseLeave}
            >
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
