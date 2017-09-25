import { ContinueToPaperAction } from 'actions/generateWallet';
import { getV3Filename, UtcKeystore } from 'libs/keystore';
import PrivKeyWallet from 'libs/wallet/privkey';
import React, { Component } from 'react';
import translate from 'translations';
import { makeBlob } from 'utils/blob';
import './DownloadWallet.scss';
import Template from './Template';

interface Props {
  wallet: PrivKeyWallet;
  password: string;
  continueToPaper(): ContinueToPaperAction;
}

interface State {
  hasDownloadedWallet: boolean;
  address: string;
  keystore: UtcKeystore | null;
}

export default class DownloadWallet extends Component<Props, State> {
  public state: State = {
    hasDownloadedWallet: false,
    address: '',
    keystore: null
  };

  public componentDidMount() {
    this.props.wallet.getAddress().then(addr => {
      this.setState({ address: addr });
    });
  }

  public componentWillMount() {
    this.props.wallet.toKeystore(this.props.password).then(utcKeystore => {
      this.setState({ keystore: utcKeystore });
    });
  }
  public componentWillUpdate(nextProps: Props) {
    if (this.props.wallet !== nextProps.wallet) {
      nextProps.wallet.toKeystore(nextProps.password).then(utcKeystore => {
        this.setState({ keystore: utcKeystore });
      });
    }
  }

  public render() {
    const { hasDownloadedWallet } = this.state;
    const filename = this.getFilename();

    const content = (
      <div className="DlWallet">
        <h1 className="DlWallet-title">{translate('GEN_Label_2')}</h1>

        <a
          role="button"
          className="DlWallet-download btn btn-primary btn-lg"
          aria-label="Download Keystore File (UTC / JSON · Recommended · Encrypted)"
          aria-describedby="x_KeystoreDesc"
          download={filename}
          href={this.getBlob()}
          onClick={this.handleDownloadKeystore}
        >
          {translate('x_Download')} {translate('x_Keystore2')}
        </a>

        <div className="DlWallet-warning">
          <p>
            <strong>Do not lose it!</strong> It cannot be recovered if you lose
            it.
          </p>
          <p>
            <strong>Do not share it!</strong> Your funds will be stolen if you
            use this file on a malicious/phishing site.
          </p>
          <p>
            <strong>Make a backup!</strong> Secure it like the millions of
            dollars it may one day be worth.
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
    );

    const help = (
      <div>
        <h4>{translate('GEN_Help_8')}</h4>
        <ul>
          <li>{translate('GEN_Help_9')}</li>
          <li> {translate('GEN_Help_10')}</li>
          <input
            value={filename}
            className="form-control input-sm"
            disabled={true}
          />
        </ul>

        <h4>{translate('GEN_Help_11')}</h4>
        <ul>
          <li>{translate('GEN_Help_12')}</li>
        </ul>

        <h4>{translate('GEN_Help_4')}</h4>
        <ul>
          <li>
            <a
              href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-do-i-save-slash-backup-my-wallet"
              target="_blank"
              rel="noopener"
            >
              <strong>{translate('GEN_Help_13')}</strong>
            </a>
          </li>
          <li>
            <a
              href="https://myetherwallet.groovehq.com/knowledge_base/topics/what-are-the-different-formats-of-a-private-key"
              target="_blank"
              rel="noopener"
            >
              <strong>{translate('GEN_Help_14')}</strong>
            </a>
          </li>
        </ul>
      </div>
    );

    return <Template content={content} help={help} />;
  }

  public getBlob() {
    if (this.state.keystore) {
      return makeBlob('text/json;charset=UTF-8', this.state.keystore);
    }
  }

  public getFilename() {
    return getV3Filename(this.state.address);
  }
  private markDownloaded = () => {
    if (this.state.keystore) {
      this.setState({ hasDownloadedWallet: true });
    }
  };

  private handleContinue = () => {
    if (this.state.hasDownloadedWallet) {
      this.props.continueToPaper();
    }
  };

  private handleDownloadKeystore(e): void {
    this.state.keystore ? this.markDownloaded() : e.preventDefault();
  }
}
