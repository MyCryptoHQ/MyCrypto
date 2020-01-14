import React from 'react';
import styled from 'styled-components';
import { Address } from '@mycrypto/ui';

import translate, { translateRaw } from 'v2/translations';

import { StoreAccount } from 'v2/types';
import { COLORS, BREAK_POINTS } from 'v2/theme';
import { truncate } from 'v2/utils';
import { Typography } from 'v2/components';

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

const Label = styled(Typography)`
  color: ${props => props.theme.text};
  line-height: 1;
`;

const LabelWrapper = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 9px;
`;

export default function FromToAccount(props: Props) {
  const { fromAccount, toAccount } = props;
  const noLabel = translateRaw('NO_LABEL');

  return (
    <Addresses>
      <div>
        <LabelWrapper>
          <Label value={translate('CONFIRM_TX_FROM')} fontSize="1.13em" />
        </LabelWrapper>
        <AddressWrapper>
          <Address
            address={fromAccount.address}
            title={fromAccount.label || noLabel}
            truncate={truncate}
          />
        </AddressWrapper>
      </div>
      <div>
        <LabelWrapper>
          <Label value={translate('CONFIRM_TX_TO')} fontSize="1.13em" />
        </LabelWrapper>
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
