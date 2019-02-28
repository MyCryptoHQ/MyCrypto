import React, { Component } from 'react';
import classnames from 'classnames';
import chunk from 'lodash/chunk';
import shuffle from 'lodash/shuffle';
import { Button } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import { PanelProps } from '../../CreateWallet';
import './ConfirmPhrasePanel.scss';

interface Props extends PanelProps {
  words: string[];
  generateWords(): void;
}

interface State {
  confirmedWords: string[];
  shuffledWords: string[];
  wrongWord: string;
}

export default class ConfirmPhrasePanel extends Component<Props> {
  public state: State = {
    shuffledWords: shuffle(this.props.words),
    confirmedWords: [],
    wrongWord: ''
  };

  public render() {
    const { onBack, onNext } = this.props;
    const { confirmedWords, shuffledWords, wrongWord } = this.state;

    return (
      <ContentPanel
        onBack={onBack}
        stepper={{
          current: 4,
          total: 4
        }}
        heading="Confirm Phrase"
        description="Confirm your mnemonic phrase by selecting each phrase in order to make sure it is correct."
        className="ConfirmPhrasePanel"
      >
        <div className="ConfirmPhrasePanel-activeWords">
          {chunk(confirmedWords, 4).map((row, rowIndex) => (
            <div key={rowIndex} className="ConfirmPhrasePanel-activeWords-row">
              {row.map((word, wordIndex) => (
                <div key={wordIndex} className="ConfirmPhrasePanel-activeWords-row-word">
                  {word}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="ConfirmPhrasePanel-selectableWords">
          {chunk(shuffledWords, 4).map((row, rowIndex) => (
            <div key={rowIndex} className="ConfirmPhrasePanel-selectableWords-row">
              {row.map((word, wordIndex) => (
                <div
                  key={wordIndex}
                  className={classnames('ConfirmPhrasePanel-selectableWords-row-word', {
                    wrong: wrongWord === word,
                    confirmed: confirmedWords.includes(word)
                  })}
                  onClick={() => this.confirmWord(word)}
                >
                  {word}
                </div>
              ))}
            </div>
          ))}
        </div>
        <Button
          className="ConfirmPhrasePanel-next"
          onClick={onNext}
          disabled={confirmedWords.length !== shuffledWords.length}
        >
          Confirm Phrase
        </Button>
      </ContentPanel>
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
