import React, { Component } from 'react';
import { connect } from 'react-redux';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import translate from 'translations';
import { showNotification, TShowNotification } from 'actions/notifications';
import { resetWallet, TResetWallet } from 'actions/wallet';
import { ISignedMessage } from 'libs/signing';
import { IFullWallet } from 'libs/wallet';
import { AppState } from 'reducers';
import SignButton from './SignButton';
import { isWalletFullyUnlocked } from 'selectors/wallet';
import './index.scss';
import { TextArea } from 'components/ui';

interface Props {
  wallet: IFullWallet;
  unlocked: boolean;
  showNotification: TShowNotification;
  resetWallet: TResetWallet;
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

  public componentWillUnmount() {
    this.props.resetWallet();
  }

  public render() {
    const { wallet, unlocked } = this.props;
    const { message, signedMessage } = this.state;

    return (
      <div>
        {unlocked ? (
          <div className="Tab-content-pane">
            <button
              className="SignMessage-reset btn btn-default btn-sm"
              onClick={this.changeWallet}
            >
              <i className="fa fa-refresh" />
              {translate('Change Wallet')}
            </button>

            <div className="input-group-wrapper Deploy-field">
              <label className="input-group">
                <div className="input-group-header">{translate('MSG_message')}</div>
                <TextArea
                  className={`SignMessage-inputBox ${message ? 'is-valid' : 'is-invalid'}`}
                  placeholder={messagePlaceholder}
                  value={message}
                  onChange={this.handleMessageChange}
                />
              </label>
              <div className="SignMessage-help">{translate('MSG_info2')}</div>
            </div>

            <SignButton
              wallet={wallet}
              message={this.state.message}
              showNotification={this.props.showNotification}
              onSignMessage={this.onSignMessage}
            />

            {!!signedMessage && (
              <div className="input-group-wrapper SignMessage-inputBox">
                <label className="input-group">
                  <div className="input-group-header">{translate('MSG_signature')}</div>
                  <TextArea
                    className="SignMessage-inputBox"
                    value={JSON.stringify(signedMessage, null, 2)}
                    disabled={true}
                    onChange={this.handleMessageChange}
                  />
                </label>
              </div>
            )}
          </div>
        ) : (
          <WalletDecrypt hidden={unlocked} disabledWallets={DISABLE_WALLETS.UNABLE_TO_SIGN} />
        )}
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

  private changeWallet = () => {
    this.props.resetWallet();
  };
}

const mapStateToProps = (state: AppState) => ({
  wallet: state.wallet.inst,
  unlocked: isWalletFullyUnlocked(state)
});

export default connect(mapStateToProps, {
  showNotification,
  resetWallet
})(SignMessage);
