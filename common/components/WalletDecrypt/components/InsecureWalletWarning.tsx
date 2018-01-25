import React from 'react';
import './InsecureWalletWarning.scss';

interface Props {
  walletType: string | React.ReactElement<string>;
  onContinue(): void;
  onCancel(): void;
}

interface State {
  hasConfirmedSite: boolean;
  hasAcknowledgedDownload: boolean;
  hasAcknowledgedWallets: boolean;
}

interface Checkbox {
  name: keyof State;
  label: string | React.ReactElement<string>;
}

export class InsecureWalletWarning extends React.Component<Props, State> {
  public state: State = {
    hasConfirmedSite: false,
    hasAcknowledgedDownload: false,
    hasAcknowledgedWallets: false
  };

  constructor(props: Props) {
    super(props);
    if (process.env.BUILD_DOWNLOADABLE) {
      props.onContinue();
    }
  }

  public render() {
    if (process.env.BUILD_DOWNLOADABLE) {
      return null;
    }

    const { walletType, onContinue, onCancel } = this.props;
    const checkboxes: Checkbox[] = [
      {
        name: 'hasAcknowledgedWallets',
        label: 'I acknowledge that I can and should use MetaMask or a Hardware Wallet'
      },
      {
        name: 'hasAcknowledgedDownload',
        label: 'I acknowledge that I can and should download and run MyEtherWallet locally'
      },
      {
        name: 'hasConfirmedSite',
        label:
          'I have checked the URL and SSL certificate to make sure this is the real MyEtherWallet'
      }
    ];
    const canContinue = checkboxes.reduce(
      (prev, checkbox) => prev && this.state[checkbox.name],
      true
    );

    return (
      <div className="WalletWarning">
        <h2 className="WalletWarning-title">
          This is <u>not</u> a recommended way to access your wallet
        </h2>
        <p className="WalletWarning-desc">
          Entering your {walletType} on a website is <strong>dangerous</strong>. If our website is
          compromised, or you accidentally visit a phishing website, you could{' '}
          <strong>lose all of your funds</strong>. Before you continue, please consider:
        </p>
        <ul className="WalletWarning-bullets">
          <li>
            Using{' '}
            <a href="https://myetherwallet.github.io/knowledge-base/migration/moving-from-private-key-to-metamask.html">
              MetaMask
            </a>{' '}
            or a{' '}
            <a href="https://myetherwallet.github.io/knowledge-base/hardware-wallets/hardware-wallet-recommendations.html">
              Hardware Wallet
            </a>{' '}
            to access your wallet
          </li>
          <li>
            <a href="https://myetherwallet.github.io/knowledge-base/offline/running-myetherwallet-locally.html">
              Downloading MEW and running it offline & locally
            </a>
          </li>
          <li>
            Reading{' '}
            <a href="https://myetherwallet.github.io/knowledge-base/security/securing-your-ethereum.html">
              How to Protect Yourself and Your Funds
            </a>
          </li>
        </ul>
        <p className="WalletWarning-check">
          If you must use your {walletType} online, please double-check the URL & SSL certificate.
          It should say <code>{'https://www.myetherwallet.com'}</code>
          & <code>MYETHERWALLET LLC [US]</code> in your URL bar.
        </p>
        <div className="WalletWarning-checkboxes">{checkboxes.map(this.makeCheckbox)}</div>

        <div className="WalletWarning-buttons">
          <button className="WalletWarning-cancel btn btn-lg btn-default" onClick={onCancel}>
            Go Back
          </button>
          <button
            className="WalletWarning-continue btn btn-lg btn-primary"
            onClick={onContinue}
            disabled={!canContinue}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  private makeCheckbox = (checkbox: Checkbox) => {
    return (
      <label className="AcknowledgeCheckbox">
        <input
          type="checkbox"
          name={checkbox.name}
          className="AcknowledgeCheckbox-checkbox"
          onChange={this.handleCheckboxChange}
          checked={this.state[checkbox.name]}
        />
        <span className="AcknowledgeCheckbox-label">{checkbox.label}</span>
      </label>
    );
  };

  private handleCheckboxChange = (ev: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      [ev.currentTarget.name as any]: !!ev.currentTarget.checked
    });
  };
}
