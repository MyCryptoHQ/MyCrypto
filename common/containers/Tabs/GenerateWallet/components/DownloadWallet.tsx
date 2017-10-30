import { ContinueToPaperAction } from 'actions/generateWallet';
import { IFullWallet, IV3Wallet } from 'ethereumjs-wallet';
import { toChecksumAddress } from 'ethereumjs-util';
import { NewTabLink } from 'components/ui';
import React, { Component } from 'react';
import translate from 'translations';
import { makeBlob } from 'utils/blob';
import './DownloadWallet.scss';
import Template from './Template';

interface Props {
  wallet: IFullWallet;
  password: string;
  continueToPaper(): ContinueToPaperAction;
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
            <NewTabLink href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-do-i-save-slash-backup-my-wallet">
              <strong>{translate('GEN_Help_13')}</strong>
            </NewTabLink>
          </li>
          <li>
            <NewTabLink href="https://myetherwallet.groovehq.com/knowledge_base/topics/what-are-the-different-formats-of-a-private-key">
              <strong>{translate('GEN_Help_14')}</strong>
            </NewTabLink>
          </li>
        </ul>
      </div>
    );

    return <Template content={content} help={help} />;
  }

  public getBlob = () =>
    (this.state.keystore &&
      makeBlob('text/json;charset=UTF-8', this.state.keystore)) ||
    undefined;

  private markDownloaded = () =>
    this.state.keystore && this.setState({ hasDownloadedWallet: true });

  private handleContinue = () =>
    this.state.hasDownloadedWallet && this.props.continueToPaper();

  private setWallet(wallet: IFullWallet, password: string) {
    const keystore = wallet.toV3(password, { n: 1024 });
    keystore.address = toChecksumAddress(keystore.address);
    this.setState({ keystore });
  }

  private handleDownloadKeystore = e =>
    this.state.keystore ? this.markDownloaded() : e.preventDefault();
}
