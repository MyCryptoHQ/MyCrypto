import { IV3Wallet } from 'ethereumjs-wallet';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
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
          <h1 className="DlWallet-title">{translate('GEN_LABEL_2')}</h1>

          <a
            role="button"
            className="DlWallet-download btn btn-primary btn-lg"
            aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
            aria-describedby={translateRaw('X_KEYSTOREDESC')}
            download={filename}
            href={this.getBlob()}
            onClick={this.handleDownloadKeystore}
          >
            {translate('ACTION_13', { $thing: translateRaw('X_KEYSTORE2') })}
          </a>

          <div className="DlWallet-warning">
            <p>{translate('DL_WALLET_WARNING_1')}</p>
            <p>{translate('DL_WALLET_WARNING_2')}</p>
            <p>{translate('DL_WALLET_WARNING_3')}</p>
          </div>

          <button
            className="DlWallet-continue btn btn-danger"
            role="button"
            onClick={this.handleContinue}
            disabled={!hasDownloadedWallet}
          >
            {translate('ACTION_14')}
          </button>
        </div>
      </Template>
    );
  }

  public getBlob = () => makeBlob('text/json;charset=UTF-8', this.props.keystore);

  private handleContinue = () => this.state.hasDownloadedWallet && this.props.continue();

  private handleDownloadKeystore = () => this.setState({ hasDownloadedWallet: true });
}
