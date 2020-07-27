import React from 'react';
import styled from 'styled-components';

import translate, { translateRaw } from '@translations';

import { COLORS, BREAK_POINTS, SPACING } from '@theme';
import { Typography, Account } from '@components';
import { StoreAccount } from '@types';

export interface IAddressAndLabel {
  address: string;
  label: string | undefined;
}

interface Props {
  to: Pick<StoreAccount, 'address' | 'label'>;
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

export default function RecipientAccount({ to }: Props) {
  const noLabel = translateRaw('NO_LABEL');

  return (
    <Addresses>
      <AddressContainer>
        <LabelWrapper>
          <Label value={translate('X_RECIPIENT')} fontSize="1.13em" />
        </LabelWrapper>
        <AddressWrapper>
          <Account address={to.address} title={to.label || noLabel} />
        </AddressWrapper>
      </AddressContainer>
    </Addresses>
  );
}
