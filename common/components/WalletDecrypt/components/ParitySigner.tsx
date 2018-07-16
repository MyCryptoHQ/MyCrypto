import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import translate, { translateRaw } from 'translations';
import { ParityQrSigner, SecondaryButton } from 'components';
import { NewTabLink } from 'components/ui';
import { isValidETHAddress } from 'libs/validators';
import { ParitySignerWallet } from 'libs/wallet';
import { wikiLink } from 'libs/wallet/non-deterministic/parity';
import { notificationsActions } from 'features/notifications';
import AppStoreBadge from 'assets/images/mobile/app-store-badge.png';
import GooglePlayBadge from 'assets/images/mobile/google-play-badge.png';
import './ParitySigner.scss';

interface Props {
  showNotification: notificationsActions.TShowNotification;
  onUnlock(param: any): void;
}

interface SignerAddress {
  address: string;
  chainId: number;
}

type SignerQrContent = SignerAddress | string;

class ParitySignerDecryptClass extends PureComponent<Props> {
  public render() {
    return (
      <div className="ParityDecrypt">
        <h2 className="ParityDecrypt-decrypt-title">
          {translate('UNLOCK_DEVICE', { $device: translateRaw('X_PARITYSIGNER') })}
        </h2>
        <ParityQrSigner scan={true} onScan={this.unlockAddress} />
        <p>{translate('ADD_PARITY_4', { $wiki_link: wikiLink })}</p>
        <p>
          <NewTabLink href="https://itunes.apple.com/us/app/parity-signer/id1218174838">
            <img className="ParityDecrypt-badge" src={AppStoreBadge} alt="App Store" />
          </NewTabLink>
          <NewTabLink href="https://play.google.com/store/apps/details?id=com.nativesigner">
            <img className="ParityDecrypt-badge" src={GooglePlayBadge} alt="Google Play" />
          </NewTabLink>
        </p>
        <div className="ParityDecrypt-btn-wrapper">
          <SecondaryButton
            text="Back"
            onClick={(this.props as any).clearWalletChoice}
            className="ParityDecrypt-btn"
          />
        </div>
      </div>
    );
  }

  private unlockAddress = (content: SignerQrContent) => {
    if (typeof content === 'string' || !isValidETHAddress(content.address)) {
      this.props.showNotification('danger', 'Not a valid address!');
      return;
    }

    this.props.onUnlock(new ParitySignerWallet(content.address));
  };
}

export const ParitySignerDecrypt = connect(() => ({}), {
  showNotification: notificationsActions.showNotification
})(ParitySignerDecryptClass);
