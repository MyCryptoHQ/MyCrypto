import React from 'react';
import { Button, CollapsibleTable } from '@mycrypto/ui';
import styled from 'styled-components';

import { translateRaw } from 'translations';
import DashboardPanel from '../DashboardPanel';
import { WalletBreakdownProps } from './types';
import { BREAK_POINTS } from 'v2/features/constants';

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
    head: [TOKEN, AMOUNT, BALANCE],
    body: balances.map(balance => {
      return [
        balance.name,
        `${balance.amount} ${balance.ticker}`,
        `${fiat.symbol}${balance.fiatValue.toFixed(2)}`
      ];
    }),
    config: {
      primaryColumn: TOKEN,
      sortableColumn: TOKEN,
      hiddenHeadings: [AMOUNT]
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
