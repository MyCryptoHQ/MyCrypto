import React from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import { PanelProps } from '../../CreateWallet';
import translate, { translateRaw } from 'translations';
import keystoreIcon from 'common/assets/images/icn-keystore.svg';

import downloadIcon from 'common/assets/images/icn-download.svg';

const DownloadImage = styled.embed`
  width: 16px;
  height: 16px;
  margin-right: 10px;
  pointer-events: none;
  display: inline;
`;

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
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus,
  &:hover {
    embed {
      filter: brightness(0) invert(1);
    }
  }
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
        total: 5
      }}
      heading={translateRaw('SAVE_KEYSTORE_TITLE')}
    >
      <ImageWrapper>
        <img src={keystoreIcon} />
      </ImageWrapper>

      <DescriptionItem>{translate('SAVE_KEYSTORE_DESCRIPTION_1')}</DescriptionItem>
      <DescriptionItem>{translate('SAVE_KEYSTORE_DESCRIPTION_2')}</DescriptionItem>
      <DescriptionItem>{translate('SAVE_KEYSTORE_DESCRIPTION_3')}</DescriptionItem>
      <ButtonsWrapper>
        <StyledButton secondary={true}>
          <DownloadImage src={downloadIcon} />
          {translate('SAVE_KEYSTORE_BUTTON')}
        </StyledButton>
        <StyledButton onClick={onNext}>{translate('ACTION_6')}</StyledButton>
      </ButtonsWrapper>
    </ExtendedContentPanel>
  );
}
