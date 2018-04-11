import React from 'react';
import { generateMnemonic } from 'bip39';
import translate from 'translations';
import Word from './Word';
import FinalSteps from '../FinalSteps';
import Template from '../Template';
import { WalletType } from '../../GenerateWallet';
import './Mnemonic.scss';

interface State {
  words: string[];
  confirmValues: string[];
  isConfirming: boolean;
  isConfirmed: boolean;
}

interface WordTuple {
  word: string;
  index: number;
}

export default class GenerateMnemonic extends React.Component<{}, State> {
  public state: State = {
    words: [],
    confirmValues: [],
    isConfirming: false,
    isConfirmed: false
  };

  public componentDidMount() {
    this.regenerateWordArray();
  }

  public render() {
    const { words, isConfirming, isConfirmed } = this.state;
    let content;

    if (isConfirmed) {
      content = <FinalSteps walletType={WalletType.Mnemonic} />;
    } else {
      const canContinue = this.checkCanContinue();
      const [firstHalf, lastHalf] = this.shuffle(words);

      content = (
        <div className="GenerateMnemonic">
          <h1 className="GenerateMnemonic-title">{translate('GENERATE_MNEMONIC_TITLE')}</h1>

          <p className="GenerateMnemonic-help">Select the words in order.</p>

          <div className="GenerateMnemonic-words">
            {[firstHalf, lastHalf].map((ws, i) => (
              <div key={i} className="GenerateMnemonic-words-column">
                {ws.map(this.makeWord)}
              </div>
            ))}
          </div>

          <div className="GenerateMnemonic-buttons">
            {!isConfirming && (
              <button
                className="GenerateMnemonic-buttons-btn btn btn-default"
                onClick={this.regenerateWordArray}
              >
                <i className="fa fa-refresh" /> {translate('REGENERATE_MNEMONIC')}
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

      // content = (
      //   <div className="GenerateMnemonic">
      //     <h1 className="GenerateMnemonic-title">{translate('GENERATE_MNEMONIC_TITLE')}</h1>

      //     <p className="GenerateMnemonic-help">
      //       {isConfirming
      //         ? translate('MNEMONIC_DESCRIPTION_1')
      //         : translate('MNEMONIC_DESCRIPTION_2')}
      //     </p>

      //     <div className="GenerateMnemonic-words">
      //       {[firstHalf, lastHalf].map((ws, i) => (
      //         <div key={i} className="GenerateMnemonic-words-column">
      //           {ws.map(this.makeWord)}
      //         </div>
      //       ))}
      //     </div>

      //     <div className="GenerateMnemonic-buttons">
      //       {!isConfirming && (
      //         <button
      //           className="GenerateMnemonic-buttons-btn btn btn-default"
      //           onClick={this.regenerateWordArray}
      //         >
      //           <i className="fa fa-refresh" /> {translate('REGENERATE_MNEMONIC')}
      //         </button>
      //       )}
      //       <button
      //         className="GenerateMnemonic-buttons-btn btn btn-primary"
      //         disabled={!canContinue}
      //         onClick={this.goToNextStep}
      //       >
      //         {translate('CONFIRM_MNEMONIC')}
      //       </button>
      //     </div>

      //     <button className="GenerateMnemonic-skip" onClick={this.skip} />
      //   </div>
      // );
    }

    return <Template>{content}</Template>;
  }

  private regenerateWordArray = () => {
    this.setState({ words: generateMnemonic().split(' ') });
  };

  private handleConfirmChange = (index: number, value: string) => {
    this.setState((state: State) => {
      const confirmValues = [...state.confirmValues];
      confirmValues[index] = value;
      this.setState({ confirmValues });
    });
  };

  private goToNextStep = () => {
    if (!this.checkCanContinue()) {
      return;
    }

    if (this.state.isConfirming) {
      this.setState({ isConfirmed: true });
    } else {
      this.setState({ isConfirming: true });
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

  private makeWord = (word: WordTuple) => (
    <Word
      key={`${word.word}${word.index}`}
      index={word.index}
      showIndex={!this.state.isConfirming}
      word={word.word}
      value={this.state.confirmValues[word.index] || ''}
      onChange={this.handleConfirmChange}
      onClick={this.handleWordClick}
    />
  );

  private handleWordClick = (index: number, value: string) => {
    console.log('Index', index, 'value', value);
  };

  private skip = () => {
    this.setState({ isConfirmed: true });
  };

  private shuffle = (array: Array<string>) => {
    const firstHalf: Array<WordTuple> = [];
    const lastHalf: Array<WordTuple> = [];

    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    array.forEach((word: string, index: number) => {
      const inFirstColumn = index < array.length / 2;
      const half = inFirstColumn ? firstHalf : lastHalf;

      half.push({ word, index });
    });

    return [firstHalf, lastHalf];
  };
}
