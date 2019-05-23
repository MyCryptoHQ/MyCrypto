import React, { Component } from 'react';
import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import './MetaMask.scss';

export default class SignTransactionMetaMask extends Component {
  public render() {
    return (
      <div className="SignTransactionMetaMask-panel">
        <div className="SignTransactionMetaMask-title">Sign the Transaction with MetaMask</div>
        <div className="SignTransactionMetaMask-instructions">
          Sign into MetaMask on your computer and follow the isntructions in the MetaMask window.{' '}
        </div>
        <div className="SignTransactionMetaMask-img">
          <img src={MetamaskSVG} />
        </div>
        <div className="SignTransactionMetaMask-input">
          <div className="SignTransactionMetaMask-description">
            Because we never save, store, or transmit your secret, you need to sign each transaction
            in order to send it. MyCrypto puts YOU in control of your assets.
          </div>
          <div className="SignTransactionMetaMask-footer">
            <div className="SignTransactionMetaMask-help">
              Not working? Here's some troubleshooting tips to try
            </div>
          </div>
        </div>
      </div>
    );
  }
}
