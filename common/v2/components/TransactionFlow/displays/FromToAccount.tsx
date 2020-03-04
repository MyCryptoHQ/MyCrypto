import React from 'react';
import styled from 'styled-components';

import translate, { translateRaw } from 'v2/translations';

import { COLORS, BREAK_POINTS } from 'v2/theme';
import { truncate } from 'v2/utils';
import { Typography, Account } from 'v2/components';

export interface IAddressAndLabel {
  address: string;
  label: string | undefined;
}

interface Props {
  fromAddressAndLabel: IAddressAndLabel;
  toAddressAndLabel: IAddressAndLabel;
}

const AddressWrapper = styled.div`
  background-color: ${COLORS.GREY_LIGHTEST};
  padding: 10px;

  img {
    max-width: fit-content;
  }
`;
const Addresses = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 56px;

  > div {
    max-width: 48%;
  }

  @media (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    flex-direction: column;

    > div {
      max-width: 100%;
    }

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
  const { fromAddressAndLabel, toAddressAndLabel } = props;
  const noLabel = translateRaw('NO_LABEL');

  return (
    <Addresses>
      <div>
        <LabelWrapper>
          <Label value={translate('CONFIRM_TX_FROM')} fontSize="1.13em" />
        </LabelWrapper>
        <AddressWrapper>
          <Account
            address={fromAddressAndLabel.address}
            title={fromAddressAndLabel.label || noLabel}
            truncate={truncate}
          />
        </AddressWrapper>
      </div>
      <div>
        <LabelWrapper>
          <Label value={translate('CONFIRM_TX_TO')} fontSize="1.13em" />
        </LabelWrapper>
        <AddressWrapper>
          <Account
            address={toAddressAndLabel.address}
            title={toAddressAndLabel.label || noLabel}
            truncate={truncate}
          />
        </AddressWrapper>
      </div>
    </Addresses>
  );
}
