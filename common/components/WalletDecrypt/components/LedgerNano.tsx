import './LedgerNano.scss';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import { LedgerWallet } from 'libs/wallet';
import ledger from 'ledgerco';
import DPATHS from 'config/dpaths';
import { Spinner } from 'components/ui';

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
  showTip: boolean;
}

export class LedgerNanoSDecrypt extends Component<Props, State> {
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath: DEFAULT_PATH,
    error: null,
    isLoading: false,
    showTip: false
  };

  public showTip = () => {
    this.setState({
      showTip: true
    });
  };

  public render() {
    const { dPath, publicKey, chainCode, error, isLoading, showTip } = this.state;
    const showErr = error ? 'is-showing' : '';

    if (window.location.protocol !== 'https:') {
      return (
        <div className="LedgerDecrypt">
          <div className="alert alert-danger">
            Unlocking a Ledger hardware wallet is only possible on pages served over HTTPS. You can
            unlock your wallet at <a href="https://myetherwallet.com">MyEtherWallet.com</a>
          </div>
        </div>
      );
    }

    return (
      <div className="LedgerDecrypt">
        {showTip && (
          <p>
            <strong>Tip: </strong>Make sure you're logged into the ethereum app on your hardware
            wallet
          </p>
        )}
        <button
          className="LedgerDecrypt-decrypt btn btn-primary btn-lg btn-block"
          onClick={this.handleNullConnect}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="LedgerDecrypt-message">
              <Spinner light={true} />
              Unlocking...
            </div>
          ) : (
            translate('ADD_Ledger_scan')
          )}
        </button>

        <a
          className="LedgerDecrypt-buy btn btn-sm btn-default"
          href="https://www.ledgerwallet.com/r/fa4b?path=/products/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate('Don’t have a Ledger? Order one now!')}
        </a>

        <div className={`LedgerDecrypt-error alert alert-danger ${showErr}`}>{error || '-'}</div>

        <div className="LedgerDecrypt-help">
          Guides:
          <div>
            <a
              href="https://support.ledgerwallet.com/knowledge_base/topics/how-to-use-myetherwallet-with-ledger"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to use MyEtherWallet with your Nano S
            </a>
          </div>
          <div>
            <a
              href="https://ledger.groovehq.com/knowledge_base/topics/how-to-secure-your-eth-tokens-augur-rep-dot-dot-dot-with-your-nano-s"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to secure your tokens with your Nano S
            </a>
          </div>
        </div>

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
      </div>
    );
  }

  private handlePathChange = (dPath: string) => {
    this.handleConnect(dPath);
  };

  private handleConnect = (dPath: string = this.state.dPath) => {
    this.setState({
      isLoading: true,
      error: null,
      showTip: false
    });

    ledger.comm_u2f.create_async().then(comm => {
      new ledger.eth(comm)
        .getAddress_async(dPath, false, true)
        .then(res => {
          this.setState({
            publicKey: res.publicKey,
            chainCode: res.chainCode,
            isLoading: false
          });
        })
        .catch(err => {
          if (err.metaData.code === 5) {
            this.showTip();
          }
          this.setState({
            error: err.metaData.type,
            isLoading: false
          });
        });
    });
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
