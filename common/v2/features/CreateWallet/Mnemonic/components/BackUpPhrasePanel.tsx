import React, { Component } from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel, InlineMessage, PrintPaperWalletButton } from '@components';
import lockSafetyIcon from '@assets/images/icn-lock-safety.svg';
import { PanelProps } from '@features/CreateWallet';
import translate, { translateRaw } from '@translations';

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 33px;
  margin-bottom: 25px;
`;

const DescriptionItem = styled(Typography)`
  margin-top: 18px;
  font-weight: normal;
  font-size: 18px !important;

  strong {
    font-weight: 900;
  }
`;

const GeneratePhrasePanelWords = styled(Typography)`
  padding: 29px;
  border: 1px solid #e5ecf3;
  line-height: 1.5;
  text-align: center;
  font-weight: 500;
  word-spacing: 14px;
  height: 140px;
  display: flex;
  align-items: center;
`;

const Label = styled.p`
  font-size: 20px;
  font-weight: 500;
  margin-top: 42px;
`;

const ButtonsWrapper = styled.div`
  margin-top: 28px;
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

const ErrorWrapper = styled.div`
  margin-top: 24px;
`;

interface Props extends PanelProps {
  words: string[];
  address: string;
  path: string;
}

interface State {
  printed: boolean;
  error: boolean;
}

export default class BackUpPhrasePanel extends Component<Props, State> {
  public state: State = {
    printed: false,
    error: false
  };

  public handleDoneClick = () => {
    const { onNext } = this.props;

    if (!this.state.printed) {
      this.setState({ error: true });
    } else {
      onNext();
    }
  };

  public handlePrintClick = () => {
    this.setState({ printed: true, error: false });
  };

  public render() {
    const { address, words, path, currentStep, totalSteps, onBack } = this.props;

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
        <DescriptionItem>{translate('MNEMONIC_MAKE_BACKUP_DESCRIPTION')}</DescriptionItem>

        <Label>{translateRaw('MNEMONIC_YOUR_PHRASE_LABEL')}</Label>
        <GeneratePhrasePanelWords>{words.join(' ')}</GeneratePhrasePanelWords>

        {this.state.error && (
          <ErrorWrapper>
            <InlineMessage>{translateRaw('MNEMONIC_MAKE_BACKUP_ERROR')}</InlineMessage>
          </ErrorWrapper>
        )}
        <ButtonsWrapper>
          <PrintPaperWalletButton
            address={address}
            mnemonic={words.join(' ')}
            path={path}
            printText={translate('X_PRINT')}
            onPrintWalletClick={this.handlePrintClick}
          />
          <StyledButton onClick={this.handleDoneClick}>{translate('ACTION_6')}</StyledButton>
        </ButtonsWrapper>
      </ExtendedContentPanel>
    );
  }
}
