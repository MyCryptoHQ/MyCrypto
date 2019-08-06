import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { toBuffer, bufferToHex } from 'ethereumjs-util';
import EthTx from 'ethereumjs-tx';

import translate, { translateRaw } from 'translations';
import { computeIndexingHash, getTransactionFields, makeTransaction } from 'libs/transaction';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { transactionSignActions } from 'features/transaction';
import { QRCode, Input, CodeBlock } from 'components/ui';
import { SendButton } from 'components/SendButton';
import './index.scss';

import { ExtendedContentPanel } from 'v2/components';

interface StateProps {
  stateTransaction: AppState['transaction']['sign']['local']['signedTransaction'];
}
interface DispatchProps {
  signLocalTransactionSucceeded: transactionSignActions.TSignLocalTransactionSucceeded;
  signTransactionFailed: transactionSignActions.TSignTransactionFailed;
}
interface State {
  userInput: string;
}
const INITIAL_STATE: State = { userInput: '' };

type Props = DispatchProps & StateProps & RouteComponentProps<{}>;

const getStringifiedTx = (serializedTx: Buffer) =>
  JSON.stringify(getTransactionFields(makeTransaction(serializedTx)), null, 2);

class BroadcastTx extends Component<Props> {
  public state: State = INITIAL_STATE;

  public render() {
    const { userInput } = this.state;
    const { stateTransaction } = this.props;

    return (
      <ExtendedContentPanel
        heading={translateRaw('BROADCAST_TX_TITLE')}
        description={translate('BROADCAST_TX_DESCRIPTION')}
        centered={true}
      >
        <div className="BroadcastTx">
          <div className="input-group-wrapper InteractForm-interface">
            <label className="input-group">
              <div className="input-group-header">{translate('SEND_SIGNED')}</div>
              <Input
                type="text"
                placeholder="0xf86b0284ee6b2800825208944bbeeb066ed09b7aed07bf39eee0460dfa26152088016345785d8a00008029a03ba7a0cc6d1756cd771f2119cf688b6d4dc9d37096089f0331fe0de0d1cc1254a02f7bcd19854c8d46f8de09e457aec25b127ab4328e1c0d24bfbff8702ee1f474"
                isValid={!!stateTransaction}
                value={userInput}
                onChange={this.handleChange}
              />
            </label>
          </div>

          {stateTransaction && (
            <React.Fragment>
              <label>{translate('SEND_RAW')}</label>
              <CodeBlock>{getStringifiedTx(stateTransaction)}</CodeBlock>
            </React.Fragment>
          )}

          <SendButton className="form-group" />

          <div className="BroadcastTx-qr">
            {stateTransaction && <QRCode data={bufferToHex(stateTransaction)} />}
          </div>
        </div>
      </ExtendedContentPanel>
    );
  }

  protected handleChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
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
  (state: AppState) => ({ stateTransaction: selectors.getSerializedTransaction(state) }),
  {
    signLocalTransactionSucceeded: transactionSignActions.signLocalTransactionSucceeded,
    signTransactionFailed: transactionSignActions.signTransactionFailed
  }
)(BroadcastTx);
