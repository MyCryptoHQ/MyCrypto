import React, { useState, useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import BN from 'bn.js';
import uniqBy from 'ramda/src/uniqBy';
import prop from 'ramda/src/prop';

import { translateRaw, Trans } from '@translations';
import { ExtendedAsset, TAddress, Network } from '@types';
import {
  EthAddress,
  Spinner,
  Checkbox,
  Button,
  Typography,
  LinkOut,
  EditableAccountLabel
} from '@components';
import { truncate, isSameAddress } from '@utils';

import { BREAK_POINTS, SPACING, COLORS } from '@theme';
import { DWAccountDisplay } from '@services';
import { fromTokenBase } from '@services/EthService/utils';
import { Identicon } from '@mycrypto/ui';
import AccountsTable from './DeterministicAccountTable';

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

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SIdenticon = styled(Identicon)`
  & > img {
    width: 30px;
    height: 30px;
  }
`;

const DPathContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DPathType = styled(Typography)`
  color: ${COLORS.BLUE_DARK};
  line-height: 18px;
`;

const DPath = styled(Typography)`
  color: ${COLORS.GREY_ATHENS};
  line-height: 18px;
`;

const LinkContainer = styled.div`
  margin-right: 40px;
`;

interface DeterministicAccountListProps {
  finishedAccounts: DWAccountDisplay[];
  asset: ExtendedAsset;
  isComplete: boolean;
  className?: string;
  currentsOnly?: boolean;
  dashboard?: boolean;
  network: Network;
  onUnlock(param: any): void;
}

interface ISelectedAccount {
  address: TAddress;
  derivationPath: string;
}

export default function DeterministicAccountList(props: DeterministicAccountListProps) {
  const { finishedAccounts, asset, isComplete, onUnlock, network } = props;
  const [selectedAccounts, setSelectedAccounts] = useState([] as ISelectedAccount[]);

  const accountsToUse = uniqBy(prop('address'), finishedAccounts).filter(
    ({ isFreshAddress, balance }) => (balance && !balance.isZero()) || isFreshAddress
  );

  const columns = useMemo(
    () => [
      {
        Header: translateRaw('DETERMINISTIC_ACCOUNT_LIST_LABEL'),
        accessor: 'label'
      },
      {
        Header: translateRaw('DETERMINISTIC_ACCOUNT_LIST_ADDRESS'),
        accessor: 'address'
      },
      {
        Header: translateRaw('DETERMINISTIC_ACCOUNT_LIST_DPATH'),
        accessor: 'dpath'
      },
      {
        Header: translateRaw('DETERMINISTIC_ACCOUNT_LIST_VALUE'),
        accessor: 'value'
      },
      {
        Header: '',
        accessor: 'ticker'
      },
      {
        Header: '',
        accessor: 'link'
      }
    ],
    []
  );

  const data = useMemo(
    () =>
      accountsToUse.map((account) => {
        return {
          label: (
            <LabelContainer>
              <SIdenticon address={account.address} />
              <EditableAccountLabel address={account.address} networkId={network.id} />
            </LabelContainer>
          ),
          address: <EthAddress address={account.address} truncate={truncate} />,
          dpath: (
            <DPathContainer>
              <DPathType>{account.pathItem.baseDPath.label.replace(/\(.*?\)/, '')}</DPathType>
              <DPath>({account.pathItem.path})</DPath>
            </DPathContainer>
          ),
          value: `${
            account.balance
              ? parseFloat(
                  fromTokenBase(new BN(account.balance.toString()), asset.decimal).toString()
                ).toFixed(4)
              : '0.0000'
          }`,
          ticker: asset.ticker,
          link: (
            <LinkContainer>
              <LinkOut
                link={
                  network.blockExplorer
                    ? network.blockExplorer.addressUrl(account.address)
                    : `https://ethplorer.io/address/${account.address}`
                }
              />
            </LinkContainer>
          )
        };
      }),
    [accountsToUse]
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

  return (
    <DeterministicAccountListWrapper>
      <AccountsTable columns={columns} data={data} />
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
        <EditableAccountLabel />
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
