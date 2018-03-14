import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import moment from 'moment';
import translate from 'translations';
import { isValidTxHash, isValidETHAddress } from 'libs/validators';
import { getRecentNetworkTransactions } from 'selectors/transactions';
import { AppState } from 'reducers';
import { Input } from 'components/ui';
import './TxHashInput.scss';

interface OwnProps {
  hash?: string;
  onSubmit(hash: string): void;
}
interface ReduxProps {
  recentTxs: AppState['transactions']['recent'];
}
type Props = OwnProps & ReduxProps;

interface State {
  hash: string;
}

interface Option {
  label: string;
  value: string;
}

class TxHashInput extends React.Component<Props, State> {
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
    const { recentTxs } = this.props;
    const { hash } = this.state;
    const validClass = hash ? (isValidTxHash(hash) ? 'is-valid' : 'is-invalid') : '';
    let selectOptions: Option[] = [];

    if (recentTxs && recentTxs.length) {
      selectOptions = recentTxs.map(tx => ({
        label: `
          ${moment(tx.time).format('lll')}
          -
          ${tx.from.substr(0, 8)}...
          to
          ${tx.to.substr(0, 8)}...
        `,
        value: tx.hash
      }));
    }

    return (
      <form className="TxHashInput" onSubmit={this.handleSubmit}>
        {!!selectOptions.length && (
          <div className="TxHashInput-recent">
            <Select
              value={hash}
              onChange={this.handleSelectTx}
              options={selectOptions}
              placeholder="Select a recent transaction..."
              searchable={false}
            />
            <em className="TxHashInput-recent-separator">or</em>
          </div>
        )}

        <Input
          value={hash}
          placeholder="0x16e521..."
          className={`TxHashInput-field ${validClass}`}
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

  private handleSelectTx = (option: Option) => {
    if (option && option.value) {
      this.setState({ hash: option.value });
      this.props.onSubmit(option.value);
    } else {
      this.setState({ hash: '' });
    }
  };

  private handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (isValidTxHash(this.state.hash)) {
      this.props.onSubmit(this.state.hash);
    }
  };
}

export default connect((state: AppState): ReduxProps => ({
  recentTxs: getRecentNetworkTransactions(state)
}))(TxHashInput);
