import React from 'react';
import styled from 'styled-components';
import { Address } from '@mycrypto/ui';

import { StoreAccount } from 'v2/types';
import { COLORS } from 'v2/theme';

const { SILVER } = COLORS;

interface Props {
  fromAccount: StoreAccount;
  toAccount: StoreAccount;
}

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

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

export default function FromToAccount(props: Props) {
  const { fromAccount, toAccount } = props;

  return (
    <Addresses>
      <div>
        <Label>From:</Label>
        <AddressWrapper>
          <Address
            address={fromAccount.address}
            title={fromAccount.label || 'No label'}
            truncate={truncate}
          />
        </AddressWrapper>
      </div>
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
