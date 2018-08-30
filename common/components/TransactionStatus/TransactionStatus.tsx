import React from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { NetworkConfig } from 'types/network';
import { TransactionState } from 'types/transactions';
import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { transactionsActions, transactionsSelectors } from 'features/transactions';
import { Spinner } from 'components/ui';
import TransactionDataTable from './TransactionDataTable';
import './TransactionStatus.scss';

interface OwnProps {
  txHash: string;
}

interface StateProps {
  tx: TransactionState | null;
  network: NetworkConfig;
}

interface ActionProps {
  fetchTransactionData: transactionsActions.TFetchTransactionData;
}

type Props = OwnProps & StateProps & ActionProps;

class TransactionStatus extends React.Component<Props> {
  public componentDidMount() {
    this.props.fetchTransactionData(this.props.txHash);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.txHash !== nextProps.txHash) {
      this.props.fetchTransactionData(nextProps.txHash);
    }
  }

  public render() {
    const { tx, network } = this.props;
    let content;

    if (tx && tx.data) {
      content = (
        <React.Fragment>
          <div className="TxStatus-data">
            <TransactionDataTable network={network} data={tx.data} receipt={tx.receipt} />
          </div>
        </React.Fragment>
      );
    } else if (tx && tx.error) {
      content = (
        <div className="TxStatus-error">
          <h2 className="TxStatus-error-title">{translate('TX_NOTFOUND')}</h2>
          <p className="TxStatus-error-desc">{translate('TX_NOTFOUND_1')}</p>
          <ul className="TxStatus-error-list">
            <li>{translate('TX_NOTFOUND_5')}</li>
            <li>{translate('TX_NOTFOUND_2')}</li>
            <li>{translate('TX_NOTFOUND_3')}</li>
            <li>{translate('TX_NOTFOUND_4')}</li>
          </ul>
        </div>
      );
    } else if (tx && tx.isLoading) {
      // tx.isLoading... probably.
      content = (
        <div className="TxStatus-loading">
          <Spinner size="x3" />
        </div>
      );
    }

    return <div className="TxStatus">{content}</div>;
  }
}

function mapStateToProps(state: AppState, ownProps: OwnProps): StateProps {
  const { txHash } = ownProps;

  return {
    tx: transactionsSelectors.getTransactionDatas(state)[txHash],
    network: configSelectors.getNetworkConfig(state)
  };
}

export default connect(mapStateToProps, {
  fetchTransactionData: transactionsActions.fetchTransactionData
})(TransactionStatus);
