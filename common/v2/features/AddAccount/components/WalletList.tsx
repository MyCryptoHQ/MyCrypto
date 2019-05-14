import React, { PureComponent } from 'react';

import translate, { translateRaw } from 'translations';
import { WalletButton } from '../components';
import { WalletName } from 'v2/config/data';

interface Props {
  wallets: any[];
  onSelect(name: WalletName): void;
}

export default class WalletList extends PureComponent<Props> {
  public render() {
    const { wallets, onSelect } = this.props;
    const validWallets = wallets.filter(w => !w.hideFromWalletList); // @TODO Filter here according to electronOnly
    console.log('wallets');
    console.log(wallets);
    console.log(validWallets);
    return (
      <div className="WalletDecrypt-wallets">
        <h2 className="WalletDecrypt-wallets-title">{translate('DECRYPT_ACCESS')}</h2>
        <div className="WalletDecrypt-wallets-description">
          {translate('ADD_ACCOUNT_DESCRIPTION')}
        </div>
        <div className="WalletDecrypt-container">
          <div className="WalletDecrypt-wallets-row">
            {validWallets.map(wallet => {
              console.log(wallet.name);
              return (
                <WalletButton
                  key={`wallet-icon-${wallet.name}`}
                  name={translateRaw(wallet.lid)}
                  icon={wallet.icon}
                  description={translateRaw(wallet.description)}
                  // walletType={walletType}
                  // isSecure={true}
                  // isDisabled={this.isWalletDisabled(walletType)}
                  // disableReason={reasons[walletType]}
                  onClick={() => onSelect(wallet.name)}
                />
              );
            })}
          </div>
        </div>
        <div className="WalletDecrypt-info">{translate('ADD_ACCOUNT_FOOTER_LINK')}</div>
      </div>
    );
  }
}
