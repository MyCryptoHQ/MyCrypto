// @flow
import './LedgerNano.scss';
import React, { Component } from 'react';
import translate from 'translations';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import LedgerWallet from 'libs/wallet/ledger';
import Ledger3 from 'vendor/ledger3';
import LedgerEth from 'vendor/ledger-eth';
import u2f from 'vendor/u2f-api';
import DPATHS from 'config/dpaths.js';

const DEFAULT_PATH = DPATHS.LEDGER[0].value;

type State = {
  publicKey: string,
  chainCode: string,
  dPath: string,
  error: ?string,
  isLoading: boolean
};

export default class LedgerNanoSDecrypt extends Component {
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

    const ledger = new Ledger3('w0w');
    const ethApp = new LedgerEth(ledger);

    ethApp.getAddress(
      dPath,
      (res, err) => {
        if (err) {
          err = err.errorCode ? u2f.getErrorByCode(err.errorCode) : err;
        }

        if (res) {
          this.setState({
            publicKey: res.publicKey,
            chainCode: res.chainCode,
            isLoading: false
          });
        } else {
          this.setState({
            error: err,
            isLoading: false
          });
        }
      },
      false,
      true
    );
  };

  _handleCancel = () => {
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath: DEFAULT_PATH
    });
  };

  _handleUnlock = (address: string, index: number) => {
    this.props.onUnlock(new LedgerWallet(address, this.state.dPath, index));
  };

  render() {
    const { dPath, publicKey, chainCode, error, isLoading } = this.state;
    const showErr = error ? 'is-showing' : '';

    return (
      <section className="LedgerDecrypt col-md-4 col-sm-6">
        <button
          className="LedgerDecrypt-decrypt btn btn-primary btn-lg"
          onClick={() => this._handleConnect()}
          disabled={isLoading}
        >
          {isLoading ? 'Unlocking...' : translate('ADD_Ledger_scan')}
        </button>

        <div className="LedgerDecrypt-help">
          Guides:
          <div>
            <a
              href="http://support.ledgerwallet.com/knowledge_base/topics/how-to-use-myetherwallet-with-ledger"
              target="_blank"
              rel="noopener"
            >
              How to use MyEtherWallet with your Nano S
            </a>
          </div>
          <div>
            <a
              href="https://ledger.groovehq.com/knowledge_base/topics/how-to-secure-your-eth-tokens-augur-rep-dot-dot-dot-with-your-nano-s"
              target="_blank"
              rel="noopener"
            >
              How to secure your tokens with your Nano S
            </a>
          </div>
        </div>

        <div className={`LedgerDecrypt-error alert alert-danger ${showErr}`}>
          {error || '-'}
        </div>

        <a
          className="LedgerDecrypt-buy btn btn-sm btn-default"
          href="https://www.ledgerwallet.com/r/fa4b?path=/products/"
          target="_blank"
          rel="noopener"
        >
          {translate('Don’t have a Ledger? Order one now!')}
        </a>

        <DeterministicWalletsModal
          isOpen={!!publicKey}
          publicKey={publicKey}
          chainCode={chainCode}
          dPath={dPath}
          dPaths={DPATHS.LEDGER}
          onCancel={this._handleCancel}
          onConfirmAddress={this._handleUnlock}
          onPathChange={this._handlePathChange}
          walletType={translate('x_Ledger', true)}
        />
      </section>
    );
  }
}
