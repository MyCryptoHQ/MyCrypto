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

import NavigationPrompt from './components/NavigationPrompt';
// LIBS

import React from 'react';
// REDUX
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { showNotification } from 'actions/notifications';
import { resetWallet } from 'actions/wallet';
// SELECTORS
import { getNetworkConfig, getNodeLib } from 'selectors/config';

// UTILS
//import { formatGasLimit } from 'utils/formatters';

import { initialState, Props, State } from './typings';

export class SendTransaction extends React.Component<Props, State> {
  public state: State = initialState;

  public handleWalletStateOnUpdate(prevProps) {
    if (this.props.wallet !== prevProps.wallet && !!prevProps.wallet) {
      this.setState(initialState);
    }
  }

  public componentDidUpdate(prevProps: Props) {
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

  public openTxModal = () => this.setState({ showTxConfirm: true });

  public hideConfirmTx = () => this.setState({ showTxConfirm: false });

  public confirmTx = (signedTx: string) => this.props.broadcastTx(signedTx);
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst,
    nodeLib: getNodeLib(state),
    network: getNetworkConfig(state)
  };
}

export default connect(mapStateToProps, {
  showNotification,
  resetWallet
})(SendTransaction);
