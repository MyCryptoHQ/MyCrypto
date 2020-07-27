import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';

import { translateRaw } from '@translations';
import {
  TableCell,
  TableRow,
  EthAddress,
  AssetIcon,
  Currency,
  Typography,
  Tooltip,
  FixedSizeCollapsibleTable
} from '@components';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { Fiat, TUuid, Balance, BalanceAccount, BalanceDetailsTableProps } from '@types';
import { CenteredIconArrow } from '@components/IconArrow';

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

const Label = styled.span<{ minWidth?: string }>`
  display: flex;
  align-items: center;
  ${({ minWidth }) => minWidth && `min-width: ${minWidth};`}
`;

const Icon = styled(AssetIcon)`
  margin-right: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

interface BalancesDetailViewTableRowProps {
  borderBottom?: boolean;
  spacingTop?: string;
  spacingBottom?: string;
  mute?: boolean;
}

const BalancesDetailViewTableRow = styled(TableRow)<BalancesDetailViewTableRowProps>`
  ${({ borderBottom }) => !borderBottom && 'border-bottom: none;'}

  > td {
    ${({ spacingTop }) => spacingTop && `padding-top: ${spacingTop};`}
    ${({ spacingBottom }) => spacingBottom && `padding-bottom: ${spacingBottom};`}
    * {
      ${({ mute }) => mute && `color: ${COLORS.GREY};`}
    }
  }
`;

const AccountOverlayButton = ({ isFlipped, onClick }: { isFlipped: boolean; onClick(): void }) => (
  <ButtonContainer onClick={() => onClick()}>
    <Tooltip tooltip={translateRaw('WALLET_BREAKDOWN_SHOW_ACCOUNTS_TOOLTIP')}>
      <CenteredIconArrow size="xl" isFlipped={isFlipped} />
    </Tooltip>
  </ButtonContainer>
);

const createBalancesDetailViewRow = (
  balance: Balance,
  fiat: Fiat,
  rowState: 'opened' | 'closed',
  setOverlayRows: Dispatch<SetStateAction<string[]>>,
  DisplayButton: ({ uuid, key }: { uuid: TUuid; key: string }) => JSX.Element
): JSX.Element[] => {
  const onCollapseOrExpand = () => {
    if (rowState === 'closed') {
      setOverlayRows((rows) => [...rows, balance.id!.toString()]);
    } else {
      setOverlayRows((rows) => rows.filter((r) => r !== balance.id!.toString()));
    }
  };

  return [
    <Label key={balance.id}>
      <Icon uuid={balance.uuid as TUuid} size={'2rem'} />
      {balance.name}
    </Label>,
    <Label key={balance.id}>
      {balance.accounts &&
        (balance.accounts.length > 1
          ? translateRaw('WALLET_BREAKDOWN_DETAIL_ACCOUNTS', {
              $numOfAccounts: balance.accounts.length.toString()
            })
          : translateRaw('WALLET_BREAKDOWN_DETAIL_ACCOUNT', {
              $numOfAccounts: balance.accounts.length.toString()
            }))}
    </Label>,
    <RowAlignment data-balance={balance.amount} key={balance.id} align="right">
      {`${balance.amount.toFixed(6)} ${balance.ticker}`}
    </RowAlignment>,
    <RowAlignment key={balance.id} align="right" data-value={balance.fiatValue}>
      <Tooltip
        tooltip={translateRaw('WALLET_BREAKDOWN_BALANCE_TOOLTIP', {
          $exchangeRate: (balance.exchangeRate || 0).toFixed(3),
          $fiatTicker: fiat.code,
          $cryptoTicker: balance.ticker
        })}
      >
        <Currency
          amount={balance.fiatValue.toString()}
          symbol={fiat.symbol}
          code={fiat.code}
          decimals={2}
        />
      </Tooltip>
    </RowAlignment>,
    <DisplayButton key={balance.id as string} uuid={balance.uuid as TUuid} />,
    <AccountOverlayButton
      key={balance.id}
      isFlipped={rowState === 'opened'}
      onClick={onCollapseOrExpand}
    />
  ];
};

const createAccountRow = (
  balanceAccount: BalanceAccount,
  fiat: Fiat,
  index: number
): JSX.Element[] => {
  return [
    <></>,
    <Label minWidth="140px" key={index}>
      <Tooltip
        tooltip={
          <>
            <Typography as="div">{balanceAccount.label}</Typography>
            <Typography as="div">{balanceAccount.address}</Typography>
          </>
        }
      >
        <EthAddress
          address={balanceAccount.address}
          isCopyable={true}
          truncate={true}
          disableTooltip={true}
        />
      </Tooltip>
    </Label>,
    <RowAlignment data-balance={balanceAccount.amount} key={index} align="right">
      {`${balanceAccount.amount.toFixed(6)} ${balanceAccount.ticker}`}
    </RowAlignment>,
    <RowAlignment key={index} align="right" data-value={balanceAccount.fiatValue}>
      <Currency
        amount={balanceAccount.fiatValue.toString()}
        symbol={fiat.symbol}
        code={fiat.code}
        decimals={2}
      />
    </RowAlignment>,
    <></>,
    <></>
  ];
};

export default function BalanceDetailsTable({
  balances,
  fiat,
  createFirstButton
}: BalanceDetailsTableProps) {
  const [overlayRows, setOverlayRows] = useState<string[]>([]);
  const TOKEN = translateRaw('WALLET_BREAKDOWN_TOKEN');
  const ACCOUNTS = translateRaw('WALLET_BREAKDOWN_ACCOUNTS');
  const BALANCE = translateRaw('WALLET_BREAKDOWN_BALANCE');
  const VALUE = translateRaw('WALLET_BREAKDOWN_VALUE');
  const balancesTable = {
    head: [
      TOKEN,
      <Label minWidth="160px" key={ACCOUNTS}>
        {ACCOUNTS}
      </Label>,
      <HeaderAlignment key={BALANCE} align="end">
        {BALANCE}
      </HeaderAlignment>,
      <HeaderAlignment key={VALUE} align="end">
        {VALUE}
      </HeaderAlignment>,
      <React.Fragment key={'HIDE'} />,
      <React.Fragment key={'EXPAND'} />
    ],
    body: balances.map((balance) => {
      return createBalancesDetailViewRow(
        balance,
        fiat,
        'closed',
        setOverlayRows,
        createFirstButton
      );
    }),
    overlay: (bId: string): JSX.Element => {
      const balanceRow = balances.find((b) => b.id === bId)!;
      return (
        <>
          <BalancesDetailViewTableRow spacingBottom="0" borderBottom={false}>
            {createBalancesDetailViewRow(
              balanceRow,
              fiat,
              'opened',
              setOverlayRows,
              createFirstButton
            ).map((c, i) => (
              <TableCell key={i}>{c}</TableCell>
            ))}
          </BalancesDetailViewTableRow>

          {balanceRow.accounts?.map((acc, index) => {
            const isLastItem = index + 1 >= (balanceRow.accounts?.length || -1);
            return (
              <BalancesDetailViewTableRow
                key={index}
                mute={true}
                spacingTop={SPACING.XS}
                spacingBottom={isLastItem ? SPACING.SM : SPACING.XS}
                borderBottom={isLastItem}
              >
                {createAccountRow(acc, fiat, index).map((c, i) => (
                  <TableCell key={i}>{c}</TableCell>
                ))}
              </BalancesDetailViewTableRow>
            );
          })}
        </>
      );
    },
    overlayRows,
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
      hiddenHeadings: [],
      overlayRoot: true
    }
  };

  return <FixedSizeCollapsibleTable {...balancesTable} maxHeight={'450px'} />;
}
