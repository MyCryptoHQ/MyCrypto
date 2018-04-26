import React, { Component } from 'react';
import { connect } from 'react-redux';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import translate, { translateRaw } from 'translations';
import { signMessageRequested, TSignMessageRequested } from 'actions/message';
import { resetWallet, TResetWallet } from 'actions/wallet';
import { ISignedMessage } from 'libs/signing';
import { IFullWallet } from 'libs/wallet';
import { AppState } from 'reducers';
import SignButton from './SignButton';
import { isWalletFullyUnlocked } from 'selectors/wallet';
import './index.scss';
import { TextArea, CodeBlock } from 'components/ui';

interface Props {
  wallet: IFullWallet;
  unlocked: boolean;
  signMessageRequested: TSignMessageRequested;
  signedMessage: ISignedMessage | null;
  resetWallet: TResetWallet;
}

interface State {
  message: string;
}

const initialState: State = {
  message: ''
};

const messagePlaceholder = translateRaw('SIGN_MSG_PLACEHOLDER');

export class SignMessage extends Component<Props, State> {
  public state: State = initialState;

  public componentWillUnmount() {
    this.props.resetWallet();
  }

  public render() {
    const { unlocked, signedMessage } = this.props;
    const { message } = this.state;

    return (
      <div>
        {unlocked ? (
          <div className="Tab-content-pane">
            <button
              className="SignMessage-reset btn btn-default btn-sm"
              onClick={this.changeWallet}
            >
              <i className="fa fa-refresh" />
              {translate('CHANGE_WALLET')}
            </button>

            <div className="input-group-wrapper Deploy-field">
              <label className="input-group">
                <div className="input-group-header">{translate('MSG_MESSAGE')}</div>
                <TextArea
                  className={`SignMessage-inputBox ${message ? 'is-valid' : 'is-invalid'}`}
                  placeholder={messagePlaceholder}
                  value={message}
                  onChange={this.handleMessageChange}
                />
              </label>
              <div className="SignMessage-help">{translate('MSG_INFO2')}</div>
            </div>

            <SignButton
              message={this.state.message}
              signMessageRequested={this.props.signMessageRequested}
            />

            {signedMessage && (
              <div className="input-group-wrapper SignMessage-inputBox">
                <label className="input-group">
                  <div className="input-group-header">{translate('MSG_SIGNATURE')}</div>
                  <CodeBlock className="SignMessage-inputBox">
                    {JSON.stringify(signedMessage, null, 2)}
                  </CodeBlock>
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

  private changeWallet = () => {
    this.props.resetWallet();
  };
}

const mapStateToProps = (state: AppState) => ({
  signedMessage: state.message.signed,
  unlocked: isWalletFullyUnlocked(state)
});

export default connect(mapStateToProps, {
  signMessageRequested,
  resetWallet
})(SignMessage);
