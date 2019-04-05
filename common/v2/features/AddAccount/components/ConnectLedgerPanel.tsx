import React, { Component } from 'react';
import { ContentPanel } from 'v2/components';

import LedgerNanoIcon from 'common/assets/images/icn-ledger-nano.svg';

export default class ConnectLedgerPanel extends Component {
  public render() {
    return (
      <ContentPanel
        heading="Connect and Unlock Your Ledger"
        description="After you have connected, follow the instructions on screen to access your account."
        className="ConnectLedgerPanel"
        onBack={() => {
          console.log('Connect & Unlock Ledger Back');
        }}
      >
        <img src={LedgerNanoIcon} />
      </ContentPanel>
    );
  }
}
