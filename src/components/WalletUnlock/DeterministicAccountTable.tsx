import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { DWAccountDisplay, AddressBookContext, fromTokenBase } from '@services';
import { COLORS, SPACING } from '@theme';
import translate, { Trans } from '@translations';
import { Identicon } from '@mycrypto/ui';
import { EditableAccountLabel, EthAddress, Typography, LinkOut, Button } from '@components';
import { Network, ExtendedAsset, TAddress } from '@types';
import { isSameAddress } from '@utils';
import BN from 'bn.js';
import Icon from '@components/Icon';

interface DeterministicTableProps {
  isComplete: boolean;
  accounts: DWAccountDisplay[];
  network: Network;
  asset: ExtendedAsset;
  selectedAccounts: {
    address: TAddress;
    derivationPath: string;
  }[];
  generateFreshAddress?(): void;
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
`;

const SelectedContainer = styled.div<{ isSelected: boolean }>`
  visibility: ${(p) => (p.isSelected ? 'visible' : 'hidden')};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 25px;
  height: 60px;
  border-left: 6px solid ${COLORS.LIGHT_GREEN};
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

const AddressContainer = styled.div`
  width: 135px;
`;

const DPathContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 125px;
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
  width: 80px;
`;

const TickerContainer = styled.div`
  width: 30px;
`;

const LinkContainer = styled.div`
  width: 50px;
  padding: 0 15px;
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
`;

const STypography = styled(Typography)`
  margin-left: ${SPACING.SM};
`;

const NoAccountContainer = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  padding: 100px 0;
  & > *:not(:last-child) {
    margin-bottom: 30px;
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

const DeterministicTable = ({
  isComplete,
  accounts,
  selectedAccounts,
  network,
  asset,
  onSelect,
  generateFreshAddress,
  handleUpdate
}: DeterministicTableProps) => {
  const { getContactByAddressAndNetworkId } = useContext(AddressBookContext);

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
      {isComplete && !accounts.length ? (
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
            <NoAccountAction>
              <Trans id="DETERMINISTIC_ALTERNATIVES_5" />
            </NoAccountAction>
            .
          </Typography>
          <Button onClick={() => handleUpdate(asset)}>
            <Trans id="DETERMINISTIC_SCAN_AGAIN" />
          </Button>
          <Typography>{translate('DETERMINISTIC_CONTACT_US')}</Typography>
        </NoAccountContainer>
      ) : (
        <Body>
          {accounts.map((account: DWAccountDisplay, index) => (
            <Row key={index} onClick={() => onSelect(account)} isSelected={isSelected(account)}>
              <SelectedContainer isSelected={isSelected(account)}>
                <Icon type="check" />
              </SelectedContainer>
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
                <DPath>({account.pathItem.path})</DPath>
              </DPathContainer>
              <ValueContainer>
                {account.balance
                  ? parseFloat(
                      fromTokenBase(new BN(account.balance.toString()), asset.decimal).toString()
                    ).toFixed(4)
                  : '0.0000'}
              </ValueContainer>
              <TickerContainer>{asset.ticker}</TickerContainer>
              <LinkContainer>
                <LinkOut
                  link={
                    network.blockExplorer
                      ? network.blockExplorer.addressUrl(account.address)
                      : `https://ethplorer.io/address/${account.address}`
                  }
                />
              </LinkContainer>
            </Row>
          ))}
          {generateFreshAddress && (
            <GenerateAddressButton onClick={() => generateFreshAddress()} disabled={!isComplete}>
              <Icon type="add" />
              <STypography>
                <Trans id="DETERMINISTIC_GENERATE_FRESH_ADDRESS" />
              </STypography>
            </GenerateAddressButton>
          )}
        </Body>
      )}
    </Table>
  );
};

export default DeterministicTable;
