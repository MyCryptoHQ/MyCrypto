import React from 'react';
import translate from 'translations';
import { NewTabLink } from 'components/ui';
import './InsecureWalletWarning.scss';

interface Props {
  walletType: string;
  onCancel(): void;
}

export class InsecureWalletWarning extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { walletType, onCancel } = this.props;

    return (
      <div className="WalletWarning">
        <h2 className="WalletWarning-title">
          {translate('INSECURE_WALLET_TYPE_TITLE', { $wallet_type: walletType })}
        </h2>
        <p className="WalletWarning-desc">
          {translate('INSECURE_WALLET_TYPE_DESC', { $wallet_type: walletType })}
        </p>

        <div className="WalletWarning-buttons">
          <NewTabLink
            href="https://download.mycrypto.com/"
            className="WalletWarning-buttons-btn is-download btn btn-lg btn-primary"
          >
            {translate('WALLET_SUGGESTION_DESKTOP_APP')}
          </NewTabLink>
          <button className="WalletWarning-buttons-btn is-cancel" onClick={onCancel}>
            <i className="fa fa-arrow-left" />
            {translate('INSECURE_WALLET_GO_BACK')}
          </button>
        </div>
      </div>
    );
  }
}
