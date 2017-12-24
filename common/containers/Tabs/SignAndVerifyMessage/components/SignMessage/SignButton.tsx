import React from 'react';
import translate from 'translations';
import { ISignedMessage } from 'libs/signing';
import { IFullWallet } from 'libs/wallet';
import { TShowNotification } from 'actions/notifications';

interface Props {
  wallet: IFullWallet;
  message: string;
  showNotification: TShowNotification;
  onSignMessage(msg: ISignedMessage): any;
}

export default class SignMessageButton extends React.Component<Props, {}> {
  public render() {
    return (
      <button className="SignMessage-sign btn btn-primary btn-lg" onClick={this.handleSignMessage}>
        {translate('NAV_SignMsg')}
      </button>
    );
  }

  private handleSignMessage = async () => {
    const { wallet, message, showNotification, onSignMessage } = this.props;

    try {
      const signedMessage: ISignedMessage = {
        address: await wallet.getAddressString(),
        message,
        signature: await wallet.signMessage(message),
        version: '2'
      };

      onSignMessage(signedMessage);
      showNotification(
        'success',
        `Successfully signed message with address ${signedMessage.address}.`
      );
    } catch (err) {
      showNotification('danger', `Error signing message: ${err.message}`);
    }
  };
}
