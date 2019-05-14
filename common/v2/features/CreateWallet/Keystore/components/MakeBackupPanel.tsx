import React from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import { PanelProps } from '../../CreateWallet';
import translate, { translateRaw } from 'translations';
import lockSafetyIcon from 'common/assets/images/icn-lock-safety.svg';

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

const PrivateKeyWrapper = styled.div`
  font-size: 20px;
  margin-top: 18px;
`;

const PrivateKeyField = styled.div`
  width: 100%;
  font-size: 18px;
  border: solid 1px #e5ecf3;
  background-color: rgba(247, 247, 247, 0.4);
  word-wrap: break-word;
  padding: 8px 18px;
  margin-top: 8px;
`;

export default function MakeBackupPanel({ onBack, onNext }: PanelProps) {
  return (
    <ExtendedContentPanel
      onBack={onBack}
      stepper={{
        current: 4,
        total: 5
      }}
      heading={translateRaw('MAKE_BACKUP_TITLE')}
      className="SaveKeystoreFilePanel"
    >
      <ImageWrapper>
        <img src={lockSafetyIcon} />
      </ImageWrapper>

      <DescriptionItem>{translate('MAKE_BACKUP_DESCRIPTION_1')}</DescriptionItem>
      <DescriptionItem>{translate('MAKE_BACKUP_DESCRIPTION_2')}</DescriptionItem>
      <DescriptionItem>{translate('MAKE_BACKUP_DESCRIPTION_3')}</DescriptionItem>

      <PrivateKeyWrapper>
        {translate('YOUR_PRIVATE_KEY_LABEL')}
        <PrivateKeyField>
          afdfd9c3d2095ef696594f6cedcae59e72dcd697e2a7521b1578140422a4f890
        </PrivateKeyField>
      </PrivateKeyWrapper>
      <ButtonsWrapper>
        <StyledButton secondary={true} onClick={onNext}>
          {translate('MAKE_BACKUP_PRINT_BUTTON')}
        </StyledButton>
        <StyledButton onClick={onNext}>{translate('ACTION_6')}</StyledButton>
      </ButtonsWrapper>
    </ExtendedContentPanel>
  );
}
