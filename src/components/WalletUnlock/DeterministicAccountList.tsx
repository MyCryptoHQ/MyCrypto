import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, Icon, PoweredByText, Spinner, Tooltip, Typography } from '@components';
import { DWAccountDisplay } from '@services';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import { Trans } from '@translations';
import { ExtendedAsset, Network, TAddress } from '@types';
import { accountsToCSV, isSameAddress, makeBlob, useScreenSize } from '@utils';
import { prop, uniqBy } from '@vendor';

import DeterministicTable from './DeterministicAccountTable';

const DeterministicAccountListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
  min-height: 640px;
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
  margin-right: ${SPACING.BASE};
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

interface DeterministicAccountListProps {
  finishedAccounts: DWAccountDisplay[];
  asset: ExtendedAsset;
  isComplete: boolean;
  network: Network;
  freshAddressIndex: number;
  generateFreshAddress(): void;
  onUnlock(param: any): void;
  handleUpdate(asset: ExtendedAsset): void;
}

interface ISelectedAccount {
  address: TAddress;
  derivationPath: string;
}

export default function DeterministicAccountList({
  finishedAccounts,
  asset,
  isComplete,
  onUnlock,
  network,
  freshAddressIndex,
  generateFreshAddress,
  handleUpdate
}: DeterministicAccountListProps) {
  const { isMobile } = useScreenSize();

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

  const handleDownload = () =>
    window.open(makeBlob('text/csv', accountsToCSV(finishedAccounts, asset)));
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
          downloadCSV={handleDownload}
          freshAddressIndex={freshAddressIndex}
        />
      </TableWrapper>
      <StatusBar>
        {isComplete && !!accountsToUse.length && (
          <StatusWrapper>
            <IconWrapper>
              <Icon type="confirm" />
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
                    <SButton onClick={handleDownload}>here</SButton>.
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
