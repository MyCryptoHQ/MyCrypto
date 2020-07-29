import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import uniqBy from 'ramda/src/uniqBy';
import prop from 'ramda/src/prop';

import { Trans } from '@translations';
import { ExtendedAsset, TAddress, Network } from '@types';
import { Button, Typography } from '@components';
import Icon from '@components/Icon';
import { BREAK_POINTS, COLORS } from '@theme';
import { DWAccountDisplay } from '@services';

import DeterministicTable from './DeterministicAccountTable';
import { isSameAddress } from '@utils';

const DeterministicAccountListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
  min-height: 640px;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: calc(100vw - 30px);
  }
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding-top: 42px;
  border-top: 1px solid ${COLORS.GREY_ATHENS};
`;

const StatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 65%;
`;

const Loader = styled.div`
  padding-right: 20px;
  margin-right: 20px;
`;

const IconWrapper = styled.div`
  margin-right: 20px;
  display: flex;
  align-items: center;
`;

const ScanAgain = styled.span`
  color: ${COLORS.BLUE_MYC};
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: ${COLORS.BLUE_LIGHT_DARKISH};
  }
`;

interface DeterministicAccountListProps {
  finishedAccounts: DWAccountDisplay[];
  asset: ExtendedAsset;
  isComplete: boolean;
  className?: string;
  currentsOnly?: boolean;
  dashboard?: boolean;
  network: Network;
  generateFreshAddress?(): void;
  onUnlock(param: any): void;
  handleUpdate(asset: ExtendedAsset): void;
}

interface ISelectedAccount {
  address: TAddress;
  derivationPath: string;
}

export default function DeterministicAccountList(props: DeterministicAccountListProps) {
  const {
    finishedAccounts,
    asset,
    isComplete,
    onUnlock,
    network,
    generateFreshAddress,
    handleUpdate
  } = props;

  const [selectedAccounts, setSelectedAccounts] = useState([] as ISelectedAccount[]);

  const accountsToUse = uniqBy(prop('address'), finishedAccounts).filter(
    ({ isFreshAddress, balance }) => (balance && !balance.isZero()) || isFreshAddress
  );

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

  const handleSubmit = () => {
    onUnlock(selectedAccounts);
  };

  const handleSelection = (account: DWAccountDisplay) => {
    const newSelectedAccount: ISelectedAccount = {
      address: account.address,
      derivationPath: account.pathItem.path
    };
    const isPresent = selectedAccounts.find(({ address }) =>
      isSameAddress(newSelectedAccount.address, address)
    );
    setSelectedAccounts(
      isPresent
        ? selectedAccounts.filter(
            ({ address }) => !isSameAddress(newSelectedAccount.address, address)
          )
        : [...selectedAccounts, newSelectedAccount]
    );
  };

  return (
    <DeterministicAccountListWrapper>
      <TableWrapper>
        <DeterministicTable
          isComplete={isComplete}
          accounts={accountsToUse}
          selectedAccounts={selectedAccounts}
          generateFreshAddress={generateFreshAddress}
          network={network}
          asset={asset}
          onSelect={handleSelection}
          handleUpdate={handleUpdate}
        />
      </TableWrapper>
      <StatusBar>
        {isComplete ? (
          accountsToUse.length ? (
            <StatusWrapper>
              <IconWrapper>
                <Icon type="confirm" />
              </IconWrapper>
              <Typography>
                <Trans
                  id="DETERMINISTIC_SCANNING_STATUS_DONE"
                  variables={{ $asset: () => asset.ticker }}
                />{' '}
                <ScanAgain onClick={() => handleUpdate(asset)}>
                  <Trans id="DETERMINISTIC_SCAN_AGAIN" />
                </ScanAgain>
                .
              </Typography>
            </StatusWrapper>
          ) : (
            <StatusWrapper>
              <IconWrapper>
                <Icon type="info-small" />
              </IconWrapper>
              <Trans
                id="DETERMINISTIC_SCANNING_STATUS_EMPTY"
                variables={{ $asset: () => asset.ticker }}
              />
            </StatusWrapper>
          )
        ) : (
          <StatusWrapper>
            <Loader className="loading" />
            <Trans
              id="DETERMINISTIC_SCANNING_STATUS_RUNNING"
              variables={{ $total: () => finishedAccounts.length, $network: () => network.name }}
            />{' '}
          </StatusWrapper>
        )}
        <Button onClick={handleSubmit} disabled={!selectedAccounts.length}>
          <Trans
            id="DETERMINISTIC_ACCOUNT_LIST_ADD"
            variables={{
              $total: () => (selectedAccounts.length ? selectedAccounts.length : ''),
              $plural: () => (selectedAccounts.length > 1 ? 's' : '')
            }}
          />
        </Button>
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
