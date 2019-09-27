import React from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { translateRaw } from 'translations';
import { DashboardPanel, CollapsibleTable } from 'v2/components';
import { WalletBreakdownProps } from './types';
import { BREAK_POINTS } from 'v2/theme';

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
  font-size: 20px;

  @media (min-width: ${SCREEN_MD}) {
    font-size: 24px;
  }

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

const HeaderAlignment = styled.div`
  text-align: ${(props: { align?: string }) => props.align || 'inherit'};
`;

const RowAlignment = styled.div`
  float: ${(props: { align?: string }) => props.align || 'inherit'};
`;

export default function BalancesDetailView({
  balances,
  toggleShowChart,
  totalFiatValue,
  fiat
}: WalletBreakdownProps) {
  const TOKEN = translateRaw('WALLET_BREAKDOWN_TOKEN');
  const AMOUNT = translateRaw('WALLET_BREAKDOWN_AMOUNT');
  const BALANCE = translateRaw('WALLET_BREAKDOWN_BALANCE');
  const balancesTable = {
    head: [
      TOKEN,
      <HeaderAlignment key={AMOUNT} align="center">
        {AMOUNT}
      </HeaderAlignment>,
      <HeaderAlignment key={BALANCE} align="center">
        {BALANCE}
      </HeaderAlignment>
    ],
    body: balances.map((balance, index) => {
      return [
        balance.name,
        <RowAlignment key={index} align="right">
          {`${balance.amount.toFixed(6)} ${balance.ticker}`},
        </RowAlignment>,
        <RowAlignment key={index} align="right">
          {`${fiat.symbol}${balance.fiatValue.toFixed(2)}`}
        </RowAlignment>
      ];
    }),
    config: {
      primaryColumn: TOKEN,
      sortableColumn: TOKEN,
      hiddenHeadings: []
    }
  };

  return (
    <BalancesOnly>
      <DashboardPanel
        heading={
          <BackButton basic={true} onClick={toggleShowChart}>
            <img src={backArrowIcon} alt="Back arrow" /> {BALANCE}
          </BackButton>
        }
        headingRight={
          <BalancesOnlyTotal>
            {fiat.symbol}
            {totalFiatValue.toFixed(2)}
          </BalancesOnlyTotal>
        }
      >
        <CollapsibleTable {...balancesTable} />
      </DashboardPanel>
    </BalancesOnly>
  );
}
