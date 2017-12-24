import './LedgerNano.scss';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import { LedgerWallet } from 'libs/wallet';
import Ledger3 from 'vendor/ledger3';
import LedgerEth from 'vendor/ledger-eth';
import DPATHS from 'config/dpaths';

const DEFAULT_PATH = DPATHS.LEDGER[0].value;

interface Props {
  onUnlock(param: any): void;
}

interface State {
  publicKey: string;
  chainCode: string;
  dPath: string;
  error: string | null;
  isLoading: boolean;
}

export default class LedgerNanoSDecrypt extends Component<Props, State> {
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath: DEFAULT_PATH,
    error: null,
    isLoading: false
  };

  public render() {
    const { dPath, publicKey, chainCode, error, isLoading } = this.state;
    const showErr = error ? 'is-showing' : '';

    return (
      <section className="LedgerDecrypt col-md-4 col-sm-6">
        <button
          className="LedgerDecrypt-decrypt btn btn-primary btn-lg"
          onClick={this.handleNullConnect}
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

        <div className={`LedgerDecrypt-error alert alert-danger ${showErr}`}>{error || '-'}</div>

        <a
          className="LedgerDecrypt-buy btn btn-sm btn-default"
          href="https://www.ledgerwallet.com/r/fa4b?path=/products/"
          target="_blank"
          rel="noopener"
        >
          {translate('Don’t have a Ledger? Order one now!')}
        </a>

        <DeterministicWalletsModal
          isOpen={!!publicKey && !!chainCode}
          publicKey={publicKey}
          chainCode={chainCode}
          dPath={dPath}
          dPaths={DPATHS.LEDGER}
          onCancel={this.handleCancel}
          onConfirmAddress={this.handleUnlock}
          onPathChange={this.handlePathChange}
          walletType={translateRaw('x_Ledger')}
        />
      </section>
    );
  }

  private handlePathChange = (dPath: string) => {
    this.handleConnect(dPath);
  };

  private handleConnect = (dPath: string = this.state.dPath) => {
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
          err = ethApp.getError(err);
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

  private handleCancel = () => {
    this.reset();
  };

  private handleUnlock = (address: string, index: number) => {
    this.props.onUnlock(new LedgerWallet(address, this.state.dPath, index));
    this.reset();
  };

  private handleNullConnect = (): void => {
    return this.handleConnect();
  };

  private reset() {
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath: DEFAULT_PATH
    });
  }
}
