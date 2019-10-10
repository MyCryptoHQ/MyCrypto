import React from 'react';
import styled from 'styled-components';
import { Address } from '@mycrypto/ui';

import { StoreAccount } from 'v2/types';
import { COLORS } from 'v2/theme';
import { truncate } from 'v2/utils';

const { SILVER } = COLORS;

interface Props {
  fromAccount: StoreAccount;
  toAccount: StoreAccount;
}

const FromWrapper = styled.div`
  padding-right: 15px;
`;

const AddressWrapper = styled.div`
  background-color: ${SILVER};
  padding: 10px;
`;
const Addresses = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 56px;
`;

const Label = styled.div`
  font-size: 18px;
  width: 100%;
  line-height: 1;
  text-align: left;
  font-weight: normal;
  margin-bottom: 9px;
  color: ${props => props.theme.text};
`;

export default function FromToAccount(props: Props) {
  const { fromAccount, toAccount } = props;

  return (
    <Addresses>
      <FromWrapper>
        <Label>From:</Label>
        <AddressWrapper>
          <Address
            address={fromAccount.address}
            title={fromAccount.label || 'No label'}
            truncate={truncate}
          />
        </AddressWrapper>
      </FromWrapper>
      <div>
        <Label>To:</Label>
        <AddressWrapper>
          <Address
            address={toAccount.address}
            title={toAccount.label || 'No label'}
            truncate={truncate}
          />
        </AddressWrapper>
      </div>
    </Addresses>
  );
}
