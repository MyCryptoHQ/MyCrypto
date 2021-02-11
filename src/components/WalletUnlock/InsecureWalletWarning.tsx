import React from 'react';

import { LinkApp } from '@components';
import { DOWNLOAD_MYCRYPTO_LINK } from '@config';
import translate, { translateRaw } from '@translations';
import { IS_DEV } from '@utils';
import './InsecureWalletWarning.scss';

interface Props {
  walletType: string;
  onCancel(): void;
}

interface InsecureWarningType {
  wallet: any;
  goToStart: any;
}

class InsecureWalletWarning extends React.Component<Props> {
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
          <LinkApp
            href={DOWNLOAD_MYCRYPTO_LINK}
            isExternal={true}
            className="WalletWarning-buttons-btn is-download btn btn-lg btn-primary"
          >
            {translate('WALLET_SUGGESTION_DESKTOP_APP')}
          </LinkApp>
          <button className="WalletWarning-buttons-btn is-cancel" onClick={onCancel}>
            <i className="fa fa-arrow-left" />
            {translate('INSECURE_WALLET_GO_BACK')}
          </button>
        </div>
      </div>
    );
  }
}

const InsecureWarning = ({ wallet, goToStart }: InsecureWarningType) => (
  <div className="WalletDecrypt-decrypt">
    <InsecureWalletWarning walletType={translateRaw(wallet.lid)} onCancel={goToStart} />
    {IS_DEV && (
      <button
        className="WalletDecrypt-decrypt-override"
        onClick={() => console.debug('[DEV] Please code a Feature Flag to remove this warning')}
      >
        Override Warning
      </button>
    )}
  </div>
);

export default InsecureWarning;
