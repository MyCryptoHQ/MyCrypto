import React from 'react';
import classnames from 'classnames';
import { translateRaw } from 'translations';
import './Word.scss';
import { Input } from 'components/ui';

interface Props {
  index: number;
  showIndex: boolean;
  isNext: boolean;
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
    const { index, showIndex, word, hasBeenConfirmed, confirmIndex } = this.props;
    const { flashingError } = this.state;

    return (
      <div className="input-group-wrapper MnemonicWord">
        <label
          className="input-group input-group-inline ENSInput-name"
          style={{ cursor: 'pointer' }}
        >
          {showIndex && (
            <span className="input-group-addon input-group-addon--transparent">{index + 1}.</span>
          )}
          {hasBeenConfirmed && (
            <span className="input-group-addon input-group-addon--transparent">
              {confirmIndex + 1}.
            </span>
          )}
          <Input
            className={`MnemonicWord-word-input ${
              hasBeenConfirmed ? 'MnemonicWord-word-input-confirmed' : ''
            } ${flashingError ? 'MnemonicWord-word-input-error' : ''}`}
            value={word}
            onChange={this.handleChange}
            onClick={this.handleClick}
            readOnly={true}
          />
        </label>
      </div>
    );
  }

  private handleChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.props.onChange(this.props.index, ev.currentTarget.value);
  };

  private handleClick = (ev: React.FormEvent<HTMLInputElement>) => {
    const { isNext } = this.props;

    if (!isNext) this.flashError();

    this.props.onClick(this.props.index, ev.currentTarget.value);
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
