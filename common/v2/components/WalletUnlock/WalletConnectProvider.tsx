import React, { useContext, useState } from 'react';

import translate, { translateRaw } from 'v2/translations';
import { NetworkContext, isValidAddress } from 'v2/services';
import { WalletConnectQr } from 'v2/components';
import { WalletId, FormData } from 'v2/types';
import { WALLETS_CONFIG } from 'v2/config';
import { notificationsActions } from 'v2/features/NotificationsPanel';
import { WalletFactory } from 'v2/services/WalletService';

import './WalletConnectProvider.scss';

interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

interface StateProps {
  showNotification: notificationsActions.TShowNotification;
  isValidAddress: string; //getIsValidAddressFn;
}

interface WalletConnectAddress {
  address: string;
  chainId: number;
}

export type WalletConnectQrContent = WalletConnectAddress | string;

const WalletService = WalletFactory(WalletId.WALLETCONNECT);
const wikiLink = WALLETS_CONFIG[WalletId.WALLETCONNECT].helpLink!;

export function WalletConnectDecrypt({ formData, onUnlock }: OwnProps & StateProps) {
  const { getNetworkByName } = useContext(NetworkContext);
  const [network] = useState(getNetworkByName(formData.network));

  const unlockAddress = (content: WalletConnectQrContent) => {
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
    <div className="WalletConnectPanel">
      <div className="Panel-title">
        {translate('UNLOCK_WALLET')} {`Your ${translateRaw('X_WALLETCONNECT')} device`}
      </div>
      <div className="WalletConnect">
        {/* <div className="WalletConnect-title">{translate('SIGNER_SELECT_WALLET')}</div> */}
        <section className="WalletConnect-fields">
          <section className="Panel-description">
            {translate('SIGNER_SELECT_WALLET_QR', { $walletId: translateRaw('X_WALLETCONNECT') })}
          </section>
          <section className="WalletConnect-fields-field">
            <WalletConnectQr scan={true} onScan={unlockAddress} />
          </section>
        </section>
        {wikiLink && (
          <p className="WalletConnect-wiki-link">
            {translate('ADD_WALLETCONNECT_LINK', { $wiki_link: wikiLink })}
          </p>
        )}
      </div>
    </div>
  );
}

export default WalletConnectDecrypt;
