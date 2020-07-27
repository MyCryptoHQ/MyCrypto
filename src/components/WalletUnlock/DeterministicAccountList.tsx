import React, { useState, useEffect, useMemo, useContext } from 'react';
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
import Icon from '@components/Icon';
import { truncate, isSameAddress } from '@utils';

import { BREAK_POINTS, SPACING, COLORS } from '@theme';
import { DWAccountDisplay, AddressBookContext } from '@services';
import { fromTokenBase } from '@services/EthService/utils';
import { Identicon } from '@mycrypto/ui';
import AccountsTable from './DeterministicAccountTable';

const DeterministicAccountListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
  min-height: 500px;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: calc(100vw - 30px);
  }
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 225px;
`;

const SIdenticon = styled(Identicon)`
  margin-right: ${SPACING.SM};
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
  margin-right: 30px;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const GenerateAddressButton = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  padding-left: 45px;
  border-bottom: 1px solid ${COLORS.GREY_ATHENS};
`;

const STypography = styled(Typography)`
  margin-left: ${SPACING.SM};
`;

const StatusBar = styled.div`
  width: 100%;
  padding-top: 42px;
  display: flex;
  border-top: 1px solid ${COLORS.GREY_ATHENS};
`;

interface DeterministicAccountListProps {
  finishedAccounts: DWAccountDisplay[];
  asset: ExtendedAsset;
  isComplete: boolean;
  className?: string;
  currentsOnly?: boolean;
  dashboard?: boolean;
  network: Network;
  generateFreshAddress(): void;
  onUnlock(param: any): void;
}

interface ISelectedAccount {
  address: TAddress;
  derivationPath: string;
}

export default function DeterministicAccountList(props: DeterministicAccountListProps) {
  const { finishedAccounts, asset, isComplete, onUnlock, network, generateFreshAddress } = props;
  const { getContactByAddressAndNetworkId } = useContext(AddressBookContext);
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
              <EditableAccountLabel
                addressBookEntry={getContactByAddressAndNetworkId(account.address, network.id)}
                address={account.address}
                networkId={network.id}
              />
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
      <TableWrapper>
        <AccountsTable columns={columns} data={data} />
        <GenerateAddressButton onClick={() => generateFreshAddress()}>
          <Icon type="add" />
          <STypography>
            <Trans id="DETERMINISTIC_GENERATE_FRESH_ADDRESS" />
          </STypography>
        </GenerateAddressButton>
      </TableWrapper>
      <StatusBar>
        <p>bonjour</p>
      </StatusBar>
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
