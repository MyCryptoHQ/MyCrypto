import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import BN from 'bn.js';
import uniqBy from 'ramda/src/uniqBy';
import prop from 'ramda/src/prop';

import { translateRaw, Trans } from '@translations';
import { ExtendedAsset, TAddress } from '@types';
import {
  EthAddress,
  FixedSizeCollapsibleTable,
  Spinner,
  Checkbox,
  Button,
  Typography
} from '@components';
import { truncate, isSameAddress } from '@utils';
import { BREAK_POINTS, SPACING, breakpointToNumber, COLORS } from '@theme';
import { DWAccountDisplay } from '@services';
import { fromTokenBase } from '@services/EthService/utils';
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

const DeterministicAccountListWrapper = styled.div`
  width: 800px;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: calc(100vw - 30px);
  }
`;

const ColumnName = styled(Typography)`
  color: ${COLORS.BLUE_DARK};
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
  const [selectedIndexes, setSelectedIndexes] = useState([] as number[]);
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

  const alreadyExistsInArray = (indexes: number[], rowIndex: number) => indexes.includes(rowIndex);

  const selectRow = (rowIndex: number) => {
    setSelectedIndexes(
      alreadyExistsInArray(selectedIndexes, rowIndex)
        ? selectedIndexes.filter((value) => value !== rowIndex)
        : [...selectedIndexes, rowIndex]
    );
  };

  return (
    <DeterministicAccountListWrapper>
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
          selectedIndexes,
          selectRow,
          toggleAccountSelection
        )}
      />
      <br />
      <Button disabled={selectedAccounts.length === 0} onClick={handleSubmit}>
        {`Add ${selectedAccounts.length} Accounts`}
      </Button>
    </DeterministicAccountListWrapper>
  );
}

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
  selectedIndexes: number[],
  selectRow: (rowIndex: number) => void,
  toggleAccountSelection: (address: string, path: string) => void
) => {
  const accountsToUse = accounts.map((account) => {
    return {
      ...account,
      isSelected: selectedAccounts.map(({ address }) => address).includes(account.address)
    };
  });

  const columns = [
    '',
    <HeaderAlignment key={'c'} align="left">
      <ColumnName bold={true}>
        <Trans id="DETERMINISTIC_ACCOUNT_LIST_LABEL" />
      </ColumnName>
    </HeaderAlignment>,
    <HeaderAlignment key={'DETERMINISTIC_ACCOUNT_LIST_ADDRESS'} align="left">
      <ColumnName bold={true}>
        <Trans id="DETERMINISTIC_ACCOUNT_LIST_ADDRESS" />
      </ColumnName>
    </HeaderAlignment>,
    <HeaderAlignment key={'DETERMINISTIC_ACCOUNT_LIST_DPATH'} align="left">
      <ColumnName bold={true}>
        <Trans id="DETERMINISTIC_ACCOUNT_LIST_DPATH" />
      </ColumnName>
    </HeaderAlignment>,
    <HeaderAlignment key={'DETERMINISTIC_ACCOUNT_LIST_VALUE'} align="center">
      <ColumnName bold={true}>
        <Trans id="DETERMINISTIC_ACCOUNT_LIST_VALUE" />
      </ColumnName>
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
      <div key={index}>
        <Identicon address={address} />
        <span>I am a label</span>
      </div>,
      <EthAddress key={index} address={address} truncate={truncate} />,
      <div key={index}>{pathItem.path}</div>,
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
      primaryColumn: translateRaw('DETERMINISTIC_ACCOUNT_LIST_LABEL'),
      handleRowClicked: selectRow
    },
    selectedIndexes
  };
};
