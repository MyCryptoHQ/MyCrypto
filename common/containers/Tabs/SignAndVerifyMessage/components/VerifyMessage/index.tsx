import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { verifySignedMessage, ISignedMessage } from 'libs/signing';
import { notificationsActions } from 'features/notifications';
import { TextArea } from 'components/ui';
import './index.scss';

interface Props {
  showNotification: notificationsActions.TShowNotification;
}

interface State {
  signature: string;
  verifiedAddress?: string;
  verifiedMessage?: string;
}

const initialState: State = {
  signature: ''
};

const signatureExample: ISignedMessage = {
  address: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  msg: 'asdfasdfasdf',
  sig: '0x4771d78f13ba...',
  version: '2'
};
const signaturePlaceholder = JSON.stringify(signatureExample, null, 2);

export class VerifyMessage extends Component<Props, State> {
  public state: State = initialState;

  public render() {
    const { verifiedAddress, verifiedMessage, signature } = this.state;

    return (
      <div>
        <div className="Tab-content-pane">
          <div className="input-group-wrapper ">
            <label className="input-group">
              <div className="input-group-header">{translate('MSG_SIGNATURE')}</div>
              <TextArea
                isValid={!!signature}
                className="VerifyMessage-inputBox"
                placeholder={signaturePlaceholder}
                value={signature}
                onChange={this.handleSignatureChange}
                onPaste={this.handleSignaturePaste}
              />
            </label>
          </div>

          <button
            className="VerifyMessage-sign btn btn-primary btn-lg"
            onClick={this.handleVerifySignedMessage}
            disabled={false}
          >
            {translate('MSG_VERIFY')}
          </button>

          {!!verifiedAddress &&
            !!verifiedMessage && (
              <div className="VerifyMessage-success alert alert-success">
                <strong>{verifiedAddress}</strong> {translate('SIGNED')}
                <strong>{verifiedMessage}</strong>.
              </div>
            )}
        </div>
      </div>
    );
  }

  private clearVerifiedData = () =>
    this.setState({
      verifiedAddress: '',
      verifiedMessage: ''
    });

  private handleVerifySignedMessage = () => {
    try {
      const parsedSignature: ISignedMessage = JSON.parse(this.state.signature);

      if (!verifySignedMessage(parsedSignature)) {
        throw Error();
      }

      const { address, msg } = parsedSignature;
      this.setState({
        verifiedAddress: address,
        verifiedMessage: msg
      });
      this.props.showNotification('success', translateRaw('SUCCESS_7'));
    } catch (err) {
      this.clearVerifiedData();
      this.props.showNotification('danger', translateRaw('ERROR_38'));
    }
  };

  private handleSignatureChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const signature = e.currentTarget.value;
    this.setState({ signature });
  };

  private handleSignaturePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('Text');
    if (text) {
      try {
        const signature = JSON.stringify(JSON.parse(text), null, 2);
        this.setState({ signature });
        e.preventDefault();
      } catch (err) {
        // Do nothing, it wasn't json they pasted
      }
    }
  };
}

export default connect(null, {
  showNotification: notificationsActions.showNotification
})(VerifyMessage);
