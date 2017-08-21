/* eslint-disable quotes */
import React, { Component } from 'react';
import translate from 'translations';
import TrezorConnect from 'vendor/trezor-connect';
import './Trezor.scss';

export default class TrezorDecrypt extends Component {
  state = {
    publicKey: null,
    chainCode: null,
    dPath: "m/44'/60'/0'/0",
    error: null
  };

  _handleConnect() {
    TrezorConnect.getXPubKey(
      this.state.dPath,
      res => {
        if (res.success) {
          this.setState({
            publicKey: res.publicKey,
            chainCode: res.chainCode
          });
        } else {
          this.setState({
            error: res.error
          });
        }
        console.log(res);
      },
      '1.5.2'
    );
  }

  render() {
    return (
      <section className="TrezorDecrypt col-md-4 col-sm-6">
        <button
          className="TrezorDecrypt-decrypt btn btn-primary btn-lg"
          onClick={this._handleConnect}
        >
          {translate('ADD_Trezor_scan')}
        </button>

        <div className="TrezorDecrypt-help">
          Guide:{' '}
          <a
            href="https://blog.trezor.io/trezor-integration-with-myetherwallet-3e217a652e08"
            target="_blank"
            rel="noopener"
          >
            How to use TREZOR with MyEtherWallet
          </a>
        </div>

        <a
          className="TrezorDecrypt-buy btn btn-sm btn-default"
          href="https://trezor.io/?a=myetherwallet.com"
          target="_blank"
          rel="noopener"
        >
          {translate('Don’t have a TREZOR? Order one now!')}
        </a>
      </section>
    );
  }
}
