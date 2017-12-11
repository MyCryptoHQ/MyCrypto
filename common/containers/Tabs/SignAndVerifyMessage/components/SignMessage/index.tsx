import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import WalletDecrypt from 'components/WalletDecrypt';
import translate from 'translations';
import { showNotification, TShowNotification } from 'actions/notifications';
import { ISignedMessage } from 'libs/signing';
import { IFullWallet } from 'libs/wallet';
import { AppState } from 'reducers';
import SignButton from './SignButton';
import { isWalletFullyUnlocked } from 'selectors/wallet';
import './index.scss';

interface Props {
  showNotification: TShowNotification;
  wallet: IFullWallet;
  unlocked: boolean;
}

interface State {
  message: string;
  signedMessage: ISignedMessage | null;
}

const initialState: State = {
  message: '',
  signedMessage: null
};

const messagePlaceholder =
  'This is a sweet message that you are signing to prove that you own the address you say you own.';

export class SignMessage extends Component<Props, State> {
  public state: State = initialState;

  public render() {
    const { wallet, unlocked } = this.props;
    const { message, signedMessage } = this.state;
    const messageBoxClass = classnames([
      'SignMessage-inputBox',
      'form-control',
      message ? 'is-valid' : 'is-invalid'
    ]);

    return (
      <div>
        <div className="Tab-content-pane">
          <h4>{translate('MSG_message')}</h4>
          <div className="form-group">
            <textarea
              className={messageBoxClass}
              placeholder={messagePlaceholder}
              value={message}
              onChange={this.handleMessageChange}
            />
            <div className="SignMessage-help">{translate('MSG_info2')}</div>
          </div>

          {unlocked && (
            <SignButton
              wallet={wallet}
              message={this.state.message}
              showNotification={this.props.showNotification}
              onSignMessage={this.onSignMessage}
            />
          )}
          <WalletDecrypt hidden={unlocked} />

          {!!signedMessage && (
            <div>
              <h4>{translate('MSG_signature')}</h4>
              <div className="form-group">
                <textarea
                  className="SignMessage-inputBox form-control"
                  value={JSON.stringify(signedMessage, null, 2)}
                  disabled={true}
                  onChange={this.handleMessageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  private handleMessageChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const message = e.currentTarget.value;
    this.setState({ message });
  };

  private onSignMessage = (signedMessage: ISignedMessage) => {
    this.setState({ signedMessage });
  };
}

const mapStateToProps = (state: AppState) => ({
  wallet: state.wallet.inst,
  unlocked: isWalletFullyUnlocked(state)
});

export default connect(mapStateToProps, { showNotification })(SignMessage);
