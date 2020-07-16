import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import BN from 'bn.js';
import uniqBy from 'ramda/src/uniqBy';
import prop from 'ramda/src/prop';

import { translateRaw, Trans } from '@translations';
import { ExtendedAsset, TAddress } from '@types';
import { EthAddress, FixedSizeCollapsibleTable, Spinner, Checkbox, Button } from '@components';
import { isSameAddress } from '@utils';
import { BREAK_POINTS, SPACING, breakpointToNumber } from '@theme';
import { DWAccountDisplay } from '@services';
import { fromTokenBase } from '@services/EthService/utils';
import IconArrow from '@components/IconArrow';
import { Identicon } from '@mycrypto/ui';

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
  asset: ExtendedAsset;
  isComplete: boolean;
  className?: string;
  currentsOnly?: boolean;
  dashboard?: boolean;
  onUnlock(param: any): void;
}

interface ISelectedAccount {
  address: TAddress;
  derivationPath: string;
}

export default function DeterministicAccountList(props: DeterministicAccountListProps) {
  const { finishedAccounts, asset, isComplete, onUnlock } = props;
  const [selectedAccounts, setSelectedAccounts] = useState([] as ISelectedAccount[]);
  const accountsToUse = uniqBy(prop('address'), finishedAccounts).filter(
    ({ isFreshAddress, balance }) => (balance && !balance.isZero()) || isFreshAddress
  );
  const handleSubmit = () => {
    onUnlock(selectedAccounts);
  };

  useEffect(() => {
    const selected = uniqBy(
      prop('address'),
      accountsToUse.map(({ address, pathItem }) => ({
        address,
        derivationPath: pathItem.path
      })) as ISelectedAccount[]
    );
    setSelectedAccounts(selected);
  }, [accountsToUse.length]);

  const toggleAccountSelection = (accountAddress: TAddress, accountPath: string) => {
    const newSelectedAccount: ISelectedAccount = {
      address: accountAddress,
      derivationPath: accountPath
    };
    const isPresent = selectedAccounts.find(({ address }) =>
      isSameAddress(newSelectedAccount.address, address)
    );
    setSelectedAccounts(
      isPresent
        ? selectedAccounts.filter(({ address }) =>
            isSameAddress(newSelectedAccount.address, address)
          )
        : [...selectedAccounts, newSelectedAccount]
    );
  };

  return (
    <>
      <>
        {`Scanned Total: ${finishedAccounts.length}`}
        <br />
        {`isComplete: ${isComplete}`}
        <br />
        {!isComplete && (
          <>
            <Spinner /> Scanning...
          </>
        )}
      </>
      <br />
      <FixedSizeCollapsibleTable
        breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
        maxHeight={'750px'}
        {...buildDeterministicAccountTable(
          accountsToUse,
          selectedAccounts,
          asset,
          toggleAccountSelection
        )}
      />
      <br />
      <Button disabled={selectedAccounts.length === 0} onClick={handleSubmit}>
        {`Add ${selectedAccounts.length} Accounts`}
      </Button>
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

const buildDeterministicAccountTable = (
  accounts: DWAccountDisplay[],
  selectedAccounts: ISelectedAccount[],
  asset: ExtendedAsset,
  toggleAccountSelection: (address: string, path: string) => void
) => {
  const [sortingState, setSortingState] = useState(initialSortingState);

  const accountsToUse = accounts.map((account) => {
    return {
      ...account,
      isSelected: selectedAccounts.map(({ address }) => address).includes(account.address)
    };
  });

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
    '',
    <HeaderAlignment
      key={'DETERMINISTIC_ACCOUNT_LIST_LABEL'}
      align="left"
      onClick={() => updateSortingState('DETERMINISTIC_ACCOUNT_LIST_VALUE')}
    >
      <Trans id="DETERMINISTIC_ACCOUNT_LIST_LABEL" />
    </HeaderAlignment>,
    convertColumnToClickable('DETERMINISTIC_ACCOUNT_LIST_ADDRESS'),
    <HeaderAlignment
      key={'DETERMINISTIC_ACCOUNT_LIST_DPATH'}
      align="center"
      onClick={() => updateSortingState('DETERMINISTIC_ACCOUNT_LIST_DPATH')}
    >
      {translateRaw('DETERMINISTIC_ACCOUNT_LIST_DPATH')}
      <IconArrow isFlipped={getColumnSortDirection('DETERMINISTIC_ACCOUNT_LIST_DPATH')} />
    </HeaderAlignment>,
    <HeaderAlignment
      key={'DETERMINISTIC_ACCOUNT_LIST_VALUE'}
      align="center"
      onClick={() => updateSortingState('DETERMINISTIC_ACCOUNT_LIST_VALUE')}
    >
      {translateRaw('DETERMINISTIC_ACCOUNT_LIST_VALUE')}
      <IconArrow isFlipped={getColumnSortDirection('DETERMINISTIC_ACCOUNT_LIST_VALUE')} />
    </HeaderAlignment>,
    ''
  ];
  return {
    head: columns,
    body: accountsToUse.map(({ address, balance, pathItem, isSelected }, index) => [
      <Checkbox
        key={index}
        name={address}
        checked={isSelected}
        onChange={() => toggleAccountSelection(address, pathItem.path)}
      />,
<<<<<<< HEAD
      <EthAddress key={index} address={address} truncate={true} />,
=======
      <div key={index}>
        <Identicon address={address} />
        <span>I am a label</span>
      </div>,
      <EthAddress key={index} address={address} truncate={truncate} />,
      <div key={index}>{pathItem.path}</div>,
>>>>>>> start with dpath table
      <div key={index}>
        {`${
          balance
            ? parseFloat(
                fromTokenBase(new BN(balance.toString()), asset.decimal).toString()
              ).toFixed(4)
            : '0.0000'
        }`}
      </div>,
      <div key={index}>{asset.ticker}</div>
    ]),
    config: {
      primaryColumn: translateRaw('DETERMINISTIC_ACCOUNT_LIST_LABEL')
    }
  };
};
