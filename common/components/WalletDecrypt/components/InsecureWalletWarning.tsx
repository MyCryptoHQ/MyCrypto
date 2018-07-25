import React from 'react';
import translate, { translateRaw } from 'translations';
import { PrimaryButton, SecondaryButton } from 'components';
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

        <div className="WalletWarning-btn-wrapper">
          <SecondaryButton
            text={translateRaw('ACTION_4')}
            onClick={onCancel}
            className="WalletWarning-btn"
          />
          <div className="flex-spacer" />
          <PrimaryButton
            text={translateRaw('WALLET_SUGGESTION_DESKTOP_APP')}
            href="https://download.mycrypto.com/"
            className="WalletWarning-btn"
          />
        </div>
      </div>
    );
  }
}
