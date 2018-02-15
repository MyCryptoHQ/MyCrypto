import React from 'react';
import translate from 'translations';
import { isValidTxHash, isValidETHAddress } from 'libs/validators';
import './TxHashInput.scss';

interface Props {
  hash?: string;
  onSubmit(hash: string): void;
}

interface State {
  hash: string;
}

export default class TxHashInput extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { hash: props.hash || '' };
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.hash !== nextProps.hash && nextProps.hash) {
      this.setState({ hash: nextProps.hash });
    }
  }

  public render() {
    const { hash } = this.state;
    const validClass = hash ? (isValidTxHash(hash) ? 'is-valid' : 'is-invalid') : '';

    return (
      <form className="TxHashInput" onSubmit={this.handleSubmit}>
        <input
          value={hash}
          placeholder="0x16e521..."
          className={`TxHashInput-field form-control ${validClass}`}
          onChange={this.handleChange}
        />

        {isValidETHAddress(hash) && (
          <p className="TxHashInput-message help-block is-invalid">
            You cannot use an address, you must use a transaction hash
          </p>
        )}

        <button className="TxHashInput-submit btn btn-primary btn-block">
          {translate('NAV_CheckTxStatus')}
        </button>
      </form>
    );
  }

  private handleChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({ hash: ev.currentTarget.value });
  };

  private handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (isValidTxHash(this.state.hash)) {
      this.props.onSubmit(this.state.hash);
    }
  };
}
