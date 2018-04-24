import React from 'react';
import translate from 'translations';
import { TSignMessageRequested } from 'actions/message';

interface Props {
  message: string;
  signMessageRequested: TSignMessageRequested;
}

export default class SignMessageButton extends React.Component<Props, {}> {
  public render() {
    return (
      <button className="SignMessage-sign btn btn-primary btn-lg" onClick={this.handleSignMessage}>
        {translate('NAV_SIGNMSG')}
      </button>
    );
  }

  private handleSignMessage = () => {
    const { signMessageRequested, message } = this.props;

    signMessageRequested(message);
  };
}
