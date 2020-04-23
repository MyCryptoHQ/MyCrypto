import React from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { DashboardPanel, CollapsibleTable, AssetIcon, Currency } from 'v2/components';
import { WalletBreakdownProps } from './types';
import { BREAK_POINTS } from 'v2/theme';
import { TSymbol } from 'v2/types';

import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

const { SCREEN_MD } = BREAK_POINTS;

const BalancesOnly = styled.div`
  width: 100%;

  > section {
    padding: 0;
    margin: 0;
  }
`;

const BackButton = styled(Button)`
  font-weight: bold;
  display: flex;
  align-items: center;

  img {
    margin-right: 13px;
    margin-top: 3px;
  }
`;

const BalancesOnlyTotal = styled.div`
  margin: 0;
  font-size: 20px;
  font-weight: bold;

  @media (min-width: ${SCREEN_MD}) {
    font-size: 24px;
  }
`;

const HeaderAlignment = styled.div<{ align?: string }>`
  display: inline-block;
  width: calc(100% - 9px - 0.5em);
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    text-align: ${({ align }) => align || 'inherit'};
  }
`;

const RowAlignment = styled.div`
  float: ${(props: { align?: string }) => props.align || 'inherit'};
`;

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const Icon = styled(AssetIcon)`
  margin-right: 10px;
`;

export default function BalancesDetailView({
  balances,
  toggleShowChart,
  totalFiatValue,
  fiat
}: WalletBreakdownProps) {
  const BALANCES = translateRaw('WALLET_BREAKDOWN_BALANCES');
  const TOKEN = translateRaw('WALLET_BREAKDOWN_TOKEN');
  const BALANCE = translateRaw('WALLET_BREAKDOWN_BALANCE');
  const VALUE = translateRaw('WALLET_BREAKDOWN_VALUE');
  const balancesTable = {
    head: [
      TOKEN,
      <HeaderAlignment key={BALANCE} align="end">
        {BALANCE}
      </HeaderAlignment>,
      <HeaderAlignment key={VALUE} align="end">
        {VALUE}
      </HeaderAlignment>
    ],
    body: balances.map((balance, index) => {
      return [
        <Label key={index}>
          <Icon symbol={balance.ticker as TSymbol} size={'2rem'} />
          {balance.name}
        </Label>,
        <RowAlignment data-balance={balance.amount} key={index} align="right">
          {`${balance.amount.toFixed(6)} ${balance.ticker}`}
        </RowAlignment>,
        <RowAlignment key={index} align="right" data-value={balance.fiatValue}>
          <Currency
            amount={balance.fiatValue.toString()}
            symbol={fiat.symbol}
            prefix={fiat.prefix}
            decimals={2}
          />
        </RowAlignment>
      ];
    }),
    config: {
      primaryColumn: TOKEN,
      sortableColumn: [TOKEN, BALANCE, VALUE],
      sortFunction: (column: typeof TOKEN | typeof BALANCE | typeof VALUE) => (a: any, b: any) => {
        switch (column) {
          case VALUE:
            const aValue = a.props['data-value'];
            const bValue = b.props['data-value'];
            return aValue - bValue;
          case BALANCE:
            const aBalance = a.props['data-balance'];
            const bBalance = b.props['data-balance'];
            return aBalance - bBalance;
          case TOKEN:
          default:
            const aLabel = a.props.children[1];
            const bLabel = b.props.children[1];
            return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
        }
      },
      hiddenHeadings: []
    }
  };

  return (
    <BalancesOnly>
      <DashboardPanel
        heading={
          <BackButton basic={true} onClick={toggleShowChart}>
            <img src={backArrowIcon} alt="Back arrow" /> {BALANCES}
          </BackButton>
        }
        headingRight={
          <BalancesOnlyTotal>
            <Currency
              amount={totalFiatValue.toString()}
              symbol={fiat.symbol}
              prefix={fiat.prefix}
              decimals={2}
            />
          </BalancesOnlyTotal>
        }
      >
        <CollapsibleTable {...balancesTable} />
      </DashboardPanel>
    </BalancesOnly>
  );
}
