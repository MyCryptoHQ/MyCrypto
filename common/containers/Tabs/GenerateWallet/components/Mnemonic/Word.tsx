import React from 'react';
import classnames from 'classnames';
import { translateRaw } from 'translations';
import './Word.scss';
import { Input } from 'components/ui';

interface Props {
  index: number;
  showIndex: boolean;
  word: string;
  value: string;
  hasBeenConfirmed: boolean;
  confirmIndex: number;
  onChange(index: number, value: string): void;
  onClick(index: number, value: string): void;
}

interface State {
  derp: boolean;
}

export default class MnemonicWord extends React.Component<Props, State> {
  public state = {
    derp: false
  };

  public render() {
    const { index, showIndex, word, hasBeenConfirmed, confirmIndex } = this.props;

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
            }`}
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
    this.props.onClick(this.props.index, ev.currentTarget.value);
  };
}
