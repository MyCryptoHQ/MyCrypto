import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { getDisabledWallets } from 'features/selectors';
import { walletSelectors } from 'features/wallet';
import { WalletButton } from '../components';
import { WalletName } from '../types';

interface Props {
  wallets: any[];
  onSelect(name: WalletName): void;
}

class WalletList extends PureComponent<Props> {
  public render() {
    const { wallets, onSelect, formDataDispatch } = this.props;
    const validWallets = wallets.filter(w => !w.hideFromWalletList); // @TODO Filter here according to electronOnly
    return (
      <div className="WalletDecrypt-wallets">
        <h2 className="WalletDecrypt-wallets-title">{translate('DECRYPT_ACCESS')}</h2>
        <div className="WalletDecrypt-wallets-description">
          {translate('ADD_ACCOUNT_DESCRIPTION')}
        </div>
        <div className="WalletDecrypt-container">
          <div className="WalletDecrypt-wallets-row">
            {validWallets.map(wallet => {
              return (
                <WalletButton
                  key={`wallet-icon-${wallet.name}`}
                  name={translateRaw(wallet.lid)}
                  icon={wallet.icon}
                  description={translateRaw(wallet.description)}
                  helpLink={wallet.helpLink}
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

// @TODO: From the moment we have flags on the wallets, this logic appears
// convulated and should be removed.
function mapStateToProps(state, ownProps) {
  // const { disabledWallets } = ownProps;
  // let computedDisabledWallets = getDisabledWallets(state);
  //
  // if (disabledWallets) {
  //   computedDisabledWallets = {
  //     wallets: [...computedDisabledWallets.wallets, ...disabledWallets.wallets],
  //     reasons: {
  //       ...computedDisabledWallets.reasons,
  //       ...disabledWallets.reasons
  //     }
  //   };
  // }

  return {
    // computedDisabledWallets,
    // accessMessage: walletSelectors.getWalletAccessMessage(state)
  };
}

export default connect(mapStateToProps, null)(WalletList);
