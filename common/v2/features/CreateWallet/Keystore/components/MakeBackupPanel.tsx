import React, { Component } from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';
import { IV3Wallet } from 'ethereumjs-wallet';

import { ExtendedContentPanel, PrintPaperWalletButton } from 'v2/components';
import { PanelProps } from 'v2/features/CreateWallet';
import translate, { translateRaw } from 'v2/translations';

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
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus,
  &:hover {
    img {
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
  font-family: 'Roboto Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
`;

interface Props extends PanelProps {
  privateKey: string;
  keystore: IV3Wallet;
}

export default class MakeBackupPanel extends Component<Props> {
  public render() {
    const { onBack, onNext, totalSteps, currentStep, privateKey, keystore } = this.props;

    return (
      <ExtendedContentPanel
        onBack={onBack}
        stepper={{
          current: currentStep,
          total: totalSteps
        }}
        heading={translateRaw('MAKE_BACKUP_TITLE')}
      >
        <ImageWrapper>
          <img src={lockSafetyIcon} />
        </ImageWrapper>

        <DescriptionItem>{translate('MAKE_BACKUP_DESCRIPTION_1')}</DescriptionItem>
        <DescriptionItem>{translate('MAKE_BACKUP_DESCRIPTION_2')}</DescriptionItem>
        <DescriptionItem>{translate('MAKE_BACKUP_DESCRIPTION_3')}</DescriptionItem>

        <PrivateKeyWrapper>
          {translate('YOUR_PRIVATE_KEY_LABEL')}
          <PrivateKeyField>{privateKey}</PrivateKeyField>
        </PrivateKeyWrapper>
        <ButtonsWrapper>
          <PrintPaperWalletButton
            address={keystore.address}
            privateKey={privateKey}
            printText={translate('MAKE_BACKUP_PRINT_BUTTON')}
          />
          <StyledButton onClick={onNext}>{translate('ACTION_6')}</StyledButton>
        </ButtonsWrapper>
      </ExtendedContentPanel>
    );
  }
}
