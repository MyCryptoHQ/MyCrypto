import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabSection from 'containers/TabSection';
import { translateRaw } from 'translations';
import {
  signLocalTransactionSucceeded,
  TSignLocalTransactionSucceeded,
  signTransactionFailed,
  TSignTransactionFailed
} from 'actions/transaction';
import { computeIndexingHash } from 'libs/transaction';
import { QRCode } from 'components/ui';
import EthTx from 'ethereumjs-tx';
import classnames from 'classnames';
import { SendButton } from 'components/SendButton';
import { toBuffer, bufferToHex } from 'ethereumjs-util';
import { getSerializedTransaction } from 'selectors/transaction';
import { AppState } from 'reducers';
import './index.scss';

interface StateProps {
  stateTransaction: AppState['transaction']['sign']['local']['signedTransaction'];
}
interface DispatchProps {
  signLocalTransactionSucceeded: TSignLocalTransactionSucceeded;
  signTransactionFailed: TSignTransactionFailed;
}
interface State {
  userInput: string;
}
const INITIAL_STATE: State = { userInput: '' };

class BroadcastTx extends Component<DispatchProps & StateProps> {
  public state: State = INITIAL_STATE;

  public render() {
    const { userInput } = this.state;
    const { stateTransaction } = this.props;
    const inputClasses = classnames({
      'form-control': true,
      'is-valid': !!stateTransaction,
      'is-invalid': !stateTransaction
    });

    return (
      <TabSection isUnavailableOffline={true}>
        <div className="Tab-content-pane row block text-center">
          <div className="BroadcastTx">
            <h1 className="BroadcastTx-title">Broadcast Signed Transaction</h1>
            <p className="BroadcastTx-help">
              Paste a signed transaction and press the "SEND TRANSACTION" button.
            </p>
            <label>{translateRaw('SEND_signed')}</label>
            <textarea
              className={inputClasses}
              rows={7}
              value={userInput}
              onChange={this.handleChange}
            />
            <SendButton onlyTransactionParameters={true} />

            <div className="BroadcastTx-qr">
              {stateTransaction && <QRCode data={bufferToHex(stateTransaction)} />}
            </div>
          </div>
        </div>
      </TabSection>
    );
  }

  protected handleChange = ({ currentTarget }: React.FormEvent<HTMLTextAreaElement>) => {
    const { value } = currentTarget;
    this.setState({ userInput: value });
    try {
      const bufferTransaction = toBuffer(value);
      const tx = new EthTx(bufferTransaction);
      if (!tx.verifySignature()) {
        throw Error();
      }
      const indexingHash = computeIndexingHash(bufferTransaction);
      this.props.signLocalTransactionSucceeded({
        signedTransaction: bufferTransaction,
        indexingHash,
        noVerify: true
      });
    } catch {
      this.props.signTransactionFailed();
    }
  };
}

export default connect(
  (state: AppState) => ({ stateTransaction: getSerializedTransaction(state) }),
  { signLocalTransactionSucceeded, signTransactionFailed }
)(BroadcastTx);
