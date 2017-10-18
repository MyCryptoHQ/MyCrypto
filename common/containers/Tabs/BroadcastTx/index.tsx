import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import TabSection from 'containers/TabSection';
import { translateRaw } from 'translations';
import { broadcastTx as dBroadcastTx, TBroadcastTx } from 'actions/wallet';
import { QRCode } from 'components/ui';
import './index.scss';
import { BroadcastTransactionStatus } from 'libs/transaction';

interface Props {
  broadcastTx: TBroadcastTx;
  transactions: BroadcastTransactionStatus[];
}

interface State {
  signedTx: string;
  broadcastingTx: boolean;
}

const initialState: State = {
  broadcastingTx: false,
  signedTx: ''
};

class BroadcastTx extends Component<Props, State> {
  public state = initialState;

  public render() {
    const { signedTx, broadcastingTx } = this.state;
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
                disabled={!signedTx}
                onClick={this.handleBroadcastTx || broadcastingTx}
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
      </TabSection>
    );
  }

  public handleBroadcastTx = () => {
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
