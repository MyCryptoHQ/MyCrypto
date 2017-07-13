import React, { Component } from 'react';
import translate from 'translations';
import WalletDecrypt from 'components/WalletDecrypt';

export default class UnlockWallet extends Component {
  render() {
    return (
      <article className="collapse-container">
        <div>
          <h1>View Wallet Info</h1>
        </div>
        <div>
          <p>
            {translate('VIEWWALLET_Subtitle')}
          </p>
        </div>
        <WalletDecrypt />
      </article>
    );
  }
}
