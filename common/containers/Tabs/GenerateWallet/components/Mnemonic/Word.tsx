import React from 'react';
import classnames from 'classnames';
import { translateRaw } from 'translations';
import './Word.scss';
import { Input } from 'components/ui';

interface Props {
  index: number;
  showIndex: boolean;
  isNext: boolean;
  isBeingRevealed: boolean;
  isConfirming: boolean;
  word: string;
  value: string;
  hasBeenConfirmed: boolean;
  confirmIndex: number;
  onChange(index: number, value: string): void;
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
      index,
      showIndex,
      word,
      isConfirming,
      hasBeenConfirmed,
      confirmIndex,
      isBeingRevealed
    } = this.props;
    const { flashingError } = this.state;
    const btnClassName = classnames({
      btn: true,
      'btn-default': !(hasBeenConfirmed || isBeingRevealed || flashingError),
      'btn-success': hasBeenConfirmed || isBeingRevealed,
      'btn-danger': flashingError
    });

    return (
      <div className="input-group-wrapper MnemonicWord">
        <label className="input-group input-group-inline ENSInput-name">
          {showIndex && (
            <span className="input-group-addon input-group-addon--transparent">{index + 1}.</span>
          )}
          {hasBeenConfirmed && (
            <span className="input-group-addon input-group-addon--transparent">
              {confirmIndex + 1}.
            </span>
          )}
          {isConfirming ? (
            <button
              className={btnClassName}
              onClick={() => this.handleClick(word)}
              disabled={hasBeenConfirmed}
            >
              {word}
            </button>
          ) : (
            <Input
              className="MnemonicWord-word-input"
              value={word}
              onChange={this.handleChange}
              readOnly={true}
            />
          )}
        </label>
      </div>
    );
  }

  private handleChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.props.onChange(this.props.index, ev.currentTarget.value);
  };

  private handleClick = (value: string) => {
    const { isNext, index, onClick } = this.props;

    if (!isNext) this.flashError();

    onClick(index, value);
  };

  private flashError = () => {
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
          200
        )
    );
  };
}
