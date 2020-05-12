import React, { Component } from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel, Spinner } from '@components';
import { PanelProps } from '@features/CreateWallet';
import translate, { translateRaw } from '@translations';

// Legacy
import reloadIcon from '@assets/images/icn-reload.svg';

const DescriptionItem = styled(Typography)`
  margin-top: 18px;
  font-weight: normal;
  font-size: 18px !important;

  strong {
    font-weight: 900;
  }
`;

const RegenerateImage = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 10px;
  pointer-events: none;
  display: inline;
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
  margin-top: 32px;
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  font-size: 18px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  &:focus,
  &:hover {
    img {
      filter: brightness(0) invert(1);
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 66px;
`;

interface Props extends PanelProps {
  words: string[];
  generateWords(): void;
  decryptMnemonic(): void;
}

export default class GeneratePhrasePanel extends Component<Props> {
  public state = { decrypting: false };

  public componentDidMount() {
    const { generateWords } = this.props;
    generateWords();
  }

  public handleNextClick = () => {
    const { onNext, decryptMnemonic } = this.props;

    this.setState({ decrypting: true });
    setTimeout(() => {
      decryptMnemonic();
      this.setState({ decrypting: false });
      onNext();
    }, 0);
  };

  public render() {
    const { totalSteps, currentStep, words, generateWords, onBack } = this.props;

    return (
      <ExtendedContentPanel
        onBack={onBack}
        stepper={{
          current: currentStep,
          total: totalSteps
        }}
        heading={translateRaw('MNEMONIC_GENERATE_PHRASE_TITLE')}
      >
        <DescriptionItem>{translate('MNEMONIC_GENERATE_PHRASE_DESCRIPTION_1')}</DescriptionItem>
        <DescriptionItem>{translate('MNEMONIC_GENERATE_PHRASE_DESCRIPTION_2')}</DescriptionItem>
        <DescriptionItem>{translate('MNEMONIC_GENERATE_PHRASE_DESCRIPTION_3')}</DescriptionItem>

        <Label>{translateRaw('MNEMONIC_YOUR_PHRASE_LABEL')}</Label>
        <GeneratePhrasePanelWords>{words.join(' ')}</GeneratePhrasePanelWords>

        <ButtonsWrapper>
          <StyledButton onClick={generateWords} secondary={true}>
            <RegenerateImage src={reloadIcon} /> {translateRaw('REGENERATE_MNEMONIC')}
          </StyledButton>

          <ButtonWrapper>
            {this.state.decrypting ? (
              <Spinner size={'x2'} />
            ) : (
              <StyledButton onClick={this.handleNextClick}>{translateRaw('ACTION_6')}</StyledButton>
            )}
          </ButtonWrapper>
        </ButtonsWrapper>
      </ExtendedContentPanel>
    );
  }
}
