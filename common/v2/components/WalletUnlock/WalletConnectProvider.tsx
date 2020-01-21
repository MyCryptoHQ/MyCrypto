import React, { useContext, useState, useEffect } from 'react';

import translate, { translateRaw } from 'v2/translations';
import { NetworkContext, isValidAddress } from 'v2/services';
import { WalletId, FormData } from 'v2/types';
import { WALLETS_CONFIG } from 'v2/config';
import { notificationsActions } from 'v2/features/NotificationsPanel';
import { WalletFactory, WalletConnectContext } from 'v2/services/WalletService';

import './WalletConnectProvider.scss';
import { Spinner } from '../Spinner';
import WalletConnectReadOnlyQr from '../WalletConnectReadOnlyQr';

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

enum WalletQRState {
  READY, // use when walletConnect session is created
  NOT_READY, // use when walletConnect session needs to be created
  UNKNOWN // used upon component initialization when walletconnect status is not determined
}

export type WalletConnectQrContent = WalletConnectAddress | string;

const WalletService = WalletFactory(WalletId.WALLETCONNECT);
const wikiLink = WALLETS_CONFIG[WalletId.WALLETCONNECT].helpLink!;

export function WalletConnectDecrypt({ formData, onUnlock }: OwnProps & StateProps) {
  const { getNetworkByName } = useContext(NetworkContext);
  const [network] = useState(getNetworkByName(formData.network));
  const [walletSigningState, setWalletSigningState] = useState(WalletQRState.UNKNOWN);
  const { session, refreshSession, fetchWalletConnectSession } = useContext(WalletConnectContext);

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

  /* start:wallet-login-state */
  useEffect(() => {
    if (walletSigningState !== WalletQRState.UNKNOWN) {
      return;
    }
    // DETECT IF WALLETCONNECT SESSION EXISTS
    if (window.localStorage.getItem('walletconnect') || session) {
      refreshSession().then(() => {
        setWalletSigningState(WalletQRState.NOT_READY);
      });
    } else {
      setWalletSigningState(WalletQRState.NOT_READY);
    }
  });

  // If a WalletConnect session already exist, or setup isnt initialized, exit.
  // Otherwise, generate a new session.
  useEffect(() => {
    if (walletSigningState !== WalletQRState.NOT_READY || session) {
      return;
    }
    const walletConnectSessionInterval = setInterval(() => {
      const walletConnector = fetchWalletConnectSession();
      if (!walletConnector) return;
    }, 250);
    return () => clearInterval(walletConnectSessionInterval);
  });

  // Set WalletSigningState to ready if walletConnectSession exists. This renders qr code.
  useEffect(() => {
    if (!session) return;
    setWalletSigningState(WalletQRState.READY);
  }, [session]);

  if (session && walletSigningState === WalletQRState.READY) {
    session.on('connect', (error, payload) => {
      if (error) {
        throw error;
      }
      // Determine provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      unlockAddress({ address: accounts[0], chainId });
    });
  }
  /* end:wallet-login-state */

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
          {session && session.uri ? (
            <section className="WalletConnect-fields-field">
              <WalletConnectReadOnlyQr sessionUri={session.uri} />
            </section>
          ) : (
            <Spinner />
          )}
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
