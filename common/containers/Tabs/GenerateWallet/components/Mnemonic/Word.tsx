import React from 'react';
import classnames from 'classnames';
import { translateRaw } from 'translations';
import './Word.scss';
import { Input } from 'components/ui';

interface Props {
  index: number;
  word: string;
  value: string;
  isReadOnly: boolean;
  onChange(index: number, value: string): void;
}

interface State {
  isShowingWord: boolean;
}

export default class MnemonicWord extends React.Component<Props, State> {
  public state = {
    isShowingWord: false
  };

  public render() {
    const { index, word, value, isReadOnly } = this.props;
    const { isShowingWord } = this.state;
    const readOnly = isReadOnly || isShowingWord;

    return (
      <div className="input-group-wrapper MnemonicWord">
        <label className="input-group input-group-inline ENSInput-name">
          <span className="input-group-addon input-group-addon--transparent">{index + 1}.</span>
          <Input
            className={`MnemonicWord-word-input ${!isReadOnly && 'border-rad-right-0'}`}
            value={readOnly ? word : value}
            onChange={this.handleChange}
            readOnly={readOnly}
          />
          {!isReadOnly && (
            <span
              onClick={this.toggleShow}
              aria-label={translateRaw('GEN_Aria_2')}
              role="button"
              className="MnemonicWord-word-toggle input-group-addon"
            >
              <i
                className={classnames(
                  'fa',
                  isShowingWord && 'fa-eye-slash',
                  !isShowingWord && 'fa-eye'
                )}
              />
            </span>
          )}
        </label>
      </div>
    );
  }

  private handleChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.props.onChange(this.props.index, ev.currentTarget.value);
  };

  private toggleShow = () => {
    this.setState({ isShowingWord: !this.state.isShowingWord });
  };
}
