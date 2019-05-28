import React, { Component } from 'react';
import { Button, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import translate, { translateRaw } from 'translations';

// Legacy
import reloadIcon from 'common/assets/images/icn-reload.svg';
import { MnemonicStageProps } from '../constants';

const DescriptionItem = styled(Typography)`
  margin-top: 18px;
  font-weight: normal;
  font-size: 18px !important;

  strong {
    font-weight: 900;
  }
`;

const RegenerateImage = styled.embed`
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
    embed {
      filter: brightness(0) invert(1);
    }
  }
`;

export default class GeneratePhrasePanel extends Component<
  { words: string[]; generateWords(): void } & MnemonicStageProps
> {
  public componentDidMount() {
    const { generateWords } = this.props;
    generateWords();
  }

  public render() {
    const { totalSteps, words, generateWords, onBack, onNext } = this.props;

    return (
      <ExtendedContentPanel
        onBack={onBack}
        stepper={{
          current: 2,
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
          <StyledButton onClick={onNext}>{translateRaw('ACTION_6')}</StyledButton>
        </ButtonsWrapper>
      </ExtendedContentPanel>
    );
  }
}
