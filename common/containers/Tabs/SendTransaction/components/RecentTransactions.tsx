import React from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import { getRecentWalletTransactions } from 'selectors/transactions';
import { getNetworkConfig } from 'selectors/config';
import { NewTabLink } from 'components/ui';
import RecentTransaction from './RecentTransaction';
import { TransactionStatus } from 'components';
import { IWallet } from 'libs/wallet';
import { NetworkConfig } from 'types/network';
import { AppState } from 'reducers';
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
            <i className="fa fa-arrow-left" /> Back to Recent Transactions
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

    let explorer: React.ReactElement<string>;
    if (network.isCustom) {
      explorer = <span>an explorer for the {network.name} network</span>;
    } else {
      explorer = (
        <NewTabLink href={network.blockExplorer.addressUrl(wallet.getAddressString())}>
          {network.blockExplorer.name}
        </NewTabLink>
      );
    }

    return (
      <React.Fragment>
        {recentTransactions.length ? (
          <table className="RecentTxs-txs">
            <thead>
              <td>{translate('SEND_addr')}</td>
              <td>{translate('SEND_amount_short')}</td>
              <td>{translate('Sent')}</td>
              <td />
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
              No recent MyCrypto transactions found, try checking on {explorer}.
            </h2>
          </div>
        )}
        <p className="RecentTxs-help">
          Only recent transactions sent from this address via MyCrypto on the {network.name} network
          are listed here. If you don't see your transaction, you can view all of them on {explorer}.
        </p>
      </React.Fragment>
    );
  }

  private setActiveTxHash = (activeTxHash: string) => this.setState({ activeTxHash });
  private clearActiveTxHash = () => this.setState({ activeTxHash: '' });
}

export default connect((state: AppState): StateProps => ({
  recentTransactions: getRecentWalletTransactions(state),
  network: getNetworkConfig(state)
}))(RecentTransactions);
