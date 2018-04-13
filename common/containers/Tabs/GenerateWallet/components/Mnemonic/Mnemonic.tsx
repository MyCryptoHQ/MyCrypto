import React from 'react';
import { generateMnemonic } from 'bip39';
import translate from 'translations';
import shuffle from 'lodash/shuffle';
import Word from './Word';
import FinalSteps from '../FinalSteps';
import Template from '../Template';
import { WalletType } from '../../GenerateWallet';
import './Mnemonic.scss';

interface State {
  words: string[];
  confirmValues: string[];
  confirmWords: WordTuple[][];
  isConfirming: boolean;
  isConfirmed: boolean;
  isRevealingNextWord: boolean;
}

interface WordTuple {
  word: string;
  index: number;
}

export default class GenerateMnemonic extends React.Component<{}, State> {
  public state: State = {
    words: [],
    confirmValues: [],
    confirmWords: [],
    isConfirming: false,
    isConfirmed: false,
    isRevealingNextWord: false
  };

  public componentDidMount() {
    this.regenerateWordArray();
  }

  public render() {
    const { words, confirmWords, isConfirming, isConfirmed } = this.state;
    const defaultBtnClassName = 'GenerateMnemonic-buttons-btn btn btn-default';
    const canContinue = this.checkCanContinue();
    const [firstHalf, lastHalf] =
      confirmWords.length === 0 ? this.splitWordsIntoHalves(words) : confirmWords;

    const content = isConfirmed ? (
      <FinalSteps walletType={WalletType.Mnemonic} />
    ) : (
      <div className="GenerateMnemonic">
        <h1 className="GenerateMnemonic-title">{translate('GENERATE_MNEMONIC_TITLE')}</h1>

        <p className="GenerateMnemonic-help">
          {isConfirming ? translate('MNEMONIC_DESCRIPTION_1') : translate('MNEMONIC_DESCRIPTION_2')}
        </p>

        <div className="GenerateMnemonic-words">
          {[firstHalf, lastHalf].map((ws, i) => (
            <div key={i} className="GenerateMnemonic-words-column">
              {ws.map(this.makeWord)}
            </div>
          ))}
        </div>

        <div className="GenerateMnemonic-buttons">
          {!isConfirming && (
            <button className={defaultBtnClassName} onClick={this.regenerateWordArray}>
              <i className="fa fa-refresh" /> {translate('REGENERATE_MNEMONIC')}
            </button>
          )}
          {isConfirming && (
            <button
              className={defaultBtnClassName}
              disabled={canContinue}
              onClick={this.revealNextWord}
            >
              <i className="fa fa-eye" /> {translate('REVEAL_NEXT_MNEMONIC')}
            </button>
          )}
          <button
            className="GenerateMnemonic-buttons-btn btn btn-primary"
            disabled={!canContinue}
            onClick={this.goToNextStep}
          >
            {translate('CONFIRM_MNEMONIC')}
          </button>
        </div>

        <button className="GenerateMnemonic-skip" onClick={this.skip} />
      </div>
    );

    return <Template>{content}</Template>;
  }

  private regenerateWordArray = () => {
    this.setState({ words: generateMnemonic().split(' ') });
  };

  private goToNextStep = () => {
    if (!this.checkCanContinue()) {
      return;
    }

    if (this.state.isConfirming) {
      this.setState({ isConfirmed: true });
    } else {
      const shuffledWords = shuffle(this.state.words);
      const confirmWords = this.splitWordsIntoHalves(shuffledWords);

      this.setState({
        isConfirming: true,
        confirmWords
      });
    }
  };

  private checkCanContinue = () => {
    const { isConfirming, words, confirmValues } = this.state;

    if (isConfirming) {
      return words.reduce((prev, word, index) => {
        return word === confirmValues[index] && prev;
      }, true);
    } else {
      return !!words.length;
    }
  };

  private makeWord = (word: WordTuple) => {
    const { words, confirmValues, isRevealingNextWord, isConfirming } = this.state;
    const confirmIndex = words.indexOf(word.word);
    const nextIndex = confirmValues.length;
    const isNext = confirmIndex === nextIndex;
    const isRevealed = isRevealingNextWord && isNext;
    const hasBeenConfirmed = this.getWordConfirmed(word.word);

    return (
      <Word
        key={`${word.word}${word.index}`}
        index={word.index}
        confirmIndex={confirmIndex}
        word={word.word}
        value={confirmValues[word.index] || ''}
        showIndex={!isConfirming}
        isNext={isNext}
        isBeingRevealed={isRevealed}
        isConfirming={isConfirming}
        hasBeenConfirmed={hasBeenConfirmed}
        onClick={this.handleWordClick}
      />
    );
  };

  private handleWordClick = (_: number, value: string) => {
    const { confirmValues: previousConfirmValues, words, isConfirming } = this.state;
    const wordAlreadyConfirmed = previousConfirmValues.includes(value);
    const activeIndex = previousConfirmValues.length;
    const isCorrectChoice = words[activeIndex] === value;

    if (isConfirming && !wordAlreadyConfirmed && isCorrectChoice) {
      const confirmValues = previousConfirmValues.concat(value);

      this.setState({ confirmValues });
    }
  };

  private getWordConfirmed = (word: string) => this.state.confirmValues.includes(word);

  private skip = () => {
    this.setState({ isConfirmed: true });
  };

  private revealNextWord = () => {
    const revealDuration = 400;

    this.setState(
      {
        isRevealingNextWord: true
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              isRevealingNextWord: false
            }),
          revealDuration
        )
    );
  };

  private splitWordsIntoHalves = (words: string[]) => {
    const firstHalf: WordTuple[] = [];
    const lastHalf: WordTuple[] = [];

    words.forEach((word: string, index: number) => {
      const inFirstColumn = index < words.length / 2;
      const half = inFirstColumn ? firstHalf : lastHalf;

      half.push({ word, index });
    });

    return [firstHalf, lastHalf];
  };
}
