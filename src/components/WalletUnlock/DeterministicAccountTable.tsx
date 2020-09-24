import React from 'react';

import { Identicon } from '@mycrypto/ui';
import BN from 'bn.js';
import styled, { css } from 'styled-components';

import {
  Amount,
  Button,
  EditableAccountLabel,
  EthAddress,
  Icon,
  LinkOut,
  Tooltip,
  Typography
} from '@components';
import { DEFAULT_GAP_TO_SCAN_FOR } from '@config';
import { DWAccountDisplay, useContacts } from '@services';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import translate, { Trans } from '@translations';
import { ExtendedAsset, Network, TAddress } from '@types';
import { fromTokenBase, isSameAddress, useScreenSize } from '@utils';



interface DeterministicTableProps {
  isComplete: boolean;
  accounts: DWAccountDisplay[];
  network: Network;
  asset: ExtendedAsset;
  selectedAccounts: {
    address: TAddress;
    derivationPath: string;
  }[];
  freshAddressIndex: number;
  generateFreshAddress(): void;
  onSelect(account: DWAccountDisplay): void;
  handleUpdate(asset: ExtendedAsset): void;
  downloadCSV(): void;
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

const DPath = styled(Typography)`
  color: ${COLORS.GREY_ATHENS};
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

const GenerateAddressButton = styled.div<{ disabled: boolean }>`
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

const Loader = styled.div`
  margin-top: calc(-6rem + 100px);
  padding-bottom: 6rem;
  margin-bottom: ${SPACING.BASE};
  transform: scale(4.75);

  &&::before {
    border-width: 0.75px;
  }

  &&::after {
    border-width: 0.75px;
  }
`;

const DeterministicTable = ({
  isComplete,
  accounts,
  selectedAccounts,
  network,
  asset,
  freshAddressIndex,
  onSelect,
  generateFreshAddress,
  handleUpdate,
  downloadCSV
}: DeterministicTableProps) => {
  const { getContactByAddressAndNetworkId, updateContact, createContact } = useContacts();
  const { isMobile } = useScreenSize();

  const isSelected = (account: DWAccountDisplay) =>
    selectedAccounts.find(({ address }) => isSameAddress(account.address, address)) ? true : false;

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
      {!accounts.length ? (
        isComplete ? (
          <NoAccountContainer>
            <Icon type="info" />
            <Typography bold={true}>
              <Trans id="DETERMINISTIC_UNABLE_TO_FIND" variables={{ $asset: () => asset.ticker }} />
            </Typography>
            <Typography>
              <Trans id="DETERMINISTIC_ALTERNATIVES_1" />{' '}
              <NoAccountAction onClick={generateFreshAddress}>
                <Trans id="DETERMINISTIC_ALTERNATIVES_2" />
              </NoAccountAction>{' '}
              <Trans id="DETERMINISTIC_ALTERNATIVES_3" />
              <br />
              <Trans id="DETERMINISTIC_ALTERNATIVES_4" />{' '}
              <NoAccountAction onClick={downloadCSV}>
                <Trans id="DETERMINISTIC_ALTERNATIVES_5" />
              </NoAccountAction>
              .
            </Typography>
            <Button onClick={() => handleUpdate(asset)} fullwidth={isMobile}>
              <Trans id="DETERMINISTIC_SCAN_AGAIN" />
            </Button>
            <Typography>{translate('DETERMINISTIC_CONTACT_US')}</Typography>
          </NoAccountContainer>
        ) : (
            <NoAccountContainer>
              <Loader className="loading" />
              <Trans id="DETERMINISTIC_SCANNING" variables={{ $asset: () => asset.ticker }} />
            </NoAccountContainer>
          )
      ) : (
          <Body>
            {accounts.map((account: DWAccountDisplay, index) => (
              <Row key={index} onClick={() => onSelect(account)} isSelected={isSelected(account)}>
                <SelectedContainer isSelected={isSelected(account)}>
                  <Icon type="check" />
                </SelectedContainer>
                <MobileColumn>
                  <LabelContainer>
                    <SIdenticon address={account.address} />
                    <EditableAccountLabel
                      addressBookEntry={getContactByAddressAndNetworkId(account.address, network.id)}
                      address={account.address}
                      networkId={network.id}
                      createContact={createContact}
                      updateContact={updateContact}
                    />
                  </LabelContainer>
                  <AddressContainer>
                    <EthAddress address={account.address} truncate={true} />
                  </AddressContainer>
                  <DPathContainer>
                    <DPathType>{account.pathItem.baseDPath.label.replace(/\(.*?\)/, '')}</DPathType>
                    <DPath>({account.pathItem.path})</DPath>
                  </DPathContainer>
                  <ValueContainer>
                    <Typography>
                      <Amount
                        assetValue={
                          account.balance
                            ? parseFloat(
                              fromTokenBase(
                                new BN(account.balance.toString()),
                                asset.decimal
                              ).toString()
                            ).toFixed(4)
                            : '0.0000'
                        }
                      />
                    </Typography>
                    <Typography>{asset.ticker}</Typography>
                  </ValueContainer>
                </MobileColumn>
                <LinkContainer>
                  <Tooltip tooltip={'View on Etherscan'}>
                    <LinkOut
                      link={
                        network.blockExplorer
                          ? network.blockExplorer.addressUrl(account.address)
                          : `https://ethplorer.io/address/${account.address}`
                      }
                    />
                  </Tooltip>
                </LinkContainer>
              </Row>
            ))}
            <GenerateAddressButton
              onClick={generateFreshAddress}
              disabled={!isComplete || freshAddressIndex >= DEFAULT_GAP_TO_SCAN_FOR}
            >
              <Icon type="add" />

              {!isComplete ? (
                <Tooltip tooltip={<Trans id="DETERMINISTIC_WAIT_FOR_SCAN" />}>
                  <STypography>
                    <Trans id="DETERMINISTIC_GENERATE_FRESH_ADDRESS" />
                  </STypography>
                </Tooltip>
              ) : freshAddressIndex >= DEFAULT_GAP_TO_SCAN_FOR ? (
                <Tooltip
                  tooltip={
                    <Trans
                      id="DETERMINISTIC_CANT_GENERATE_MORE"
                      variables={{ $number: () => DEFAULT_GAP_TO_SCAN_FOR }}
                    />
                  }
                >
                  <STypography>
                    <Trans id="DETERMINISTIC_GENERATE_FRESH_ADDRESS" />
                  </STypography>
                </Tooltip>
              ) : (
                    <STypography>
                      <Trans id="DETERMINISTIC_GENERATE_FRESH_ADDRESS" />
                    </STypography>
                  )}
            </GenerateAddressButton>
          </Body>
        )}
    </Table>
  );
};

export default DeterministicTable;
