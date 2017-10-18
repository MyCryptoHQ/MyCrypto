import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import TabSection from 'containers/TabSection';
import { translateRaw } from 'translations';
import { broadcastTx as dBroadcastTx, TBroadcastTx } from 'actions/wallet';
import { QRCode } from 'components/ui';
import './index.scss';
import {
  BroadcastTransactionStatus,
  getTransactionFields
} from 'libs/transaction';
import EthTx from 'ethereumjs-tx';
import { ConfirmationModal } from 'containers/Tabs/SendTransaction/components';

interface Props {
  broadcastTx: TBroadcastTx;
  transactions: BroadcastTransactionStatus[];
}

interface State {
  signedTx: string;
  showConfirmationModal: boolean;
  disabled: boolean;
}

const initialState: State = {
  showConfirmationModal: false,
  signedTx: '',
  disabled: true
};

class BroadcastTx extends Component<Props, State> {
  public state = initialState;

  public ensureValidSignedTxInputOnUpdate() {
    try {
      /* tslint:disable */
      const tx = new EthTx(this.state.signedTx);
      /* tslint:enable */

      const fields = getTransactionFields(tx);
      if (this.state.disabled) {
        this.setState({ disabled: false });
      }
    } catch (e) {
      if (!this.state.disabled) {
        this.setState({ disabled: true });
      }
    }
  }

  public componentDidUpdate() {
    this.ensureValidSignedTxInputOnUpdate();
  }

  public render() {
    const { signedTx, disabled } = this.state;
    return (
      <TabSection>
        <div className="text-center">
          <div className="Tab-content-pane row block">
            <div className="col-md-6">
              <div className="col-md-12 BroadcastTx-title">
                <h2>Broadcast Signed Transaction</h2>
              </div>
              <p>
                Paste a signed transaction and press the "SEND TRANSACTION"
                button.
              </p>
              <label>{translateRaw('SEND_signed')}</label>
              <textarea
                className="form-control"
                rows={7}
                value={signedTx}
                onChange={this.handleChange}
              />
              <button
                className="btn btn-primary"
                disabled={disabled || signedTx === ''}
                onClick={this.handleBroadcastTx}
              >
                {translateRaw('SEND_trans')}
              </button>
            </div>

            <div className="col-md-6" style={{ marginTop: '70px' }}>
              <div
                className="qr-code text-center"
                style={{
                  maxWidth: '15rem',
                  margin: '1rem auto',
                  width: '100%'
                }}
              >
                {this.state.signedTx && <QRCode data={this.state.signedTx} />}
              </div>
            </div>
          </div>
        </div>
        {this.state.showConfirmationModal && (
          <ConfirmationModal
            signedTx={this.state.signedTx}
            onClose={this.handleClose}
            onConfirm={this.handleConfirm}
          />
        )}
      </TabSection>
    );
  }

  public handleClose = () => {
    this.setState({ showConfirmationModal: false });
  };

  public handleBroadcastTx = () => {
    this.setState({ showConfirmationModal: true });
  };

  public handleConfirm = () => {
    this.props.broadcastTx(this.state.signedTx);
  };

  protected handleChange = event => {
    this.setState({ signedTx: event.target.value });
  };
}

function mapStateToProps(state: AppState) {
  return {
    transactions: state.wallet.transactions
  };
}

export default connect(mapStateToProps, { broadcastTx: dBroadcastTx })(
  BroadcastTx
);
