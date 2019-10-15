import React from 'react';
import styled from 'styled-components';
import { Address } from '@mycrypto/ui';

import { StoreAccount } from 'v2/types';
import { COLORS, BREAK_POINTS } from 'v2/theme';
import { truncate } from 'v2/utils';
import translate, { translateRaw } from 'translations';

const { SILVER } = COLORS;
const { SCREEN_XS } = BREAK_POINTS;

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

  @media (max-width: ${SCREEN_XS}) {
    flex-direction: column;

    > div:nth-child(2) {
      padding-top: 15px;
    }
  }
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
  const noLabel = translateRaw('NO_LABEL');

  return (
    <Addresses>
      <div>
        <Label>{translate('CONFIRM_TX_FROM')}</Label>
        <AddressWrapper>
          <Address
            address={fromAccount.address}
            title={fromAccount.label || noLabel}
            truncate={truncate}
          />
        </AddressWrapper>
      </div>
      <div>
        <Label>{translate('CONFIRM_TX_TO')}</Label>
        <AddressWrapper>
          <Address
            address={toAccount.address}
            title={toAccount.label || noLabel}
            truncate={truncate}
          />
        </AddressWrapper>
      </div>
    </Addresses>
  );
}
