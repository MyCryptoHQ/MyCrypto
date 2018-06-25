import React from 'react';
import classnames from 'classnames';

import { Input } from 'components/ui';
import './Word.scss';

interface Props {
  index: number;
  confirmIndex: number;
  word: string;
  value: string;
  showIndex: boolean;
  isNext: boolean;
  isBeingRevealed: boolean;
  isConfirming: boolean;
  hasBeenConfirmed: boolean;
  onClick(index: number, value: string): void;
}

interface State {
  flashingError: boolean;
}

export default class MnemonicWord extends React.Component<Props, State> {
  public state = {
    flashingError: false
  };

  public render() {
    const {
      hasBeenConfirmed,
      isBeingRevealed,
      showIndex,
      index,
      isConfirming,
      confirmIndex,
      word
    } = this.props;
    const { flashingError } = this.state;
    const btnClassName = classnames({
      btn: true,
      'btn-default': !(isBeingRevealed || flashingError),
      'btn-success': isBeingRevealed,
      'btn-danger': flashingError
    });
    const indexClassName = 'input-group-addon input-group-addon--transparent';

    return (
      <div className="input-group-wrapper MnemonicWord">
        <label className="input-group input-group-inline ENSInput-name">
          {showIndex && <span className={indexClassName}>{index + 1}.</span>}
          {hasBeenConfirmed && (
            <span className="MnemonicWord-button-index">{confirmIndex + 1}</span>
          )}
          {isConfirming ? (
            <button
              className={`MnemonicWord-button ${btnClassName} ${
                hasBeenConfirmed ? 'disabled' : ''
              }`}
              onClick={() => this.handleClick(word)}
            >
              {word}
            </button>
          ) : (
            <Input
              className="MnemonicWord-word-input"
              value={word}
              readOnly={true}
              showValidAsPlain={true}
              isValid={true}
            />
          )}
        </label>
      </div>
    );
  }

  private handleClick = (value: string) => {
    const { isNext, index, onClick } = this.props;

    if (!isNext) {
      this.flashError();
    }

    onClick(index, value);
  };

  private flashError = () => {
    const errorDuration = 200;

    this.setState(
      {
        flashingError: true
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              flashingError: false
            }),
          errorDuration
        )
    );
  };
}
