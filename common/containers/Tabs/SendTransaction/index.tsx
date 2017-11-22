// COMPONENTS
import Spinner from 'components/ui/Spinner';
import TabSection from 'containers/TabSection';
import { BalanceSidebar } from 'components';
import { UnlockHeader } from 'components/ui';
import { Fields, ConfirmationModal, CustomMessage } from './components';

import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';
import NavigationPrompt from './components/NavigationPrompt';
// LIBS

// LIBS
import { Web3Wallet } from 'libs/wallet';

import React from 'react';
// REDUX
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { showNotification } from 'actions/notifications';
import { broadcastTx, resetWallet } from 'actions/wallet';
import { pollOfflineStatus as dPollOfflineStatus } from 'actions/config';
// SELECTORS
import { getNetworkConfig, getNodeLib } from 'selectors/config';
import { getTxFromBroadcastTransactionStatus } from 'selectors/wallet';
import translate from 'translations';
// UTILS
//import { formatGasLimit } from 'utils/formatters';

// MISC
//import customMessages from './messages';

import { initialState, Props, State } from './typings';

export class SendTransaction extends React.Component<Props, State> {
  public state: State = initialState;

  public handleBroadcastTransactionOnUpdate() {
    // handle clearing the form once broadcast transaction promise resolves and compontent updates
    const componentStateTransaction = this.state.transaction;
    if (componentStateTransaction) {
      // lives in redux state
      const currentTxAsSignedTransaction = getTxFromBroadcastTransactionStatus(
        this.props.transactions,
        componentStateTransaction.signedTx
      );
      // if there is a matching tx in redux state
      if (currentTxAsSignedTransaction) {
        // if the broad-casted transaction attempt is successful, clear the form
        if (currentTxAsSignedTransaction.successfullyBroadcast) {
          //this.resetTx();
        }
      }
    }
  }

  public handleWalletStateOnUpdate(prevProps) {
    if (this.props.wallet !== prevProps.wallet && !!prevProps.wallet) {
      this.setState(initialState);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    this.handleBroadcastTransactionOnUpdate();

    this.handleWalletStateOnUpdate(prevProps);
  }

  public render() {
    const unlocked = !!this.props.wallet;
    const { showTxConfirm, transaction } = this.state;
    const { offline, forceOffline } = this.props;
    //   const customMessage = customMessages.find(m => m.to === to);

    const isWeb3Wallet = this.props.wallet instanceof Web3Wallet;
    return (
      <TabSection>
        <section className="Tab-content">
          <UnlockHeader
            title={
              <div>
                {translate('NAV_SendEther')}
                {offline || forceOffline ? (
                  <span style={{ color: 'red' }}> (Offline)</span>
                ) : null}
              </div>
            }
          />
          <NavigationPrompt
            when={unlocked}
            onConfirm={this.props.resetWallet}
          />
          <div className="row">
            {/* Send Form */}
            {unlocked &&
              !(offline || (forceOffline && isWeb3Wallet)) && (
                <main className="col-sm-8">
                  <div className="Tab-content-pane">
                    {' '}
                    <Fields />
                  </div>
                </main>
              )}

            {unlocked &&
              (offline || (forceOffline && isWeb3Wallet)) && (
                <main className="col-sm-8">
                  <div className="Tab-content-pane">
                    <h4>Sorry...</h4>
                    <p>
                      MetaMask / Mist wallets are not available in offline mode.
                    </p>
                  </div>
                </main>
              )}

            {/* Sidebar */}
            {unlocked && (
              <section className="col-sm-4">
                <BalanceSidebar />
              </section>
            )}
          </div>
          {transaction &&
            showTxConfirm && (
              <ConfirmationModal
                decimal={decimal}
                fromAddress={this.state.walletAddress}
                signedTx={transaction.signedTx}
                onClose={this.hideConfirmTx}
                onConfirm={this.confirmTx}
              />
            )}
        </section>
      </TabSection>
    );
  }

  public resetJustTx = async (): Promise<any> =>
    new Promise(resolve =>
      this.setState(
        {
          transaction: null
        },
        resolve
      )
    );

  /*
  public generateWeb3TxFromState = async () => {
    await this.resetJustTx();
    const { nodeLib, wallet, gasPrice, network } = this.props;

    const { token, unit, value, to, data, gasLimit } = this.state;
    const chainId = network.chainId;
    const transactionInput = {
      token,
      unit,
      value,
      to,
      data
    };
    const bigGasLimit = Wei(gasLimit);

    if (!(wallet instanceof Web3Wallet)) {
      return;
    }

    try {
      const txHash = await confirmAndSendWeb3Transaction(
        wallet,
        nodeLib,
        gasPrice,
        bigGasLimit,
        chainId,
        transactionInput
      );

      if (network.blockExplorer !== undefined) {
        this.props.showNotification(
          'success',
          <TransactionSucceeded
            txHash={txHash}
            blockExplorer={network.blockExplorer}
          />,
          0
        );
      }
    } catch (err) {
      //show an error
      this.props.showNotification('danger', err.message, 5000);
    }
  };
*/

  public openTxModal = () => this.setState({ showTxConfirm: true });

  public hideConfirmTx = () => this.setState({ showTxConfirm: false });

  public confirmTx = (signedTx: string) => this.props.broadcastTx(signedTx);
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst,

    nodeLib: getNodeLib(state),
    network: getNetworkConfig(state),

    transactions: state.wallet.transactions,
    offline: state.config.offline,
    forceOffline: state.config.forceOffline
  };
}

export default connect(mapStateToProps, {
  showNotification,
  broadcastTx,
  resetWallet,
  pollOfflineStatus: dPollOfflineStatus
})(SendTransaction);
