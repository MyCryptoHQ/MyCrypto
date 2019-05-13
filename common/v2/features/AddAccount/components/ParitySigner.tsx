import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { translate, translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { ParitySignerWallet } from 'libs/wallet';
import { wikiLink } from 'libs/wallet/non-deterministic/parity';
import { notificationsActions } from 'features/notifications';
import AppStoreBadge from 'assets/images/mobile/app-store-badge.png';
import GooglePlayBadge from 'assets/images/mobile/google-play-badge.png';
import { ParityQrSigner } from 'components';
import { NewTabLink } from 'components/ui';

import './ParitySigner.scss';
interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  showNotification: notificationsActions.TShowNotification;
  isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn>;
}

type Props = OwnProps & StateProps;

interface SignerAddress {
  address: string;
  chainId: number;
}

type SignerQrContent = SignerAddress | string;

class ParitySignerDecryptClass extends PureComponent<Props> {
  public render() {
    return (
      <div className="ParityPanel">
        <div className="Panel-title">
          {translate('UNLOCK_WALLET')} {`Your ${translateRaw(this.props.wallet.lid)}`}
        </div>
        <div className="ParitySigner">
          {/* <div className="ParitySigner-title">{translate('SIGNER_SELECT_WALLET')}</div> */}
          <section className="ParitySigner-fields">
            <section className="Panel-description">{translate('SIGNER_SELECT_WALLET_QR')}</section>
            <section className="ParitySigner-fields-field">
              <ParityQrSigner scan={true} onScan={this.unlockAddress} />
            </section>
          </section>
          <p>{translate('ADD_PARITY_4', { $wiki_link: wikiLink })}</p>
          <p>{translate('ADD_PARITY_2')}</p>
          <div className="ParitySigner-app-links">
            <NewTabLink href="https://itunes.apple.com/us/app/parity-signer/id1218174838">
              <img className="ParitySigner-badge" src={AppStoreBadge} alt="App Store" />
            </NewTabLink>
            <NewTabLink href="https://play.google.com/store/apps/details?id=com.nativesigner">
              <img className="ParitySigner-badge" src={GooglePlayBadge} alt="Google Play" />
            </NewTabLink>
          </div>
        </div>
      </div>
    );
  }

  private unlockAddress = (content: SignerQrContent) => {
    if (typeof content === 'string' || !this.props.isValidAddress(content.address)) {
      this.props.showNotification('danger', 'Not a valid address!');
      return;
    }

    this.props.onUnlock(new ParitySignerWallet(content.address));
  };
}

export const ParitySignerDecrypt = connect((state: AppState): StateProps => ({
  showNotification: notificationsActions.showNotification,
  isValidAddress: configSelectors.getIsValidAddressFn(state)
}))(ParitySignerDecryptClass);
