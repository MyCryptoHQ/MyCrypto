import './LedgerNano.scss';
import React, { PureComponent } from 'react';
import translate, { translateRaw } from 'translations';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import { LedgerWallet } from 'libs/wallet';
import ledger from 'ledgerco';
import { Spinner, NewTabLink } from 'components/ui';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { SecureWalletName, ledgerReferralURL } from 'config';
import { getPaths, getSingleDPath } from 'selectors/config/wallet';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  dPath: DPath;
  dPaths: DPath[];
}

interface State {
  publicKey: string;
  chainCode: string;
  dPath: string;
  error: string | null;
  isLoading: boolean;
  showTip: boolean;
}

type Props = OwnProps & StateProps;

class LedgerNanoSDecryptClass extends PureComponent<Props, State> {
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath: this.props.dPath.value,
    error: null,
    isLoading: false,
    showTip: false
  };

  public showTip = () => {
    this.setState({
      showTip: true
    });
  };

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.dPath !== nextProps.dPath) {
      this.setState({ dPath: nextProps.dPath.value });
    }
  }

  public render() {
    const { dPath, publicKey, chainCode, error, isLoading, showTip } = this.state;
    const showErr = error ? 'is-showing' : '';

    if (window.location.protocol !== 'https:') {
      return (
        <div className="LedgerDecrypt">
          <div className="alert alert-danger">
            Unlocking a Ledger hardware wallet is only possible on pages served over HTTPS. You can
            unlock your wallet at <a href="https://mycrypto.com">MyCrypto.com</a>
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

        <NewTabLink className="LedgerDecrypt-buy btn btn-sm btn-default" href={ledgerReferralURL}>
          {translate('Don’t have a Ledger? Order one now!')}
        </NewTabLink>

        <div className={`LedgerDecrypt-error alert alert-danger ${showErr}`}>{error || '-'}</div>

        <div className="LedgerDecrypt-help">
          Guide:{' '}
          <NewTabLink href="https://support.ledgerwallet.com/hc/en-us/articles/115005200009">
            How to use MyCrypto with your Nano S
          </NewTabLink>
        </div>

        <DeterministicWalletsModal
          isOpen={!!publicKey && !!chainCode}
          publicKey={publicKey}
          chainCode={chainCode}
          dPath={dPath}
          dPaths={this.props.dPaths}
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

    ledger.comm_u2f.create_async().then((comm: any) => {
      new ledger.eth(comm)
        .getAddress_async(dPath, false, true)
        .then(res => {
          this.setState({
            publicKey: res.publicKey,
            chainCode: res.chainCode,
            isLoading: false
          });
        })
        .catch((err: any) => {
          if (err && err.metaData && err.metaData.code === 5) {
            this.showTip();
          }
          this.setState({
            error: err && err.metaData ? err.metaData.type : err.toString(),
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
      dPath: this.props.dPath.value
    });
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    dPath: getSingleDPath(state, SecureWalletName.LEDGER_NANO_S),
    dPaths: getPaths(state, SecureWalletName.LEDGER_NANO_S)
  };
}

export const LedgerNanoSDecrypt = connect(mapStateToProps)(LedgerNanoSDecryptClass);
