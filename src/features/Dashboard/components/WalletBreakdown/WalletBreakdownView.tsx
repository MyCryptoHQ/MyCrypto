import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import styled, { css } from 'styled-components';

import {
  AssetIcon,
  Currency,
  Icon,
  LinkApp,
  PoweredByText,
  SkeletonLoader,
  Tooltip,
  Typography
} from '@components';
import { EMPTYUUID } from '@config';
import { buildTotalFiatValue } from '@helpers';
import { isScanning as isScanningSelector, useSelector } from '@store';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { Balance, TTicker, TUuid } from '@types';
import { bigify } from '@utils';

import BreakdownChart from './BreakdownChart';
import { calculateShownIndex } from './helpers';
import NoAssets from './NoAssets';
import { BalancesDetailProps } from './types';

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
  height: 544px;

  @media (max-width: ${BREAK_POINTS.SCREEN_MD}) {
    padding-right: ${SPACING.BASE};
  }
`;

const PanelFigures = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0;
  & > div:last-child {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  svg {
    width: 160px;
  }
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

  ${(props) =>
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

const BreakDownMore = styled(Icon)`
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
  padding: ${SPACING.SM} 0;

  &:first-of-type {
    padding-top: 16px;
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

const BreakDownBalanceChange = styled(BreakDownBalanceAssetName)<{ change: number }>`
  text-align: right;
  font-size: ${FONT_SIZE.SM};
  color: ${(props) => (props.change > 0 ? COLORS.SUCCESS_GREEN_LIGHT : COLORS.ERROR_RED_LIGHT)};
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

const PoweredBy = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
`;

const initialSelectedAssetIndex = { chart: -1, balance: 0 };

export default function WalletBreakdownView({
  balances,
  toggleShowChart,
  totalFiatValue,
  fiat,
  accounts,
  selected
}: BalancesDetailProps) {
  const isScanning = useSelector(isScanningSelector);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(initialSelectedAssetIndex);
  const [isChartAnimating, setIsChartAnimating] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [previousTickers, setPreviousTickers] = useState(balances.map((x) => x.ticker));
  const chartBalances = createChartBalances(balances, totalFiatValue);
  const breakdownBalances = createBreakdownBalances(balances);

  const handleMouseOver = (index: number) => {
    if (isChartAnimating) return;

    const shownSelectedIndex = calculateShownIndex(chartBalances.length, index);
    setSelectedAssetIndex({ chart: shownSelectedIndex, balance: shownSelectedIndex });
  };

  const handleMouseLeave = () => {
    if (isChartAnimating) return;

    setSelectedAssetIndex((pos) => ({ ...pos, chart: -1 }));
  };

  const allVisible = accounts.length !== 0 && accounts.length === selected.length;

  const label = allVisible
    ? translateRaw('WALLET_BREAKDOWN_ALL_ACCOUNTS')
    : translateRaw('WALLET_BREAKDOWN_SOME_WALLETS', {
        $current: `${selected.length}`,
        $total: `${accounts.length}`
      });

  useEffect(() => {
    setShouldAnimate(true);
    setSelectedAssetIndex(initialSelectedAssetIndex);
  }, [selected]);

  useEffect(() => {
    // enable animations and reset selected asset when order of balances change
    const tickers = balances.map((x) => x.ticker);
    if (
      previousTickers.length !== tickers.length ||
      previousTickers.some((x, i) => x !== tickers[i])
    ) {
      setShouldAnimate(true);
      setSelectedAssetIndex(initialSelectedAssetIndex);
    }
    setPreviousTickers(tickers);
  }, [balances]);

  const balance = chartBalances[selectedAssetIndex.balance];
  const selectedAssetPercentage =
    balance &&
    new BigNumber(balance.fiatValue)
      .dividedBy(new BigNumber(totalFiatValue))
      .multipliedBy(100)
      .toFixed(2);

  return (
    <>
      <BreakDownChartWrapper>
        <BreakDownHeading>
          {translate('WALLET_BREAKDOWN_TITLE')}
          <BreakDownLabel>({label})</BreakDownLabel>
        </BreakDownHeading>
        {!isScanning && bigify(totalFiatValue).eq(0) ? (
          <NoAssets numOfAssets={balances.length} />
        ) : (
          <>
            <BreakdownChart
              balances={chartBalances}
              selectedAssetIndex={selectedAssetIndex.chart}
              handleMouseOver={handleMouseOver}
              handleMouseLeave={handleMouseLeave}
              setIsChartAnimating={setIsChartAnimating}
              isChartAnimating={isChartAnimating}
              shouldAnimate={shouldAnimate}
              setShouldAnimate={setShouldAnimate}
              isScanning={isScanning}
            />
            {balance && (
              <PanelFigures>
                <PanelFigure>
                  <PanelFigureValue>
                    {isScanning ? (
                      <SkeletonLoader type="account-list-value" />
                    ) : (
                      <Typography bold={true} fontSize={'1.3rem'}>
                        {balance.name}
                      </Typography>
                    )}
                  </PanelFigureValue>
                  <PanelFigureLabel>
                    {isScanning ? (
                      <SkeletonLoader type="wallet-breakdown-total-small" />
                    ) : (
                      <>
                        {selectedAssetPercentage}
                        {translate('WALLET_BREAKDOWN_PERCENTAGE')}
                      </>
                    )}
                  </PanelFigureLabel>
                </PanelFigure>
                <PanelFigure>
                  <PanelFigureValue>
                    {isScanning ? (
                      <SkeletonLoader type="account-list-value" />
                    ) : (
                      <Currency
                        amount={balance.fiatValue.toString()}
                        symbol={fiat.symbol}
                        ticker={fiat.ticker}
                        decimals={2}
                        bold={true}
                        fontSize={'1.3rem'}
                      />
                    )}
                  </PanelFigureValue>
                  <PanelFigureLabel>
                    {isScanning ? (
                      <SkeletonLoader type="wallet-breakdown-total-small" />
                    ) : (
                      <>
                        {translate('WALLET_BREAKDOWN_VALUE_IN')} {fiat.ticker}
                      </>
                    )}
                  </PanelFigureLabel>
                </PanelFigure>
              </PanelFigures>
            )}
          </>
        )}
        <PoweredBy>
          <PoweredByText provider="COINGECKO" />
        </PoweredBy>
      </BreakDownChartWrapper>
      <PanelDivider mobileOnly={true} />
      <VerticalPanelDivider />
      <BreakDownBalances>
        <BreakDownHeadingWrapper>
          <BreakDownHeading>{translate('WALLET_BREAKDOWN_BALANCES')}</BreakDownHeading>
          <BreakDownMore type="more" height="24px" alt="More" onClick={toggleShowChart} />
        </BreakDownHeadingWrapper>
        <BreakDownBalanceList>
          {isScanning && (
            <div style={{ paddingTop: '16px' }}>
              <SkeletonLoader type="wallet-breakdown-balances" />{' '}
            </div>
          )}
          {!isScanning &&
            breakdownBalances.map(
              ({ name, amount, fiatValue, ticker, isOther, exchangeRate, uuid, change }, index) => (
                <BreakDownBalance
                  key={`${uuid}${name}`}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <BreakDownBalanceAssetInfo>
                    <div>
                      <BreakDownBalanceAssetIcon uuid={uuid as TUuid} size={'26px'} />
                    </div>
                    <div>
                      <BreakDownBalanceAssetName>{name}</BreakDownBalanceAssetName>
                      <BreakDownBalanceAssetAmount silent={true}>
                        {!isOther && (
                          <Currency amount={bigify(amount).toFixed(4)} ticker={ticker as TTicker} />
                        )}
                      </BreakDownBalanceAssetAmount>
                    </div>
                  </BreakDownBalanceAssetInfo>
                  <Tooltip
                    tooltip={translateRaw('WALLET_BREAKDOWN_BALANCE_TOOLTIP', {
                      $exchangeRate: bigify(exchangeRate).toFixed(3),
                      $fiatTicker: fiat.ticker,
                      $cryptoTicker: ticker
                    })}
                  >
                    <BreakDownBalanceAssetAmount>
                      <Currency
                        amount={fiatValue.toString()}
                        symbol={fiat.symbol}
                        ticker={fiat.ticker}
                        decimals={2}
                      />
                    </BreakDownBalanceAssetAmount>
                    {change != null && change !== 0 && (
                      <BreakDownBalanceChange change={change}>
                        {change > 0 && '+'}
                        {change.toFixed(2)}%
                      </BreakDownBalanceChange>
                    )}
                  </Tooltip>
                </BreakDownBalance>
              )
            )}
        </BreakDownBalanceList>
        <BalanceTotalWrapper>
          {!isScanning && (
            <LinkApp href="#" onClick={toggleShowChart}>
              {translate('WALLET_BREAKDOWN_MORE')}
            </LinkApp>
          )}
          <PanelDivider />
          {isScanning ? (
            <SkeletonLoader type="wallet-breakdown-totals" />
          ) : (
            <BreakDownBalanceTotal>
              <div>{translate('WALLET_BREAKDOWN_TOTAL')}</div>
              <div data-testid="walletbreakdown-total">
                <Currency
                  amount={totalFiatValue.toString()}
                  symbol={fiat.symbol}
                  ticker={fiat.ticker}
                  decimals={2}
                />
              </div>
            </BreakDownBalanceTotal>
          )}
        </BalanceTotalWrapper>
      </BreakDownBalances>
    </>
  );
}

const createChartBalances = (balances: Balance[], totalFiatValue: string) => {
  /* Construct a chartBalances array which consists of assets and a otherTokensAsset
  which combines the fiat value of all remaining tokens that are in the balances array*/
  const balancesVisibleInChart = balances.filter((balanceObject) =>
    bigify(balanceObject.fiatValue)
      .dividedBy(bigify(totalFiatValue))
      .isGreaterThanOrEqualTo(SMALLEST_CHART_SHARE_SUPPORTED)
  );
  const otherBalances = balances.filter((balanceObject) =>
    bigify(balanceObject.fiatValue)
      .dividedBy(bigify(totalFiatValue))
      .isLessThan(SMALLEST_CHART_SHARE_SUPPORTED)
  );
  const chartBalances = balancesVisibleInChart.splice(0, NUMBER_OF_ASSETS_DISPLAYED);
  otherBalances.push(...balancesVisibleInChart);
  const otherTokensAsset = createOtherTokenAsset(otherBalances);
  chartBalances.push(otherTokensAsset);
  return chartBalances;
};

const createBreakdownBalances = (balances: Balance[]) => {
  /* Construct a finalBalances array which consists of top X assets and a otherTokensAsset
  which combines the fiat value of all remaining tokens that are in the balances array*/
  if (balances.length <= NUMBER_OF_ASSETS_DISPLAYED) return balances;

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
  amount: '0',
  exchangeRate: '0',
  uuid: EMPTYUUID as TUuid,
  fiatValue: buildTotalFiatValue(otherBalances)
});
