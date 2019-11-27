import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import moment from 'moment';

import translate from 'translations';
import { isValidTxHash } from 'libs/validators';
import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { Input } from 'components/ui';
import './TxHashInput.scss';

interface OwnProps {
  hash?: string;
  onSubmit(hash: string): void;
}

interface ReduxProps {
  recentTxs: any[];
  isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn>;
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

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.hash !== nextProps.hash && nextProps.hash) {
      this.setState({ hash: nextProps.hash });
    }
  }

  public render() {
    const { recentTxs, isValidAddress } = this.props;
    const { hash } = this.state;

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
              placeholder={translate('SELECT_RECENT_TX')}
              searchable={false}
            />
            <em className="TxHashInput-recent-separator">{translate('OR')}</em>
          </div>
        )}

        <Input
          value={hash}
          isValid={hash ? isValidTxHash(hash) : true}
          placeholder="0x16e521..."
          className="TxHashInput-field"
          onChange={this.handleChange}
        />

        {isValidAddress(hash) && (
          <p className="TxHashInput-message help-block is-invalid">
            {translate('SELECT_RECENT_TX_BY_TXHASH')}
          </p>
        )}

        <button
          className="TxHashInput-submit btn btn-primary btn-block"
          disabled={!isValidTxHash(hash)}
        >
          {translate('NAV_CHECKTXSTATUS')}
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

export default connect(
  (state: AppState): ReduxProps => ({
    recentTxs: [],
    isValidAddress: configSelectors.getIsValidAddressFn(state)
  })
)(TxHashInput);
