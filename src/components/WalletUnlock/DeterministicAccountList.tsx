import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, Icon, PoweredByText, Spinner, Tooltip, Typography } from '@components';
import { DWAccountDisplay, ExtendedDPath } from '@services';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { Trans } from '@translations';
import { DPath, ExtendedAsset, Network } from '@types';
import { accountsToCSV, useScreenSize } from '@utils';
import { prop, uniqBy } from '@vendor';

import { Downloader } from '../Downloader';
import DeterministicTable, {
  ITableAccounts,
  TableAccountDisplay
} from './DeterministicAccountTable';

const DeterministicAccountListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: calc(100vw - 30px);
    min-height: auto;
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

const SButton = styled.span`
  color: ${COLORS.BLUE_MYC};
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: ${COLORS.BLUE_LIGHT_DARKISH};
  }
`;

const SDownloader = styled(Downloader)`
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
  network: Network;
  freshAddressIndex: number;
  displayEmptyAddresses: boolean;
  selectedDPath: DPath;
  handleScanMoreAddresses(dpath: ExtendedDPath): void;
  generateFreshAddress(): void;
  onUnlock(param: any): void;
  handleUpdate(asset: ExtendedAsset): void;
}

export default function DeterministicAccountList({
  finishedAccounts,
  asset,
  isComplete,
  network,
  freshAddressIndex,
  displayEmptyAddresses,
  selectedDPath,
  generateFreshAddress,
  handleScanMoreAddresses,
  onUnlock,
  handleUpdate
}: DeterministicAccountListProps) {
  const MAX_EMPTY_ADDRESSES = 5;
  const { isMobile } = useScreenSize();
  const accountsToUse = uniqBy(prop('address'), finishedAccounts);

  const [tableAccounts, setTableAccounts] = useState({} as ITableAccounts);

  // setTableAccounts to be accountsToUse on update with isDefault set if it isn't already set and
  useEffect(() => {
    const tableAccs = accountsToUse.reduce((acc, idx) => {
      if (!tableAccounts[idx.address]) {
        acc[idx.address] = {
          ...idx,
          isDefaultConfig: true,
          isSelected: (idx.balance && !idx.balance.isZero()) || false
        };
        return acc;
      } else return acc;
    }, tableAccounts);
    setTableAccounts(tableAccs);
  }, [accountsToUse.length]);

  const freshAddresses = uniqBy(prop('address'), finishedAccounts).filter(
    ({ isFreshAddress }) => isFreshAddress
  );
  const selectedAccounts = Object.values(tableAccounts).filter(({ isSelected }) => isSelected);
  const handleSubmit = () => {
    onUnlock(selectedAccounts);
  };

  const handleSelection = (account: TableAccountDisplay) => {
    if (freshAddresses.length > MAX_EMPTY_ADDRESSES) return;
    const newSelectedAccount: TableAccountDisplay = {
      ...account,
      isDefaultConfig: false,
      isSelected: !account.isSelected
    };
    setTableAccounts({
      ...tableAccounts,
      [account.address]: newSelectedAccount
    });
  };
  const csv = accountsToCSV(finishedAccounts, asset);
  return (
    <DeterministicAccountListWrapper>
      <TableWrapper>
        <DeterministicTable
          isComplete={isComplete}
          accounts={tableAccounts}
          displayEmptyAddresses={displayEmptyAddresses}
          selectedDPath={selectedDPath}
          generateFreshAddress={generateFreshAddress}
          network={network}
          asset={asset}
          onSelect={handleSelection}
          handleUpdate={handleUpdate}
          handleScanMoreAddresses={handleScanMoreAddresses}
          csv={csv}
          freshAddressIndex={freshAddressIndex}
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
                variables={{ $asset: () => asset.ticker }}
              />{' '}
              <SButton onClick={() => handleUpdate(asset)}>
                <Trans id="DETERMINISTIC_SCAN_AGAIN" />
              </SButton>
              .
              <PoweredByText provider="FINDETH" />
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
              <PoweredByText provider="FINDETH" />
            </Typography>
          </StatusWrapper>
        )}
        {!isComplete && (
          <StatusWrapper>
            <Spinner color="brand" mr={SPACING.BASE} pr={SPACING.BASE} />
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
              <PoweredByText provider="FINDETH" />
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
