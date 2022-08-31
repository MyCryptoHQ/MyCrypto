import styled from 'styled-components';

import { Account, EditableAccountLabel, Typography } from '@components';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import translate from '@translations';
import { ExtendedContact, NetworkId, TAddress } from '@types';

export interface IAddressAndLabel {
  address: TAddress;
  addressBookEntry?: ExtendedContact;
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
  const labelFromProps = {
    address: fromAccount.address,
    addressBookEntry: fromAccount.addressBookEntry,
    networkId
  };
  const labelToProps = {
    address: toAccount.address,
    addressBookEntry: toAccount.addressBookEntry,
    networkId
  };

  return (
    <Addresses>
      <AddressContainer>
        <LabelWrapper>
          <Label value={translate('CONFIRM_TX_FROM')} fontSize="1.13em" />
        </LabelWrapper>
        <AddressWrapper>
          <Account
            address={fromAccount.address}
            title={<EditableAccountLabel {...labelFromProps} />}
            truncate={true}
          />
        </AddressWrapper>
      </AddressContainer>
      {displayToAddress && toAccount.address && (
        <AddressContainer>
          <LabelWrapper>
            <Label value={translate('CONFIRM_TX_TO')} fontSize="1.13em" />
          </LabelWrapper>
          <AddressWrapper>
            <Account
              address={toAccount.address}
              title={<EditableAccountLabel {...labelToProps} />}
              truncate={true}
            />
          </AddressWrapper>
        </AddressContainer>
      )}
    </Addresses>
  );
};

export default FromToAccount;
