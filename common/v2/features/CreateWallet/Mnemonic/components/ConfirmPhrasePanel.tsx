import React, { Component } from 'react';
import chunk from 'lodash/chunk';
import shuffle from 'lodash/shuffle';
import { Button } from '@mycrypto/ui';
import { translateRaw } from 'translations';
import styled from 'styled-components';

import { ExtendedContentPanel } from 'v2/components';
import { PanelProps } from '../../CreateWallet';
import { InlineErrorMsg } from 'v2/components/ErrorMessages/InlineErrors';

const ActiveWords = styled.div`
  height: 200px;
  margin-top: 10px;
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #e5ecf3;
  background: rgba(247, 247, 247, 0.4);
  margin-top: 36px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 9px;
`;

const ActiveWordsRow = styled(Row)`
  justify-content: flex-start;
`;

const Word = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 28px;
  padding: 6px 14px;
  border-radius: 1.4px;
  background-color: rgba(122, 129, 135, 0.75);
  color: #fff;

  &:not(:last-of-type) {
    margin-right: 9px;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
`;

interface SelectableWordProps {
  confirmed: boolean;
  wrong: boolean;
}

const SelectableWord = styled(Word)`
  cursor: pointer;
  width: 100px;
  transition: background-color 0.1s ease-in;
  background-color: ${(props: SelectableWordProps) =>
    props.wrong ? '#ef4747' : props.confirmed ? '#a682ff' : 'rgba(122, 129, 135, 0.75)'};
`;

const ErrorWrapper = styled.div`
  margin-top: 24px;
`;

interface Props extends PanelProps {
  words: string[];
  addCreatedAccountAndRedirectToDashboard(): void;
}

interface State {
  confirmedWords: string[];
  shuffledWords: string[];
  wrongWord: string;
  doneClicked: boolean;
  error: boolean;
}

export default class ConfirmPhrasePanel extends Component<Props> {
  public state: State = {
    shuffledWords: shuffle(this.props.words),
    confirmedWords: [],
    wrongWord: '',
    doneClicked: false,
    error: false
  };

  public handleDoneClicked = () => {
    const { addCreatedAccountAndRedirectToDashboard } = this.props;
    const { confirmedWords, shuffledWords } = this.state;

    this.setState({ doneClicked: true, error: false });

    if (confirmedWords.length !== shuffledWords.length) {
      this.setState({ error: true });
    } else {
      addCreatedAccountAndRedirectToDashboard();
    }
  };

  public render() {
    const { totalSteps, onBack, currentStep } = this.props;
    const { confirmedWords, shuffledWords, wrongWord } = this.state;

    return (
      <ExtendedContentPanel
        onBack={onBack}
        stepper={{
          current: currentStep,
          total: totalSteps
        }}
        heading={translateRaw('MNEMONIC_VERIFY_TITLE')}
        description={translateRaw('MNEMONIC_VERIFY_DESCRIPTION')}
      >
        <ActiveWords>
          {chunk(confirmedWords, 4).map((row, rowIndex) => (
            <ActiveWordsRow key={rowIndex}>
              {row.map((word, wordIndex) => <Word key={wordIndex}>{word}</Word>)}
            </ActiveWordsRow>
          ))}
        </ActiveWords>
        <div>
          {chunk(shuffledWords, 4).map((row, rowIndex) => (
            <Row key={rowIndex}>
              {row.map((word, wordIndex) => (
                <SelectableWord
                  wrong={wrongWord === word}
                  confirmed={confirmedWords.includes(word)}
                  key={wordIndex}
                  onClick={() => this.confirmWord(word)}
                >
                  {word}
                </SelectableWord>
              ))}
            </Row>
          ))}
        </div>
        {this.state.doneClicked &&
          this.state.error && (
            <ErrorWrapper>
              <InlineErrorMsg>{translateRaw('MNEMONIC_VERIFY_ERROR')}</InlineErrorMsg>
            </ErrorWrapper>
          )}
        <StyledButton onClick={this.handleDoneClicked}>
          {translateRaw('DONE_AND_RETURN_LABEL')}
        </StyledButton>
      </ExtendedContentPanel>
    );
  }

  private confirmWord = (word: string) => {
    const { words } = this.props;
    const { confirmedWords } = this.state;
    const nextIndex = confirmedWords.length;
    const correctWord = words[nextIndex];

    if (confirmedWords.includes(word)) {
      return;
    } else if (word === correctWord) {
      this.setState((prevState: State) => ({
        confirmedWords: prevState.confirmedWords.concat(word),
        wrongWord: ''
      }));
    } else {
      this.setState({
        wrongWord: word
      });
    }
  };
}
