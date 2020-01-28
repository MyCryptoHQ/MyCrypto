import React, { useEffect } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';

import translate, { translateRaw } from 'v2/translations';
import { WalletId } from 'v2/types';
import { WALLETS_CONFIG } from 'v2/config';
import { COLORS } from 'v2/theme';
import { QRCodeContainer, Overlay, Button, Typography } from 'v2/components';
import { WalletFactory, useWalletConnect } from 'v2/services/WalletService';

import './WalletConnect.scss';

interface OwnProps {
  onUnlock(param: any): void;
  goToPreviousStep(): void;
}

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${COLORS.WHITE};
`;

const WalletService = WalletFactory(WalletId.WALLETCONNECT);
const wikiLink = WALLETS_CONFIG[WalletId.WALLETCONNECT].helpLink!;

export function WalletConnectDecrypt({ onUnlock }: OwnProps) {
  const { state, requestConnection } = useWalletConnect();

  useEffect(() => {
    if (!state.detectedAddress) return;
    onUnlock(WalletService.init(state.detectedAddress));
  }, [state.detectedAddress]);

  return (
    <div className="WalletConnectPanel">
      <div className="Panel-title">
        {translate('UNLOCK_WALLET')} {`Your ${translateRaw('X_WALLETCONNECT')} device`}
      </div>
      <div className="WalletConnect">
        <section className="WalletConnect-fields">
          <section className="Panel-description">
            {translate('SIGNER_SELECT_WALLET_QR', { $walletId: translateRaw('X_WALLETCONNECT') })}
          </section>
          <section className="wc-center wc-qr-container">
            <Overlay
              absolute={true}
              center={true}
              show={state.isConnected || !R.isEmpty(state.errors)}
            >
              <SContainer>
                {!R.isEmpty(state.errors) && (
                  <>
                    <Typography style={{ color: 'white', textAlign: 'center' }}>
                      Session Rejected
                    </Typography>
                    <div style={{ marginTop: '1em' }}>
                      <Button onClick={requestConnection}>Try Again</Button>
                    </div>
                  </>
                )}
              </SContainer>
            </Overlay>
            <QRCodeContainer data={state.uri} disableSpinner={true} />
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
