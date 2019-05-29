import React, { Component } from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import lockSafetyIcon from 'common/assets/images/icn-lock-safety.svg';
import { InlineErrorMsg } from 'v2/components/ErrorMessages/InlineErrors';
import { PanelProps } from '../../CreateWallet';

// Legacy
import printerIcon from 'common/assets/images/icn-printer.svg';
import translate, { translateRaw } from 'translations';

const PrinterImage = styled.embed`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  pointer-events: none;
  display: inline;
`;

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

const ErrorWrapper = styled.div`
  margin-top: 24px;
`;

interface Props extends PanelProps {
  words: string[];
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
    const { words, currentStep, totalSteps, onBack } = this.props;

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
            <InlineErrorMsg>{translateRaw('MNEMONIC_MAKE_BACKUP_ERROR')}</InlineErrorMsg>
          </ErrorWrapper>
        )}
        <ButtonsWrapper>
          <StyledButton secondary={true} onClick={this.handlePrintClick}>
            <PrinterImage src={printerIcon} />
            {translate('X_PRINT')}
          </StyledButton>
          <StyledButton onClick={this.handleDoneClick}>{translate('ACTION_6')}</StyledButton>
        </ButtonsWrapper>
      </ExtendedContentPanel>
    );
  }
}
