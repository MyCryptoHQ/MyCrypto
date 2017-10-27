import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { IWallet } from 'libs/wallet/IWallet';
import WalletDecrypt from 'components/WalletDecrypt';
import translate from 'translations';
import { showNotification, TShowNotification } from 'actions/notifications';
import { ISignedMessage } from 'libs/signing';
import { AppState } from 'reducers';
import './index.scss';

export interface Props {
  wallet: IWallet;
  showNotification: TShowNotification;
}

export interface State {
  message: string;
  signMessageError: string;
  signedMessage: ISignedMessage | null;
}

export const initialState: State = {
  message: '',
  signMessageError: '',
  signedMessage: null
};

const messagePlaceholder =
  'This is a sweet message that you are signing to prove that you own the address you say you own.';

export class SignMessage extends Component<Props, State> {
  public state: State = initialState;

  public render() {
    const { wallet } = this.props;
    const { message } = this.state;

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
              value={this.state.message}
              onChange={this.handleMessageChange}
            />
            <div className="SignMessage-help">{translate('MSG_info2')}</div>
          </div>

          {!!this.props.wallet && (
            <button
              className="SignMessage-sign btn btn-primary btn-lg"
              onClick={this.handleSignMessage}
              disabled={false}
            >
              {translate('NAV_SignMsg')}
            </button>
          )}

          {!!this.state.signedMessage && (
            <div>
              <h4>{translate('MSG_signature')}</h4>
              <div className="form-group">
                <textarea
                  className="SignMessage-inputBox form-control"
                  value={JSON.stringify(this.state.signedMessage, null, 2)}
                  disabled={true}
                  onChange={this.handleMessageChange}
                />
              </div>
            </div>
          )}
        </div>

        {!wallet && <WalletDecrypt />}
      </div>
    );
  }

  private handleSignMessage = async () => {
    const { wallet } = this.props;
    const { message } = this.state;

    if (!wallet) {
      return;
    }

    try {
      const signedMessage: ISignedMessage = {
        address: await wallet.getAddress(),
        message,
        signature: await wallet.signMessage(message),
        version: '2'
      };

      this.setState({ signedMessage });
      this.props.showNotification(
        'success',
        `Successfully signed message with address ${signedMessage.address}.`
      );
    } catch (err) {
      console.error(err);
      this.props.showNotification(
        'danger',
        `Error signing message: ${err.message}`
      );
    }
  };

  private handleMessageChange = (
    e: React.SyntheticEvent<HTMLTextAreaElement>
  ) => {
    const message = (e.target as HTMLInputElement).value;
    this.setState({ message });
  };
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst
  };
}

export default connect(mapStateToProps, {
  showNotification
})(SignMessage);
