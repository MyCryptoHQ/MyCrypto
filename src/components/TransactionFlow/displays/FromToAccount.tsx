import React from 'react';
import styled from 'styled-components';

import translate from '@translations';

import { COLORS, BREAK_POINTS, SPACING } from '@theme';
import { Typography, EditableAccountLabel, Account } from '@components';
import { NetworkId, TAddress, ExtendedAddressBook } from '@types';

export interface IAddressAndLabel {
  address: TAddress;
  addressBookEntry?: ExtendedAddressBook;
}

interface Props {
  networkId: NetworkId;
  fromAccount: IAddressAndLabel;
  toAccount: IAddressAndLabel;
  displayToAddress?: boolean;
}

const AddressWrapper = styled.div`
  background-color: ${COLORS.GREY_LIGHTEST};
  padding: 10px;
  min-height: 100px;
  display: flex;
  align-items: center;
  img {
    max-width: fit-content;
  }
`;

const AddressContainer = styled.div`
  width: 100%;
`;

const Addresses = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin-bottom: ${SPACING.MD};

  > div:not(:last-child) {
    margin-right: ${SPACING.SM};
  }

  @media (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    flex-direction: column;

    > div {
      margin-right: 0px;
    }

    > div:nth-child(2) {
      padding-top: 15px;
    }
  }
`;

const Label = styled(Typography)`
  color: ${(props) => props.theme.text};
  line-height: 1;
`;

const LabelWrapper = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 9px;
`;

const FromToAccount = ({ networkId, fromAccount, toAccount, displayToAddress = true }: Props) => {
  const editableFromAccountLabel = EditableAccountLabel({
    address: fromAccount.address,
    addressBookEntry: fromAccount.addressBookEntry,
    networkId
  });
  const editableToAccountLabel = EditableAccountLabel({
    address: toAccount.address,
    addressBookEntry: toAccount.addressBookEntry,
    networkId
  });
  return (
    <Addresses>
      <AddressContainer>
        <LabelWrapper>
          <Label value={translate('CONFIRM_TX_FROM')} fontSize="1.13em" />
        </LabelWrapper>
        <AddressWrapper>
          <Account address={fromAccount.address} title={editableFromAccountLabel} truncate={true} />
        </AddressWrapper>
      </AddressContainer>
      {displayToAddress && (
        <AddressContainer>
          <LabelWrapper>
            <Label value={translate('CONFIRM_TX_TO')} fontSize="1.13em" />
          </LabelWrapper>
          <AddressWrapper>
            <Account address={toAccount.address} title={editableToAccountLabel} truncate={true} />
          </AddressWrapper>
        </AddressContainer>
      )}
    </Addresses>
  );
};

export default FromToAccount;
