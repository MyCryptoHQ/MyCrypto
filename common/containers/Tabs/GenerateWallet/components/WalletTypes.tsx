import React from 'react';
import translate from 'translations';
import { WalletType } from '../GenerateWallet';
import { NewTabLink, HelpLink } from 'components/ui';
import { HELP_ARTICLE, trezorReferralURL, ledgerReferralURL } from 'config';
import { Link } from 'react-router-dom';
import './WalletTypes.scss';

const WalletTypes: React.SFC<{}> = () => {
  const typeInfo = {
    [WalletType.Keystore]: {
      name: 'x_Keystore2',
      bullets: [
        'An encrypted JSON file, protected by a password',
        'Back it up on a USB drive',
        'Cannot be written, printed, or easily transferred to mobile',
        'Compatible with Mist, Parity, Geth',
        'Provides a single address for sending and receiving'
      ]
    },
    [WalletType.Mnemonic]: {
      name: 'x_Mnemonic',
      bullets: [
        'A 12-word private seed phrase',
        'Back it up on paper or USB drive',
        'Can be written, printed, and easily typed on mobile, too',
        'Compatible with MetaMask, Jaxx, imToken, and more',
        'Provides unlimited addresses for sending and receiving'
      ]
    }
  };

  return (
    <div className="WalletTypes Tab-content-pane">
      <h1 className="WalletTypes-title">{translate('NAV_GenerateWallet')}</h1>
      <p className="WalletTypes-subtitle alert alert-warning">
        <strong>Warning</strong>: Managing your own keys can be risky and a single mistake can lead
        to irrecoverable loss. If you are new to cryptocurrencies, we strongly recommend using{' '}
        <NewTabLink href="https://metamask.io/">MetaMask</NewTabLink>, or purchasing a{' '}
        <NewTabLink href={ledgerReferralURL}>Ledger</NewTabLink> or{' '}
        <NewTabLink href={trezorReferralURL}>TREZOR</NewTabLink> hardware wallet.{' '}
        <HelpLink article={HELP_ARTICLE.DIFFERENCE_BETWEEN_PKEY_AND_KEYSTORE}>
          Learn more about different wallet types & staying secure.
        </HelpLink>
      </p>

      <div className="WalletTypes-types row">
        <div className="col-md-1" />
        {Object.keys(typeInfo).map((type: keyof typeof typeInfo) => (
          <div key={type} className="WalletType col-md-5">
            <h2 className="WalletType-title">{translate(typeInfo[type].name)}</h2>
            <ul className="WalletType-features">
              {typeInfo[type].bullets.map(bullet => (
                <li key={bullet} className="WalletType-features-feature">
                  {translate(bullet)}
                </li>
              ))}
            </ul>
            <div className="WalletType-select">
              <Link
                className="WalletType-select-btn btn btn-primary btn-block"
                to={`/generate/${type}`}
              >
                Generate a {translate(typeInfo[type].name)}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletTypes;
