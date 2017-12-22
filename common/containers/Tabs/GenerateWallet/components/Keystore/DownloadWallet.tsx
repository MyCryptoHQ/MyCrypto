import { IFullWallet, IV3Wallet } from 'ethereumjs-wallet';
import { toChecksumAddress } from 'ethereumjs-util';
import React, { Component } from 'react';
import translate from 'translations';
import { makeBlob } from 'utils/blob';
import './DownloadWallet.scss';
import Template from '../Template';
import { N_FACTOR } from 'config/data';

interface Props {
  wallet: IFullWallet;
  password: string;
  continue(): void;
}

interface State {
  hasDownloadedWallet: boolean;
  keystore: IV3Wallet | null;
}

export default class DownloadWallet extends Component<Props, State> {
  public state: State = {
    hasDownloadedWallet: false,
    keystore: null
  };

  public componentWillMount() {
    this.setWallet(this.props.wallet, this.props.password);
  }

  public componentWillUpdate(nextProps: Props) {
    if (this.props.wallet !== nextProps.wallet) {
      this.setWallet(nextProps.wallet, nextProps.password);
    }
  }

  public render() {
    const { hasDownloadedWallet } = this.state;
    const filename = this.props.wallet.getV3Filename();

    return (
      <Template>
        <div className="DlWallet">
          <h1 className="DlWallet-title">{translate('GEN_Label_2')}</h1>

          <a
            role="button"
            className="DlWallet-download btn btn-primary btn-lg"
            aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
            aria-describedby={translate('x_KeystoreDesc')}
            download={filename}
            href={this.getBlob()}
            onClick={this.handleDownloadKeystore}
          >
            {translate('x_Download')} {translate('x_Keystore2')}
          </a>

          <div className="DlWallet-warning">
            <p>
              <strong>Do not lose it!</strong> It cannot be recovered if you lose it.
            </p>
            <p>
              <strong>Do not share it!</strong> Your funds will be stolen if you use this file on a
              malicious/phishing site.
            </p>
            <p>
              <strong>Make a backup!</strong> Secure it like the millions of dollars it may one day
              be worth.
            </p>
          </div>

          <button
            className="DlWallet-continue btn btn-danger"
            role="button"
            onClick={this.handleContinue}
            disabled={!hasDownloadedWallet}
          >
            I understand. Continue.
          </button>
        </div>
      </Template>
    );
  }

  public getBlob = () =>
    (this.state.keystore && makeBlob('text/json;charset=UTF-8', this.state.keystore)) || undefined;

  private markDownloaded = () =>
    this.state.keystore && this.setState({ hasDownloadedWallet: true });

  private handleContinue = () => this.state.hasDownloadedWallet && this.props.continue();

  private setWallet(wallet: IFullWallet, password: string) {
    const keystore = wallet.toV3(password, { n: N_FACTOR });
    keystore.address = toChecksumAddress(keystore.address);
    this.setState({ keystore });
  }

  private handleDownloadKeystore = (e: React.FormEvent<HTMLAnchorElement>) =>
    this.state.keystore ? this.markDownloaded() : e.preventDefault();
}
