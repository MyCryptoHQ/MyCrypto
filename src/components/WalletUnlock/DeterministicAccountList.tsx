import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Banner, Box, Button, Icon, Spinner, Tooltip, Typography } from '@components';
import { DWAccountDisplay, ExtendedDPath } from '@services';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { Trans } from '@translations';
import { BannerType, DPath, ExtendedAsset, Network } from '@types';
import { accountsToCSV, useScreenSize } from '@utils';
import { prop, uniqBy } from '@vendor';

import { Downloader } from '../Downloader';
import DeterministicTable, {
  ITableAccounts,
  TableAccountDisplay
} from './DeterministicAccountTable';

const TableWrapper = styled.div`
  display: flex;
  width: 100%;
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
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    flex-direction: column;
    background: white;
    box-shadow: 0px -1px 4px rgba(186, 186, 186, 0.25);
    border-radius: 1.32522px;
    padding: ${SPACING.SM};
    justify-content: space-between;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 65%;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
    text-align: center;
    margin-bottom: ${SPACING.BASE};
  }
`;

const IconWrapper = styled.div`
  margin-right: 17px;
  display: flex;
  align-items: center;
`;

// const SButton = styled.span`
//   color: ${COLORS.BLUE_MYC};
//   cursor: pointer;
//   font-weight: bold;
//   &:hover {
//     color: ${COLORS.BLUE_LIGHT_DARKISH};
//   }
// `;

const SDownloader = styled(Downloader)`
  color: ${COLORS.BLUE_MYC};
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: ${COLORS.BLUE_LIGHT_DARKISH};
  }
`;

export const filterZeroBalanceAccounts = (accounts: DWAccountDisplay[]) =>
  accounts.filter(({ balance }) => balance?.isZero());

interface DeterministicAccountListProps {
  finishedAccounts: DWAccountDisplay[];
  asset: ExtendedAsset;
  isComplete: boolean;
  network: Network;
  displayEmptyAddresses: boolean;
  selectedDPath: DPath;
  handleScanMoreAddresses(dpath: ExtendedDPath): void;
  onUnlock(param: any): void;
  handleUpdate(asset: ExtendedAsset): void;
}

const tableBannerText = (emptySelectedAccountsLength: number, maxEmptyAddresses: number) => (
  <Trans
    id="DETERMINISTIC_SCANNING_EMPTY_ADDR"
    variables={{
      $count: () => emptySelectedAccountsLength,
      $total: () => maxEmptyAddresses
    }}
  />
);

export default function DeterministicAccountList({
  finishedAccounts,
  asset,
  isComplete,
  network,
  displayEmptyAddresses,
  selectedDPath,
  handleScanMoreAddresses,
  onUnlock,
  handleUpdate
}: DeterministicAccountListProps) {
  const MAX_EMPTY_ADDRESSES = 5;
  const { isMobile } = useScreenSize();

  const [tableAccounts, setTableAccounts] = useState({} as ITableAccounts);

  const accountsToUse = uniqBy(prop('address'), finishedAccounts);
  // setTableAccounts to be accountsToUse on update with isDefault set if it isn't already set and
  useEffect(() => {
    if (accountsToUse.length === 0 && Object.keys(tableAccounts).length !== 0) {
      setTableAccounts({} as ITableAccounts);
    } else {
      const tableAccs = accountsToUse.reduce((acc, idx) => {
        acc[idx.address] = tableAccounts[idx.address] || {
          ...idx,
          isDefaultConfig: true,
          isSelected: (idx.balance && !idx.balance.isZero()) || false
        };
        return acc;
      }, tableAccounts);
      setTableAccounts(tableAccs);
    }
  }, [accountsToUse]);

  const selectedAccounts = Object.values(tableAccounts).filter(({ isSelected }) => isSelected);
  const emptySelectedAccounts = filterZeroBalanceAccounts(selectedAccounts);
  const handleSubmit = () => {
    onUnlock(selectedAccounts);
  };

  const handleSelection = (account: TableAccountDisplay) => {
    if (account.isSelected) {
      setTableAccounts({
        ...tableAccounts,
        [account.address]: {
          ...account,
          isDefaultConfig: false,
          isSelected: !account.isSelected
        }
      });
      return;
    }
    if (emptySelectedAccounts.length >= MAX_EMPTY_ADDRESSES) return;
    setTableAccounts({
      ...tableAccounts,
      [account.address]: {
        ...account,
        isDefaultConfig: false,
        isSelected: !account.isSelected
      }
    });
  };
  const csv = accountsToCSV(finishedAccounts, asset);
  return (
    <Box variant="columnAlign" width="800px" justifyContent="center">
      <Box maxHeight="32px" height="32px" width="100%">
        <Banner
          type={BannerType.ANNOUNCEMENT}
          displayIcon={false}
          value={tableBannerText(emptySelectedAccounts.length, MAX_EMPTY_ADDRESSES)}
        />
      </Box>
      <TableWrapper>
        <DeterministicTable
          isComplete={isComplete}
          accounts={tableAccounts}
          displayEmptyAddresses={displayEmptyAddresses}
          selectedDPath={selectedDPath}
          network={network}
          asset={asset}
          onSelect={handleSelection}
          handleUpdate={handleUpdate}
          handleScanMoreAddresses={handleScanMoreAddresses}
          csv={csv}
        />
      </TableWrapper>
      <StatusBar>
        {isComplete && !!accountsToUse.length && (
          <StatusWrapper>
            <IconWrapper>
              <Icon type="confirm" width="20px" />
            </IconWrapper>
            <Typography>
              <Trans
                id="DETERMINISTIC_SCANNING_STATUS_DONE"
                variables={{
                  $asset: () => asset.ticker,
                  $total: () => finishedAccounts.length,
                  $network: () => network.name
                }}
              />{' '}
              <Trans id="DETERMINISTIC_SEE_SUMMARY" />{' '}
              <SDownloader data={csv} fileName="accounts.csv" mime="text/csv">
                <Trans id="DETERMINISTIC_ALTERNATIVES_5" />
              </SDownloader>
              .
            </Typography>
          </StatusWrapper>
        )}
        {isComplete && !accountsToUse.length && (
          <StatusWrapper>
            <IconWrapper>
              <Icon type="info-small" />
            </IconWrapper>
            <Typography>
              <Trans
                id="DETERMINISTIC_SCANNING_STATUS_EMPTY"
                variables={{ $asset: () => asset.ticker }}
              />
            </Typography>
          </StatusWrapper>
        )}
        {!isComplete && (
          <StatusWrapper>
            <IconWrapper>
              <Spinner color="brand" size={1} />
            </IconWrapper>
            <div>
              <Trans
                id="DETERMINISTIC_SCANNING_STATUS_RUNNING"
                variables={{
                  $total: () => finishedAccounts.length,
                  $network: () => network.name
                }}
              />{' '}
              <Tooltip
                tooltip={
                  <>
                    <Trans
                      id="DETERMINISTIC_CSV"
                      variables={{ $total: () => finishedAccounts.length }}
                    />{' '}
                    <SDownloader data={csv} fileName="accounts.csv" mime="text/csv">
                      <Trans id="DETERMINISTIC_ALTERNATIVES_5" />
                    </SDownloader>
                    .
                  </>
                }
              />
            </div>
          </StatusWrapper>
        )}
        <div>
          <Button onClick={handleSubmit} disabled={!selectedAccounts.length} fullwidth={isMobile}>
            <Trans
              id="DETERMINISTIC_ACCOUNT_LIST_ADD"
              variables={{
                $total: () => (selectedAccounts.length ? selectedAccounts.length : ''),
                $plural: () => (selectedAccounts.length > 1 ? 's' : '')
              }}
            />
          </Button>
        </div>
      </StatusBar>
    </Box>
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
