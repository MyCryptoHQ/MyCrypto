import React, { useContext, useState } from 'react';
import translate, { translateRaw } from 'v2/translations';

import { notificationsActions } from 'v2/features/NotificationsPanel';
import { ParityQrSigner, NewTabLink } from 'v2/components';
import { WalletFactory } from 'v2/services/WalletService';
import { isValidAddress } from 'v2/services/EthService';
import { WalletId, FormData } from 'v2/types';
import { WALLETS_CONFIG } from 'v2/config';

import AppStoreBadge from 'assets/images/mobile/app-store-badge.png';
import GooglePlayBadge from 'assets/images/mobile/google-play-badge.png';

import './ParitySigner.scss';
import { NetworkContext } from 'v2/services';
interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

interface StateProps {
  showNotification: notificationsActions.TShowNotification;
  isValidAddress: string; //getIsValidAddressFn;
}

interface SignerAddress {
  address: string;
  chainId: number;
}

type SignerQrContent = SignerAddress | string;

const WalletService = WalletFactory(WalletId.PARITY_SIGNER);
const wikiLink = WALLETS_CONFIG[WalletId.PARITY_SIGNER].helpLink!;

export function ParitySignerDecrypt({ formData, onUnlock }: OwnProps & StateProps) {
  const { getNetworkByName } = useContext(NetworkContext);
  const [network] = useState(getNetworkByName(formData.network));
  const unlockAddress = (content: SignerQrContent) => {
    if (
      typeof content === 'string' ||
      !isValidAddress(content.address, !network ? 1 : network.chainId)
    ) {
      this.props.showNotification('danger', 'Not a valid address!');
      return;
    }

    onUnlock(WalletService.init(content.address));
  };
  return (
    <div className="ParityPanel">
      <div className="Panel-title">
        {translate('UNLOCK_WALLET')} {`Your ${translateRaw('X_PARITYSIGNER')}`}
      </div>
      <div className="ParitySigner">
        {/* <div className="ParitySigner-title">{translate('SIGNER_SELECT_WALLET')}</div> */}
        <section className="ParitySigner-fields">
          <section className="Panel-description">{translate('SIGNER_SELECT_WALLET_QR')}</section>
          <section className="ParitySigner-fields-field">
            <ParityQrSigner scan={true} onScan={unlockAddress} />
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

export default ParitySignerDecrypt;
