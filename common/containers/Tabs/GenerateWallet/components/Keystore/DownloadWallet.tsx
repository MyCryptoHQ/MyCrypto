import { IV3Wallet } from 'ethereumjs-wallet';
import React, { Component } from 'react';
import translate from 'translations';
import { makeBlob } from 'utils/blob';
import './DownloadWallet.scss';
import Template from '../Template';

interface Props {
  keystore: IV3Wallet;
  filename: string;
  continue(): void;
}

interface State {
  hasDownloadedWallet: boolean;
}

export default class DownloadWallet extends Component<Props, State> {
  public state: State = {
    hasDownloadedWallet: false
  };

  public render() {
    const { filename } = this.props;
    const { hasDownloadedWallet } = this.state;

    return (
      <Template>
        <div className="DlWallet">
          <h1 className="DlWallet-title">{translate('GEN_Label_2')}</h1>

          <a
            role="button"
            className="DlWallet-download btn btn-primary btn-lg"
            aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
            aria-describedby={translate('x_KeystoreDesc', true)}
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

  public getBlob = () => makeBlob('text/json;charset=UTF-8', this.props.keystore);

  private handleContinue = () => this.state.hasDownloadedWallet && this.props.continue();

  private handleDownloadKeystore = () => this.setState({ hasDownloadedWallet: true });
}
