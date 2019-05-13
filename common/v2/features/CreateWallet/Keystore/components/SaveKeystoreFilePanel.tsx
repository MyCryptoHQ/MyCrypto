import React from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import { PanelProps } from '../../CreateWallet';
import translate from 'translations';
import keystoreIcon from 'common/assets/images/icn-keystore.svg';

const DescriptionItem = styled(Typography)`
  margin-top: 18px;
  font-weight: normal;
  font-size: 18px !important;

  strong {
    font-weight: 900;
  }
`;

const ButtonsWrapper = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
`;
const StyledButton = styled(Button)`
  font-size: 18px;
  margin-bottom: 16px;
  width: 100%;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 33px;
  margin-bottom: 25px;
`;

export default function SaveKeystoreFilePanel({ onBack, onNext }: PanelProps) {
  return (
    <ExtendedContentPanel
      onBack={onBack}
      stepper={{
        current: 3,
        total: 3
      }}
      heading="Save Your Keystore File"
      className="SaveKeystoreFilePanel"
    >
      <ImageWrapper>
        <img src={keystoreIcon} />
      </ImageWrapper>

      <DescriptionItem>{translate('SAVE_KEYSTORE_DESCRIPTION_1')}</DescriptionItem>
      <DescriptionItem>{translate('SAVE_KEYSTORE_DESCRIPTION_2')}</DescriptionItem>
      <DescriptionItem>{translate('SAVE_KEYSTORE_DESCRIPTION_3')}</DescriptionItem>
      <ButtonsWrapper>
        <StyledButton secondary={true} onClick={onNext}>
          {translate('SAVE_KEYSTORE_BUTTON')}
        </StyledButton>
        <StyledButton onClick={onNext}>{translate('ACTION_6')}</StyledButton>
      </ButtonsWrapper>
    </ExtendedContentPanel>
  );
}
