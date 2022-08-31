import { ComponentProps, Dispatch, Fragment, SetStateAction, useState } from 'react';

import styled from 'styled-components';

import {
  AssetIcon,
  Box,
  Currency,
  EthAddress,
  FixedSizeCollapsibleTable,
  Icon,
  TableCell,
  TableRow,
  Text,
  Tooltip,
  Typography
} from '@components';
import { COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Balance, BalanceAccount, Fiat, IAccount, TTicker, TUuid } from '@types';
import { bigify } from '@utils';

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

export type ColumnAction = ({
  uuid,
  key,
  isMobile
}: {
  uuid: TUuid;
  key: string;
  isMobile?: boolean;
}) => JSX.Element;

const createBalancesDetailViewRow = (
  balance: Balance,
  fiat: Fiat,
  rowState: 'opened' | 'closed',
  setOverlayRows: Dispatch<SetStateAction<string[]>>,
  FirstAction: ColumnAction,
  isMobile: boolean
): JSX.Element[] => {
  const onCollapseOrExpand = () => {
    if (rowState === 'closed') {
      setOverlayRows((rows) => [...rows, balance.id!.toString()]);
    } else {
      setOverlayRows((rows) => rows.filter((r) => r !== balance.id!.toString()));
    }
  };

  return [
    <Box variant="rowAlign" data-sortkey={balance.name} key={balance.id}>
      <AssetIcon mr={'0.5ch'} uuid={balance.uuid as TUuid} size="26px" />
      <Text as="span">{balance.name}</Text>
    </Box>,
    <Box key={balance.id}>
      <Text as="span">
        {balance.accounts &&
          (balance.accounts.length > 1
            ? translateRaw('WALLET_BREAKDOWN_DETAIL_ACCOUNTS', {
                $numOfAccounts: balance.accounts.length.toString()
              })
            : translateRaw('WALLET_BREAKDOWN_DETAIL_ACCOUNT', {
                $numOfAccounts: balance.accounts.length.toString()
              }))}
      </Text>
    </Box>,
    <Box key={balance.id} data-sortkey={balance.amount}>
      <Currency amount={bigify(balance.amount).toFixed(6)} ticker={balance.ticker as TTicker} />
    </Box>,
    <Box key={balance.id} data-sortkey={balance.fiatValue}>
      <Tooltip
        tooltip={translateRaw('WALLET_BREAKDOWN_BALANCE_TOOLTIP', {
          $exchangeRate: bigify(balance.exchangeRate).toFixed(3),
          $fiatTicker: fiat.ticker,
          $cryptoTicker: balance.ticker
        })}
      >
        <Currency
          amount={balance.fiatValue.toString()}
          symbol={fiat.symbol}
          ticker={fiat.ticker}
          decimals={2}
        />
      </Tooltip>
    </Box>,
    <FirstAction uuid={balance.uuid!} key={balance.id!} />,
    <>
      {isMobile ? (
        <></>
      ) : (
        <Box variant="rowAlign" key={balance.id} onClick={onCollapseOrExpand}>
          <Tooltip tooltip={translateRaw('WALLET_BREAKDOWN_SHOW_ACCOUNTS_TOOLTIP')}>
            <Box variant="columnCenter">
              <Icon
                type="expandable"
                isExpanded={rowState === 'opened'}
                height="1em"
                fill="linkAction"
              />
            </Box>
          </Tooltip>
        </Box>
      )}
    </>
  ];
};

const createAccountRow = (
  balanceAccount: BalanceAccount,
  fiat: Fiat,
  index: number
): JSX.Element[] => {
  return [
    <></>,
    <Box minWidth="140px" key={index}>
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
    </Box>,
    <Box variant="alignRight" data-balance={balanceAccount.amount} key={index}>
      {`${bigify(balanceAccount.amount).toFixed(6)} ${balanceAccount.ticker}`}
    </Box>,
    <Box variant="alignRight" key={index} data-value={balanceAccount.fiatValue}>
      <Currency
        amount={balanceAccount.fiatValue.toString()}
        symbol={fiat.symbol}
        ticker={fiat.ticker}
        decimals={2}
      />
    </Box>,
    <></>,
    <></>
  ];
};
interface BalanceDetailsTableProps {
  balances: Balance[];
  totalFiatValue: string;
  fiat: Fiat;
  accounts: IAccount[];
  selected: string[];
  firstAction: ColumnAction;
  isMobile: boolean;
}

export default function BalanceDetailsTable({
  balances,
  fiat,
  firstAction,
  isMobile = false
}: BalanceDetailsTableProps) {
  const [overlayRows, setOverlayRows] = useState<string[]>([]);
  const TOKEN = translateRaw('WALLET_BREAKDOWN_TOKEN');
  const ACCOUNTS = translateRaw('WALLET_BREAKDOWN_ACCOUNTS');
  const BALANCE = translateRaw('WALLET_BREAKDOWN_BALANCE');
  const VALUE = translateRaw('WALLET_BREAKDOWN_VALUE');
  const tableProps: ComponentProps<typeof FixedSizeCollapsibleTable> = {
    head: [TOKEN, ACCOUNTS, BALANCE, VALUE, <Fragment key={'HIDE'} />, <Fragment key={'EXPAND'} />],
    body: balances.map((balance) => {
      return createBalancesDetailViewRow(
        balance,
        fiat,
        'closed',
        setOverlayRows,
        firstAction,
        isMobile
      );
    }),
    overlay: ({ indexKey }: { indexKey: string }) => {
      const balanceRow = balances.find((b) => b.id === indexKey)!;
      return (
        <>
          <BalancesDetailViewTableRow spacingBottom="0" borderBottom={false}>
            {createBalancesDetailViewRow(
              balanceRow,
              fiat,
              'opened',
              setOverlayRows,
              firstAction,
              isMobile
            ).map((c, i) => (
              // We know that we want columns "Balance" and "Value" to align-right:
              <TableCell key={i} isReversed={i === 2 || i === 3}>
                {c}
              </TableCell>
            ))}
          </BalancesDetailViewTableRow>

          {balanceRow.accounts?.map((acc, index) => {
            const isLastItem = index + 1 >= (balanceRow.accounts?.length ?? -1);
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
          case BALANCE:
            return a.props['data-sortkey'] - b.props['data-sortkey'];
          case TOKEN:
          default: {
            const aLabel = a.props['data-sortkey'];
            const bLabel = b.props['data-sortkey'];
            return aLabel === bLabel ? true : aLabel.localeCompare(bLabel);
          }
        }
      },
      reversedColumns: [BALANCE, VALUE],
      overlayRoot: true
    }
  };

  return <FixedSizeCollapsibleTable {...tableProps} maxHeight={'450px'} />;
}
