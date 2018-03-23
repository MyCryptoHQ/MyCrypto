import React, { Component } from 'react';
import { connect } from 'react-redux';
import TabSection from 'containers/TabSection';
import translate from 'translations';
import {
  signLocalTransactionSucceeded,
  TSignLocalTransactionSucceeded,
  signTransactionFailed,
  TSignTransactionFailed
} from 'actions/transaction';
import { computeIndexingHash } from 'libs/transaction';
import { QRCode, TextArea } from 'components/ui';
import EthTx from 'ethereumjs-tx';
import { SendButton } from 'components/SendButton';
import { toBuffer, bufferToHex } from 'ethereumjs-util';
import { getSerializedTransaction } from 'selectors/transaction';
import { AppState } from 'reducers';
import './index.scss';
import { Switch, Route, RouteComponentProps } from 'react-router';
import { RouteNotFound } from 'components/RouteNotFound';

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

type Props = DispatchProps & StateProps & RouteComponentProps<{}>;

class BroadcastTx extends Component<Props> {
  public state: State = INITIAL_STATE;

  public render() {
    const { userInput } = this.state;
    const { stateTransaction } = this.props;
    const currentPath = this.props.match.url;
    return (
      <TabSection isUnavailableOffline={true}>
        <div className="Tab-content-pane row block text-center">
          <Switch>
            <Route
              exact={true}
              path={currentPath}
              render={() => (
                <div className="BroadcastTx">
                  <h1 className="BroadcastTx-title">{translate('BROADCAST_TX_TITLE')}</h1>
                  <p className="BroadcastTx-help">{translate('BROADCAST_TX_DESCRIPTION')}</p>

                  <div className="input-group-wrapper InteractForm-interface">
                    <label className="input-group">
                      <div className="input-group-header">{translate('SEND_SIGNED')}</div>
                      <TextArea
                        className={stateTransaction ? '' : 'invalid'}
                        rows={7}
                        value={userInput}
                        onChange={this.handleChange}
                      />
                    </label>
                  </div>

                  <SendButton toggleDisabled={true} onlyTransactionParameters={true} />

                  <div className="BroadcastTx-qr">
                    {stateTransaction && <QRCode data={bufferToHex(stateTransaction)} />}
                  </div>
                </div>
              )}
            />
            <RouteNotFound />
          </Switch>
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
