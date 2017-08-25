// @flow
/* eslint-disable quotes */
import './Trezor.scss';
import React, { Component } from 'react';
import translate from 'translations';
import TrezorConnect from 'vendor/trezor-connect';
import DerivedKeyModal from './DerivedKeyModal';

const DEFAULT_PATH = "m/44'/60'/0'/0";

type State = {
  publicKey: string,
  chainCode: string,
  dPath: string,
  error: ?string
};

export default class TrezorDecrypt extends Component {
  state: State = {
    publicKey: '',
    chainCode: '',
    dPath: DEFAULT_PATH,
    error: null
  };

  _handlePathChange = (dPath: string) => {
    this.setState({ dPath }, () => {
      this._handleConnect();
    });
  };

  _handleConnect = () => {
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
  };

  _handleCancel = () => {
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath: DEFAULT_PATH
    });
  };

  render() {
    const { dPath, publicKey, chainCode } = this.state;

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

        <DerivedKeyModal
          isOpen={!!publicKey && !!chainCode}
          publicKey={publicKey}
          chainCode={chainCode}
          dPath={dPath}
          onCancel={this._handleCancel}
          onConfirmAddress={addr => console.log(addr)}
          onPathChange={this._handlePathChange}
          walletType={translate('x_Trezor')}
        />
      </section>
    );
  }
}
