import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import translate from 'translations';
import { showNotification, TShowNotification } from 'actions/notifications';
import { verifySignedMessage, ISignedMessage } from 'libs/signing';
import './index.scss';

interface Props {
  showNotification: TShowNotification;
}

interface State {
  signature: string;
  verifiedAddress?: string;
  verifiedMessage?: string;
}

const initialState: State = {
  signature: ''
};

const signaturePlaceholder =
  '{"address":"0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8","message":"asdfasdfasdf","signature":"0x4771d78f13ba8abf608457f12471f427ca8f2fb046c1acb3f5969eefdfe452a10c9154136449f595a654b44b3b0163e86dd099beaca83bfd52d64c21da2221bb1c","version":"2"}';

export class VerifyMessage extends Component<Props, State> {
  public state: State = initialState;

  public render() {
    const { verifiedAddress, verifiedMessage, signature } = this.state;

    const signatureBoxClass = classnames([
      'VerifyMessage-inputBox',
      'form-control',
      signature ? 'is-valid' : 'is-invalid'
    ]);

    return (
      <div>
        <div className="Tab-content-pane">
          <h4>{translate('MSG_signature')}</h4>
          <div className="form-group">
            <textarea
              className={signatureBoxClass}
              placeholder={signaturePlaceholder}
              value={signature}
              onChange={this.handleSignatureChange}
            />
          </div>

          <button
            className="VerifyMessage-sign btn btn-primary btn-lg"
            onClick={this.handleVerifySignedMessage}
            disabled={false}
          >
            {translate('MSG_verify')}
          </button>

          {!!verifiedAddress &&
            !!verifiedMessage && (
              <div className="VerifyMessage-success alert alert-success">
                <strong>{verifiedAddress}</strong> did sign the message{' '}
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

      const { address, message } = parsedSignature;
      this.setState({
        verifiedAddress: address,
        verifiedMessage: message
      });
      this.props.showNotification('success', translate('SUCCESS_7'));
    } catch (err) {
      this.clearVerifiedData();
      this.props.showNotification('danger', translate('ERROR_12'));
    }
  };

  private handleSignatureChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const signature = e.currentTarget.value;
    this.setState({ signature });
  };
}

export default connect(null, {
  showNotification
})(VerifyMessage);
