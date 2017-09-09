// @flow
import './Trezor.scss';
import React, { Component } from 'react';
import translate from 'translations';
import TrezorConnect from 'vendor/trezor-connect';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import TrezorWallet from 'libs/wallet/trezor';
import DPATHS from 'config/dpaths.json';
const DEFAULT_PATH = DPATHS.TREZOR[0].value;

type State = {
  publicKey: string,
  chainCode: string,
  dPath: string,
  error: ?string,
  isLoading: boolean
};

export default class TrezorDecrypt extends Component {
  props: { onUnlock: any => void };
  state: State = {
    publicKey: '',
    chainCode: '',
    dPath: DEFAULT_PATH,
    error: null,
    isLoading: false
  };

  _handlePathChange = (dPath: string) => {
    this._handleConnect(dPath);
  };

  _handleConnect = (dPath: string = this.state.dPath) => {
    this.setState({
      isLoading: true,
      error: null
    });

    TrezorConnect.getXPubKey(
      dPath,
      res => {
        if (res.success) {
          this.setState({
            dPath,
            publicKey: res.publicKey,
            chainCode: res.chainCode,
            isLoading: false
          });
        } else {
          this.setState({
            error: res.error,
            isLoading: false
          });
        }
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

  _handleUnlock = (address: string) => {
    this.props.onUnlock(new TrezorWallet(address, this.state.dPath));
  };

  render() {
    const { dPath, publicKey, chainCode, error, isLoading } = this.state;
    const showErr = error ? 'is-showing' : '';

    return (
      <section className="TrezorDecrypt col-md-4 col-sm-6">
        <button
          className="TrezorDecrypt-decrypt btn btn-primary btn-lg"
          onClick={() => this._handleConnect()}
          disabled={isLoading}
        >
          {isLoading ? 'Unlocking...' : translate('ADD_Trezor_scan')}
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

        <div className={`TrezorDecrypt-error alert alert-danger ${showErr}`}>
          {error || '-'}
        </div>

        <a
          className="TrezorDecrypt-buy btn btn-sm btn-default"
          href="https://trezor.io/?a=myetherwallet.com"
          target="_blank"
          rel="noopener"
        >
          {translate('Don’t have a TREZOR? Order one now!')}
        </a>

        <DeterministicWalletsModal
          isOpen={!!publicKey && !!chainCode}
          publicKey={publicKey}
          chainCode={chainCode}
          dPath={dPath}
          dPaths={DPATHS.TREZOR}
          onCancel={this._handleCancel}
          onConfirmAddress={this._handleUnlock}
          onPathChange={this._handlePathChange}
          walletType={translate('x_Trezor', true)}
        />
      </section>
    );
  }
}
