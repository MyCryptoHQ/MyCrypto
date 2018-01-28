import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabSection from 'containers/TabSection';
import {
  signLocalTransactionSucceeded,
  TSignLocalTransactionSucceeded,
  signTransactionFailed,
  TSignTransactionFailed
} from 'actions/transaction';
import { computeIndexingHash } from 'libs/transaction';
import translate from 'translations';
import SimpleButton from 'components/ui/SimpleButton';
import EthTx from 'ethereumjs-tx';
import classnames from 'classnames';
import { toBuffer } from 'ethereumjs-util';
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

class TransactionStatus extends Component<DispatchProps & StateProps> {
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
          <div className="TransactionStatus">
            <h1 className="TransactionStatus-title">Check TX Status</h1>
            <p className="TransactionStatus-help">
              During times of high volume (like during ICOs) transactions can be pending for hours,
              if not days. This tool aims to give you the ability to find and "cancel" / replace
              these TXs.
              <strong>
                This is not typically something you can do. It should not be relied upon &amp; will
                only work when the TX Pools are full.
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://myetherwallet.github.io/knowledge-base/transactions/check-status-of-ethereum-transaction.html"
                >
                  Please, read about this tool here.
                </a>
              </strong>
            </p>
            <input
              className={inputClasses}
              value={userInput}
              placeholder="0x3f0efedfe0a0cd611f2465fac9a3699f92d6a06613bc3ead4f786856f5c73e9c"
            />
            <SimpleButton text={translate('NAV_CheckTxStatus')} type="primary" />
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
)(TransactionStatus);
