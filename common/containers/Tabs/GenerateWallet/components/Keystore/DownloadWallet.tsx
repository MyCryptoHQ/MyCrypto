import { IV3Wallet } from 'ethereumjs-wallet';
import React, { Component } from 'react';
import { translateRaw, translateMarkdown } from 'translations';
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
          <h1 className="DlWallet-title">{translateRaw('GEN_Label_2')}</h1>

          <a
            role="button"
            className="DlWallet-download btn btn-primary btn-lg"
            aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
            aria-describedby={translateRaw('x_KeystoreDesc')}
            download={filename}
            href={this.getBlob()}
            onClick={this.handleDownloadKeystore}
          >
            {translateRaw('x_Download')} {translateRaw('x_Keystore2')}
          </a>

          <div className="DlWallet-warning">
            <p>{translateMarkdown('DL_WALLET_WARNING_1')}</p>
            <p>{translateMarkdown('DL_WALLET_WARNING_2')}</p>
            <p>{translateMarkdown('DL_WALLET_WARNING_3')}</p>
          </div>

          <button
            className="DlWallet-continue btn btn-danger"
            role="button"
            onClick={this.handleContinue}
            disabled={!hasDownloadedWallet}
          >
            {translateRaw('GET_ConfButton')}
          </button>
        </div>
      </Template>
    );
  }

  public getBlob = () => makeBlob('text/json;charset=UTF-8', this.props.keystore);

  private handleContinue = () => this.state.hasDownloadedWallet && this.props.continue();

  private handleDownloadKeystore = () => this.setState({ hasDownloadedWallet: true });
}
