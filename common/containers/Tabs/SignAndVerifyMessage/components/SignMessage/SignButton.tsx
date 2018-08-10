import React from 'react';

import translate from 'translations';
import { messageActions } from 'features/message';

interface Props {
  message: string;
  signMessageRequested: messageActions.TSignMessageRequested;
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
