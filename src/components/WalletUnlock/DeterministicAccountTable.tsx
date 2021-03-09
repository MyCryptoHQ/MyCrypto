import React from 'react';

import { Identicon } from '@mycrypto/ui';
import styled, { css } from 'styled-components';

import {
  Box,
  Button,
  Currency,
  EditableAccountLabel,
  EthAddress,
  Icon,
  LinkApp,
  Spinner,
  Tooltip,
  Typography
} from '@components';
import { DWAccountDisplay, ExtendedDPath, useContacts } from '@services';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import translate, { Trans } from '@translations';
import { DPath, ExtendedAsset, Network } from '@types';
import { bigify, buildAddressUrl, fromTokenBase, useScreenSize } from '@utils';

import { Downloader } from '../Downloader';

export interface TableAccountDisplay extends DWAccountDisplay {
  isSelected: boolean;
  isDefaultConfig: boolean;
}

export interface ITableAccounts {
  [key: string]: TableAccountDisplay;
}

export interface DeterministicTableProps {
  isComplete: boolean;
  accounts: ITableAccounts;
  network: Network;
  asset: ExtendedAsset;
  csv: string;
  selectedDPath: DPath;
  displayEmptyAddresses: boolean;
  handleScanMoreAddresses(dpath: ExtendedDPath): void;
  onSelect(account: DWAccountDisplay): void;
  handleUpdate(asset: ExtendedAsset): void;
}

const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  border-top: 1px solid ${COLORS.GREY_ATHENS};
  border-bottom: 1px solid ${COLORS.GREY_ATHENS};
  background: ${COLORS.BLUE_GREY_LIGHTEST};
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: none;
  }
`;

const Label = styled.div<{ width: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-transform: uppercase;
  font-weight: bold;
  color: ${COLORS.BLUE_DARK_SLATE};
  width: ${(p) => p.width};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    border-radius: 1.3px;
    & > *:first-child {
      border-top: 1px solid ${COLORS.GREY_ATHENS};
    }
  }
`;

const Row = styled.div<{ isSelected: boolean }>`
  ${(p) =>
    p.isSelected &&
    css`
      background: rgba(179, 221, 135, 0.1);
    `}
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  border-bottom: 1px solid ${COLORS.GREY_ATHENS};
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    align-items: flex-start;
    position: relative;
    padding: ${SPACING.SM} 0 ${SPACING.SM} 65px;
  }
`;

const SelectedContainer = styled.div<{ isSelected: boolean }>`
  visibility: ${(p) => (p.isSelected ? 'visible' : 'hidden')};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 25px;
  height: 60px;
  border-left: 6px solid ${COLORS.LIGHT_GREEN};
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 100%;
  }
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 225px;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
`;

const SIdenticon = styled(Identicon)`
  margin-right: ${SPACING.SM};
  & > img {
    width: 30px;
    height: 30px;
  }
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    position: absolute;
    top: 15px;
    left: 13px;
    margin-right: 0;
    & > img {
      width: 40px;
      height: 40px;
    }
  }
`;

const AddressContainer = styled.div`
  width: 135px;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
`;

const DPathContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 125px;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
`;

const DPathType = styled(Typography)`
  color: ${COLORS.BLUE_DARK};
  line-height: 18px;
`;

const DPathDisplay = styled(Typography)`
  color: ${COLORS.GREY_DARK};
  line-height: 18px;
`;

const ValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 135px;
`;

const LinkContainer = styled.div`
  width: 50px;
  padding: 0 15px;
`;

const MobileColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    min-height: 120px;
  }
`;

const BottomActionButton = styled.div<{ disabled: boolean }>`
  ${(p) =>
    p.disabled &&
    css`
      filter: grayscale(1);
    `}
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60px;
  padding-left: 45px;
  border-bottom: 1px solid ${COLORS.GREY_ATHENS};
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    justify-content: center;
    border-bottom: none;
    padding-top: 45px;
    padding-left: 0;
  }
`;

const STypography = styled(Typography)`
  margin: 0 ${SPACING.SM};
`;

const NoAccountContainer = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  padding: ${SPACING.XXL} ${SPACING.BASE};
  & > *:not(:last-child) {
    margin-bottom: ${SPACING.MD};
  }
`;

const NoAccountAction = styled.span`
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

const DeterministicTable = ({
  isComplete,
  accounts,
  network,
  asset,
  displayEmptyAddresses,
  selectedDPath,
  onSelect,
  handleScanMoreAddresses,
  handleUpdate,
  csv
}: DeterministicTableProps) => {
  const { getContactByAddressAndNetworkId } = useContacts();
  const { isMobile } = useScreenSize();
  const allAccounts = Object.values(accounts);
  const accountsToDisplay = allAccounts
    .filter(
      ({ balance, isSelected, pathItem: { baseDPath } }) =>
        (displayEmptyAddresses && baseDPath.value === selectedDPath.value) || !balance?.isZero() || isSelected
    )
    .sort((a, b) => (a.balance?.isGreaterThan(b.balance!) ? -1 : 1));
  const selectedDPathOffset =
    Math.max(
      ...allAccounts
        .filter((acc) => acc.pathItem.baseDPath.value === selectedDPath.value)
        .map(({ pathItem: { index } }) => index)
    ) + 1; // Start scanning from the next index
  return (
    <Table>
      <Heading>
        <Label width="25px" />
        <Label width="225px">
          <Trans id="DETERMINISTIC_ACCOUNT_LIST_LABEL" />
        </Label>
        <Label width="135px">
          <Trans id="DETERMINISTIC_ACCOUNT_LIST_ADDRESS" />
        </Label>
        <Label width="125px">
          <Trans id="DETERMINISTIC_ACCOUNT_LIST_DPATH" />
        </Label>
        <Label width="80px">
          <Trans id="DETERMINISTIC_ACCOUNT_LIST_VALUE" />
        </Label>
        <Label width="30px" />
        <Label width="50px" />
      </Heading>
      {!Object.values(accountsToDisplay).length ? (
        isComplete ? (
          <NoAccountContainer>
            <Icon type="info" />
            <Typography bold={true}>
              <Trans id="DETERMINISTIC_UNABLE_TO_FIND" variables={{ $asset: () => asset.ticker }} />
            </Typography>
            <Typography>
              <Trans id="DETERMINISTIC_ALTERNATIVES_1" />{' '}
              <NoAccountAction
                onClick={() => {
                  if (!isComplete) return;
                  handleScanMoreAddresses({
                    ...selectedDPath,
                    offset: selectedDPathOffset,
                    numOfAddresses: 10
                  });
                }}
              >
                <Trans id="DETERMINISTIC_ALTERNATIVES_2" />
              </NoAccountAction>
              {'.'}
              <br />
              <Trans id="DETERMINISTIC_ALTERNATIVES_4" />{' '}
              <SDownloader data={csv} fileName="accounts.csv" mime="text/csv">
                <Trans id="DETERMINISTIC_ALTERNATIVES_5" />
              </SDownloader>
              .
            </Typography>
            <Button onClick={() => handleUpdate(asset)} fullwidth={isMobile}>
              <Trans id="DETERMINISTIC_SCAN_AGAIN" />
            </Button>
            <Typography>{translate('DETERMINISTIC_CONTACT_US')}</Typography>
          </NoAccountContainer>
        ) : (
          <NoAccountContainer>
            <Box mb={SPACING.BASE} mt={'calc(-6rem + 100px)'}>
              <Spinner color="brand" size={5} />
            </Box>
            <Trans id="DETERMINISTIC_SCANNING" variables={{ $asset: () => asset.ticker }} />
          </NoAccountContainer>
        )
      ) : (
        <Body>
          {accountsToDisplay.map((account: TableAccountDisplay, index) => (
            <Row key={index} onClick={() => onSelect(account)} isSelected={account.isSelected}>
              <SelectedContainer isSelected={account.isSelected}>
                <Icon type="check" />
              </SelectedContainer>
              <MobileColumn>
                <LabelContainer>
                  <SIdenticon address={account.address} />
                  <EditableAccountLabel
                    addressBookEntry={getContactByAddressAndNetworkId(account.address, network.id)}
                    address={account.address}
                    networkId={network.id}
                  />
                </LabelContainer>
                <AddressContainer>
                  <EthAddress address={account.address} truncate={true} />
                </AddressContainer>
                <DPathContainer>
                  <DPathType>{account.pathItem.baseDPath.label.replace(/\(.*?\)/, '')}</DPathType>
                  <DPathDisplay>({account.pathItem.path})</DPathDisplay>
                </DPathContainer>
                <ValueContainer>
                  <Typography>
                    <Currency
                      amount={
                        account.balance
                          ? bigify(fromTokenBase(account.balance, asset.decimal)).toFixed(4)
                          : '0.0000'
                      }
                    />
                  </Typography>
                  <Typography>{asset.ticker}</Typography>
                </ValueContainer>
              </MobileColumn>
              <LinkContainer>
                <Tooltip tooltip={'View on Etherscan'}>
                  <LinkApp
                    href={buildAddressUrl(network.blockExplorer, account.address)}
                    isExternal={true}
                  >
                    <Icon type="link-out" />
                  </LinkApp>
                </Tooltip>
              </LinkContainer>
            </Row>
          ))}
          <BottomActionButton
            onClick={() => {
              if (!isComplete) return;
              handleScanMoreAddresses({
                ...selectedDPath,
                offset: selectedDPathOffset,
                numOfAddresses: 10
              });
            }}
            disabled={!isComplete}
          >
            <Icon type="add" color="none" width="32px" />
            <STypography>
              <Trans id="DETERMINISTIC_SCAN_MORE_ADDRESSES" />
              {!isComplete && <Spinner color="default" size={1} />}
            </STypography>
          </BottomActionButton>
        </Body>
      )}
    </Table>
  );
};

export default DeterministicTable;
