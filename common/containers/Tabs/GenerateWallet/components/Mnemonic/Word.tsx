import React from 'react';
import classnames from 'classnames';
import { translateRaw } from 'translations';
import './Word.scss';

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
      <div className="MnemonicWord">
        <span className="MnemonicWord-number">{index + 1}.</span>
        <div className="MnemonicWord-word input-group">
          <input
            className={classnames(
              'MnemonicWord-word-input',
              'form-control',
              word === value && 'is-valid'
            )}
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
        </div>
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
