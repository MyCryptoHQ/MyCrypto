import { useEffect, useState } from 'react';

import { DerivationPath as DPath } from '@mycrypto/wallets';
import styled from 'styled-components';

import { Banner, Box, Button, Icon, Spinner, Tooltip, Typography } from '@components';
import { Downloader } from '@components/Downloader';
import { DWAccountDisplay, ExtendedDPath } from '@services';
import { useSelector } from '@store';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { Trans } from '@translations';
import { BannerType, ExtendedAsset, IAccountAdditionData, Network } from '@types';
import { hasBalance, useScreenSize } from '@utils';

import { selectHDWalletScannedAccountsCSV } from './hdWallet.slice';
import HDTable, { ITableAccounts, TableAccountDisplay } from './HDWTable';

const MAX_EMPTY_ADDRESSES = 5;

const ListContainer = styled(Box)`
  width: 800px;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
`;

const TableWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const StatusBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 42px;
  padding-left: 45px;
  padding-right: 45px;
  border-top: 1px solid ${COLORS.GREY_ATHENS};
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    background: white;
    border-radius: 1.32522px;
    padding: ${SPACING.SM};
    justify-content: space-between;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    text-align: center;
    margin-bottom: ${SPACING.BASE};
  }
`;

const IconWrapper = styled.div`
  margin-right: 17px;
  display: flex;
  align-items: center;
`;

const SDownloader = styled(Downloader)`
  color: ${COLORS.BLUE_MYC};
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: ${COLORS.BLUE_LIGHT_DARKISH};
  }
`;

const ExportBtnWrapper = styled.div`
  flex: 1;
  display: flex;
  min-width: 185px;
  justify-content: flex-end;
`;

export const filterZeroBalanceAccounts = (accounts: DWAccountDisplay[]) =>
  accounts.filter((acc) => !hasBalance(acc.balance));

interface HDWListProps {
  scannedAccounts: DWAccountDisplay[];
  asset: ExtendedAsset;
  isCompleted: boolean;
  network: Network;
  displayEmptyAddresses: boolean;
  selectedDPath: DPath;
  onScanMoreAddresses(dpath: ExtendedDPath): void;
  onUnlock(param: IAccountAdditionData[]): void;
  handleUpdate(asset: ExtendedAsset): void;
}

export default function HDWList({
  scannedAccounts,
  asset,
  isCompleted,
  network,
  displayEmptyAddresses,
  selectedDPath,
  onScanMoreAddresses,
  onUnlock,
  handleUpdate
}: HDWListProps) {
  const { isMobile } = useScreenSize();
  const csv = useSelector(selectHDWalletScannedAccountsCSV) || '';
  const [tableAccounts, setTableAccounts] = useState<ITableAccounts>([]);

  // setTableAccounts to be accountsToUse on update with isDefault set if it isn't already set
  // and if accountsToUse is cleared (occurs when re-scanning all accounts or when changing asset), refresh tableAccounts
  useEffect(() => {
    if (scannedAccounts.length === 0 && Object.keys(tableAccounts).length !== 0) {
      setTableAccounts([]);
    } else {
      const tableAccs = scannedAccounts.reduce((acc, cur) => {
        const existingEntry = tableAccounts.find(
          (a) =>
            a.pathItem.index === cur.pathItem.index &&
            a.pathItem.baseDPath.path === cur.pathItem.baseDPath.path
        );
        if (existingEntry) {
          return acc;
        }
        return [
          ...acc,
          {
            ...cur,
            isSelected: hasBalance(cur.balance) || false
          }
        ];
      }, tableAccounts);
      setTableAccounts(tableAccs);
    }
  }, [scannedAccounts]);

  const selectedAccounts = Object.values(tableAccounts).filter(({ isSelected }) => isSelected);
  const emptySelectedAccounts = filterZeroBalanceAccounts(selectedAccounts);
  const handleSubmit = () => {
    onUnlock(
      selectedAccounts.map(({ pathItem, address }) => ({
        address,
        path: pathItem.baseDPath,
        index: pathItem.index
      }))
    );
  };

  const handleSelection = (account: TableAccountDisplay) => {
    if (account.isSelected) {
      setTableAccounts({
        ...tableAccounts,
        [account.address]: {
          ...account,
          isSelected: !account.isSelected
        }
      });
      return;
    }
    // disallows selecting an account that is empty if MAX_EMPTY_ADDRESSES is already met
    if (emptySelectedAccounts.length >= MAX_EMPTY_ADDRESSES && !hasBalance(account.balance)) return;
    setTableAccounts({
      ...tableAccounts,
      [account.address]: {
        ...account,
        isSelected: !account.isSelected
      }
    });
  };
  return (
    <ListContainer variant="columnAlign" justifyContent="center">
      <Box width="100%" style={{ visibility: !displayEmptyAddresses ? 'hidden' : 'visible' }}>
        <Banner
          type={BannerType.ANNOUNCEMENT}
          displayIcon={false}
          value={
            <Trans
              id="DETERMINISTIC_SCANNING_EMPTY_ADDR"
              variables={{
                $count: () => emptySelectedAccounts.length,
                $total: () => MAX_EMPTY_ADDRESSES
              }}
            />
          }
        />
      </Box>
      <TableWrapper>
        <HDTable
          isCompleted={isCompleted}
          accounts={tableAccounts}
          displayEmptyAddresses={displayEmptyAddresses}
          selectedDPath={selectedDPath}
          network={network}
          asset={asset}
          onSelect={handleSelection}
          handleUpdate={handleUpdate}
          onScanMoreAddresses={onScanMoreAddresses}
          csv={csv}
        />
      </TableWrapper>
      <StatusBar>
        {isCompleted && !!scannedAccounts.length && (
          <StatusWrapper>
            <IconWrapper>
              <Icon type="confirm" width="32px" />
            </IconWrapper>
            <Typography>
              <Trans
                id="DETERMINISTIC_SCANNING_STATUS_DONE"
                variables={{
                  $asset: () => asset.ticker,
                  $total: () => scannedAccounts.length,
                  $network: () => network.name
                }}
              />{' '}
              <Trans id="DETERMINISTIC_SEE_SUMMARY" />{' '}
              <SDownloader data={csv} fileName="accounts.csv" mime="text/csv">
                <Trans id="HERE" />
              </SDownloader>
              .
            </Typography>
          </StatusWrapper>
        )}
        {isCompleted && !scannedAccounts.length && (
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
        {!isCompleted && (
          <StatusWrapper>
            <IconWrapper>
              <Spinner color="brand" size={1} />
            </IconWrapper>
            <div>
              <Trans
                id="DETERMINISTIC_SCANNING_STATUS_RUNNING"
                variables={{
                  $total: () => scannedAccounts.length,
                  $network: () => network.name
                }}
              />{' '}
              <Tooltip
                tooltip={
                  <>
                    <Trans
                      id="DETERMINISTIC_CSV"
                      variables={{ $total: () => scannedAccounts.length }}
                    />{' '}
                    <SDownloader data={csv} fileName="accounts.csv" mime="text/csv">
                      <Trans id="HERE" />
                    </SDownloader>
                    .
                  </>
                }
              />
            </div>
          </StatusWrapper>
        )}
        <ExportBtnWrapper>
          <Button onClick={handleSubmit} disabled={!selectedAccounts.length} fullwidth={isMobile}>
            <Trans
              id="DETERMINISTIC_ACCOUNT_LIST_ADD"
              variables={{
                $total: () => (selectedAccounts.length ? selectedAccounts.length : ''),
                $plural: () => (selectedAccounts.length > 1 ? 's' : '')
              }}
            />
          </Button>
        </ExportBtnWrapper>
      </StatusBar>
    </ListContainer>
  );
}

// @todo - sorting
// interface ITableFullHDWType {
//   account: DWAccountDisplay;
//   index: number;
//   label: string;
//   total: number;
//   addressCard: ExtendedAddressBook;
// }

// type TSortFunction = (a: ITableFullHDWType, b: ITableFullHDWType) => number;
// const getSortingFunction = (sortKey: ISortTypes): TSortFunction => {
//   switch (sortKey) {
// 		default:
//     case 'value':
//       return (a: ITableFullHDWType, b: ITableFullHDWType) => b.total - a.total;
//     case 'value-reverse':
//       return (a: ITableFullHDWType, b: ITableFullHDWType) => a.total - b.total;
//     case 'dpath':
//       return (a: ITableFullHDWType, b: ITableFullHDWType) => a.label.localeCompare(b.label);
//     case 'dpath-reverse':
//       return (a: ITableFullHDWType, b: ITableFullHDWType) => b.label.localeCompare(a.label);
//     case 'address':
//       return (a: ITableFullHDWType, b: ITableFullHDWType) =>
//         a.account.address.localeCompare(b.account.address);
//     case 'address-reverse':
//       return (a: ITableFullHDWType, b: ITableFullHDWType) =>
//         b.account.address.localeCompare(a.account.address);
//   }
// };
