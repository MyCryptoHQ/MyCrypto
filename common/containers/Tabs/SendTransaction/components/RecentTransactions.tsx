import React from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { NetworkConfig } from 'types/network';
import { IWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { configSelectors } from 'features/config';
import { TransactionStatus } from 'components';
import RecentTransaction from './RecentTransaction';
import './RecentTransactions.scss';

interface OwnProps {
  wallet: IWallet;
}

interface StateProps {
  recentTransactions: AppState['transactions']['recent'];
  network: NetworkConfig;
}

type Props = OwnProps & StateProps;

interface State {
  activeTxHash: string;
}

class RecentTransactions extends React.Component<Props> {
  public state: State = {
    activeTxHash: ''
  };

  public render() {
    const { activeTxHash } = this.state;
    let content: React.ReactElement<string>;
    if (activeTxHash) {
      content = (
        <React.Fragment>
          <TransactionStatus txHash={activeTxHash} />
          <button className="RecentTxs-back btn btn-default" onClick={this.clearActiveTxHash}>
            <i className="fa fa-arrow-left" /> {translate('BACK_TO_RECENT_TXS')}
          </button>
        </React.Fragment>
      );
    } else {
      content = this.renderTxList();
    }

    return <div className="RecentTxs Tab-content-pane">{content}</div>;
  }

  private renderTxList() {
    const { wallet, recentTransactions, network } = this.props;

    let explorer: string;
    if (network.isCustom) {
      explorer = translateRaw('RECENT_TX_NETWORK_EXPLORER', { $network_name: network.name });
    } else {
      explorer = `[${network.blockExplorer.name}](${network.blockExplorer.addressUrl(
        wallet.getAddressString()
      )})`;
    }

    return (
      <React.Fragment>
        {recentTransactions.length ? (
          <table className="RecentTxs-txs">
            <thead>
              <tr>
                <td>{translate('SEND_ADDR')}</td>
                <td>{translate('SEND_AMOUNT_SHORT')}</td>
                <td>{translate('SENT')}</td>
                <td />
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(tx => (
                <RecentTransaction
                  key={tx.time}
                  tx={tx}
                  network={network}
                  onClick={this.setActiveTxHash}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="RecentTxs-empty well">
            <h2 className="RecentTxs-empty-text">
              {translate('NO_RECENT_TX_FOUND', { $explorer: explorer })}
            </h2>
          </div>
        )}
        <p className="RecentTxs-help">
          {translate('RECENT_TX_HELP', { $network: network.name, $explorer: explorer })}
        </p>
      </React.Fragment>
    );
  }

  private setActiveTxHash = (activeTxHash: string) => this.setState({ activeTxHash });
  private clearActiveTxHash = () => this.setState({ activeTxHash: '' });
}

export default connect((state: AppState): StateProps => ({
  recentTransactions: selectors.getRecentWalletTransactions(state),
  network: configSelectors.getNetworkConfig(state)
}))(RecentTransactions);
