// COMPONENTS
import Spinner from 'components/ui/Spinner';
import TabSection from 'containers/TabSection';
import {
  Fields,
  ConfirmationModal,
  UnavailableWallets,
  SideBar,
  OfflineAwareUnlockHeader
} from './components';

import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';
import NavigationPrompt from './components/NavigationPrompt';
// LIBS

import React from 'react';
// REDUX
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { showNotification } from 'actions/notifications';
import { broadcastTx, resetWallet } from 'actions/wallet';
// SELECTORS
import { getNetworkConfig, getNodeLib } from 'selectors/config';
import { getTxFromBroadcastTransactionStatus } from 'selectors/wallet';
// UTILS
//import { formatGasLimit } from 'utils/formatters';

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

    return (
      <TabSection>
        <section className="Tab-content">
          <OfflineAwareUnlockHeader />
          <NavigationPrompt
            when={unlocked}
            onConfirm={this.props.resetWallet}
          />
          <div className="row">
            {/* Send Form */}
            <Fields />
            <UnavailableWallets />
            <SideBar />
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
    transactions: state.wallet.transactions
  };
}

export default connect(mapStateToProps, {
  showNotification,
  broadcastTx,
  resetWallet
})(SendTransaction);
