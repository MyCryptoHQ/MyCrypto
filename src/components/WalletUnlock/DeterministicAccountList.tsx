import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import BN from 'bn.js';
import uniqBy from 'ramda/src/uniqBy';
import prop from 'ramda/src/prop';

import { translateRaw } from '@translations';
import { EthAddress, FixedSizeCollapsibleTable, Spinner } from '@components';
import { truncate } from '@utils';
import { BREAK_POINTS, SPACING, breakpointToNumber } from '@theme';
import { DWAccountDisplay } from '@services/WalletService/deterministic/types';
import IconArrow from '@components/IconArrow';
import { fromTokenBase } from '@services/EthService/utils';
import { ExtendedAsset } from '@types';

const HeaderAlignment = styled.div`
  ${(props: { align?: string }) => css`
    @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
      text-align: ${props.align || 'inherit'};
    }
  `};
  & img {
    margin-left: ${SPACING.XS};
  }
`;

interface DeterministicAccountListProps {
  finishedAccounts: DWAccountDisplay[];
  queuedAccounts: DWAccountDisplay[];
  totalAccounts: number;
  asset: ExtendedAsset;
  className?: string;
  currentsOnly?: boolean;
  dashboard?: boolean;
}

export default function DeterministicAccountList(props: DeterministicAccountListProps) {
  const { finishedAccounts, queuedAccounts, totalAccounts, asset } = props;
  const accountsToUse = uniqBy(prop('address'), finishedAccounts);

  return (
    <>
      <>
        {`Scanning Total: ${totalAccounts}`}
        <br />
        {`Enqueued Total: ${queuedAccounts.length}`}
        <br />
        {`Finished Total: ${finishedAccounts.length}`}
        <br />
        {finishedAccounts.length < totalAccounts && (
          <>
            <Spinner /> Scanning...
          </>
        )}
      </>
      <br />
      <FixedSizeCollapsibleTable
        breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
        maxHeight={'650px'}
        {...buildDeterministicAccountTable(accountsToUse, asset)}
      />
    </>
  );
}

type ISortTypes =
  | 'dpath'
  | 'dpath-reverse'
  | 'address'
  | 'address-reverse'
  | 'value'
  | 'value-reverse';
type IColumnValues =
  | 'DETERMINISTIC_ACCOUNT_LIST_DPATH'
  | 'DETERMINISTIC_ACCOUNT_LIST_ADDRESS'
  | 'DETERMINISTIC_ACCOUNT_LIST_VALUE';

export interface ISortingState {
  sortState: {
    DETERMINISTIC_ACCOUNT_LIST_DPATH: 'dpath' | 'dpath-reverse';
    DETERMINISTIC_ACCOUNT_LIST_ADDRESS: 'address' | 'address-reverse';
    DETERMINISTIC_ACCOUNT_LIST_VALUE: 'value' | 'value-reverse';
  };
  activeSort: ISortTypes;
}

const initialSortingState: ISortingState = {
  sortState: {
    DETERMINISTIC_ACCOUNT_LIST_DPATH: 'dpath',
    DETERMINISTIC_ACCOUNT_LIST_ADDRESS: 'address',
    DETERMINISTIC_ACCOUNT_LIST_VALUE: 'value'
  },
  activeSort: 'value'
};

// @todo - sorting
// interface ITableFullDeterministicAccountType {
//   account: DWAccountDisplay;
//   index: number;
//   label: string;
//   total: number;
//   addressCard: ExtendedAddressBook;
// }

// type TSortFunction = (a: ITableFullDeterministicAccountType, b: ITableFullDeterministicAccountType) => number;
// const getSortingFunction = (sortKey: ISortTypes): TSortFunction => {
//   switch (sortKey) {
// 		default:
//     case 'value':
//       return (a: ITableFullDeterministicAccountType, b: ITableFullDeterministicAccountType) => b.total - a.total;
//     case 'value-reverse':
//       return (a: ITableFullDeterministicAccountType, b: ITableFullDeterministicAccountType) => a.total - b.total;
//     case 'dpath':
//       return (a: ITableFullDeterministicAccountType, b: ITableFullDeterministicAccountType) => a.label.localeCompare(b.label);
//     case 'dpath-reverse':
//       return (a: ITableFullDeterministicAccountType, b: ITableFullDeterministicAccountType) => b.label.localeCompare(a.label);
//     case 'address':
//       return (a: ITableFullDeterministicAccountType, b: ITableFullDeterministicAccountType) =>
//         a.account.address.localeCompare(b.account.address);
//     case 'address-reverse':
//       return (a: ITableFullDeterministicAccountType, b: ITableFullDeterministicAccountType) =>
//         b.account.address.localeCompare(a.account.address);
//   }
// };

const buildDeterministicAccountTable = (accounts: DWAccountDisplay[], asset: ExtendedAsset) => {
  const [sortingState, setSortingState] = useState(initialSortingState);
  const nonZeroAccounts = accounts.filter(({ balance }) => balance && !balance.isZero());
  const updateSortingState = (id: IColumnValues) => {
    // In case overlay active, disable changing sorting state

    const currentBtnState = sortingState.sortState[id];
    if (currentBtnState.indexOf('-reverse') > -1) {
      const newActiveSort = currentBtnState.split('-reverse')[0] as ISortTypes;
      setSortingState({
        sortState: {
          ...sortingState.sortState,
          [id]: newActiveSort
        },
        activeSort: newActiveSort
      });
    } else {
      const newActiveSort = (currentBtnState + '-reverse') as ISortTypes;
      setSortingState({
        sortState: {
          ...sortingState.sortState,
          [id]: newActiveSort
        },
        activeSort: newActiveSort
      });
    }
  };

  const getColumnSortDirection = (id: IColumnValues): boolean =>
    sortingState.sortState[id].indexOf('-reverse') > -1;

  const convertColumnToClickable = (id: IColumnValues) => (
    <div key={id} onClick={() => updateSortingState(id)}>
      {translateRaw(id)} <IconArrow isFlipped={getColumnSortDirection(id)} />
    </div>
  );

  const columns = [
    convertColumnToClickable('DETERMINISTIC_ACCOUNT_LIST_ADDRESS'),
    <HeaderAlignment
      key={'DETERMINISTIC_ACCOUNT_LIST_VALUE'}
      align="center"
      onClick={() => updateSortingState('DETERMINISTIC_ACCOUNT_LIST_VALUE')}
    >
      {translateRaw('DETERMINISTIC_ACCOUNT_LIST_VALUE')}
      <IconArrow isFlipped={getColumnSortDirection('DETERMINISTIC_ACCOUNT_LIST_VALUE')} />
    </HeaderAlignment>,
    <HeaderAlignment
      key={'DETERMINISTIC_ACCOUNT_LIST_DPATH'}
      align="center"
      onClick={() => updateSortingState('DETERMINISTIC_ACCOUNT_LIST_DPATH')}
    >
      {translateRaw('DETERMINISTIC_ACCOUNT_LIST_DPATH')}
      <IconArrow isFlipped={getColumnSortDirection('DETERMINISTIC_ACCOUNT_LIST_DPATH')} />
    </HeaderAlignment>
  ];

  return {
    head: columns,
    body: nonZeroAccounts.map(({ address, balance, path }, index) => [
      <EthAddress key={index} address={address} truncate={truncate} />,
      <div key={index}>
        {`${
          balance
            ? parseFloat(
                fromTokenBase(new BN(balance.toString()), asset.decimal).toString()
              ).toFixed(4)
            : '0.0000'
        } ${asset.ticker}`}
      </div>,
      <div key={index}>{path}</div>
    ]),
    config: {
      primaryColumn: translateRaw('DETERMINISTIC_ACCOUNT_LIST_LABEL')
    }
  };
};
