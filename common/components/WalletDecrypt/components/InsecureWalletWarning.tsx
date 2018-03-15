import React from 'react';
import { HELP_ARTICLE } from 'config';
import './InsecureWalletWarning.scss';
import translate from 'translations';
import { knowledgeBaseURL } from 'config/data';

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
        label: translate('INSECURE_WALLET_WARNING_1')
      },
      {
        name: 'hasAcknowledgedDownload',
        label: translate('INSECURE_WALLET_WARNING_2')
      },
      {
        name: 'hasConfirmedSite',
        label: translate('INSECURE_WALLET_WARNING_3')
      }
    ];
    const canContinue = checkboxes.reduce(
      (prev, checkbox) => prev && this.state[checkbox.name],
      true
    );

    return (
      <div className="WalletWarning">
        <h2 className="WalletWarning-title">{translate('INSECURE_WALLET_TYPE_TITLE')}</h2>
        <p className="WalletWarning-desc">
          {translate('INSECURE_WALLET_TYPE_DESC', { $wallet_type: walletType as string })}
        </p>
        <ul className="WalletWarning-bullets">
          <li>
            {translate('INSECURE_WALLET_RECOMMEND_1', {
              $metamask_article: knowledgeBaseURL + '/' + HELP_ARTICLE.MIGRATE_TO_METAMASK,
              $hardware_wallet_article:
                knowledgeBaseURL + '/' + HELP_ARTICLE.HARDWARE_WALLET_RECOMMENDATIONS
            })}
          </li>
          <li>
            {translate('INSECURE_WALLET_RECOMMEND_2', {
              $run_local_article: knowledgeBaseURL + '/' + HELP_ARTICLE.RUNNING_LOCALLY
            })}
          </li>
          <li>
            {translate('INSECURE_WALLET_RECOMMEND_3', {
              $secure_your_eth_article: knowledgeBaseURL + '/' + HELP_ARTICLE.SECURING_YOUR_ETH
            })}
          </li>
        </ul>
        <p className="WalletWarning-check">
          {translate('WALLET_WARNING_CHECK', { $wallet_type: walletType as string })}
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
      <label className="AcknowledgeCheckbox" key={checkbox.name}>
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
