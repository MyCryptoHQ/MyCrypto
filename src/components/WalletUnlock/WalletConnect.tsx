import React, { useEffect } from 'react';

import isEmpty from 'ramda/src/isEmpty';
import styled, { css } from 'styled-components';

import { Button, Overlay, QRCodeContainer, Typography } from '@components';
import { getWalletConfig } from '@config';
import { IUseWalletConnect, WalletFactory } from '@services/WalletService';
import { BREAK_POINTS, COLORS, FONT_SIZE } from '@theme';
import translate, { translateRaw } from '@translations';
import { WalletId } from '@types';

interface OwnProps {
  useWalletConnectProps: IUseWalletConnect;
  onUnlock(param: any): void;
  goToPreviousStep(): void;
}

const SHeader = styled.div`
  font-size: ${FONT_SIZE.XXL};
  font-weight: bold;
  color: var(--dark-slate-blue);
  text-align: center;
  margin-bottom: 1em;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    font-size: ${FONT_SIZE.XL};
  }
`;

const SContent = styled.div`
  justify-content: center;
  text-align: center;
`;
const SSection = styled.div<{ center: boolean; withOverlay?: boolean }>`
  ${(props) =>
    props.center &&
    css`
      margin: 0 auto;
    `}

  ${(props) =>
    props.withOverlay &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 415px;
      width: 415px;
      position: relative;
    `}

  padding: 1em 0;
  font-size: ${FONT_SIZE.MD};
`;

const SFooter = styled.div`
  display: flex;
  justify-content: center;
  margin: 1em 0;
`;

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  &&& span,
  button {
    color: ${COLORS.WHITE};
  }
`;

const WalletService = WalletFactory[WalletId.WALLETCONNECT];
const wikiLink = getWalletConfig(WalletId.WALLETCONNECT).helpLink;

export function WalletConnectDecrypt({ onUnlock, useWalletConnectProps }: OwnProps) {
  const { state, requestConnection, signMessage } = useWalletConnectProps;

  useEffect(() => {
    if (!state.detectedAddress) return;
    onUnlock(WalletService.init({ address: state.detectedAddress, signMessageHandler: signMessage }));
  }, [state.detectedAddress]);

  return (
    <>
      <SHeader>
        {translateRaw('SIGNER_SELECT_WALLETCONNECT', {
          $walletId: translateRaw('X_WALLETCONNECT')
        })}
      </SHeader>
      <SContent>
        <SSection center={true}>
          {translate('SIGNER_SELECT_WALLET_QR', { $walletId: translateRaw('X_WALLETCONNECT') })}
        </SSection>
        <SSection center={true} withOverlay={true}>
          <Overlay absolute={true} center={true} show={state.isConnected || !isEmpty(state.errors)}>
            <SContainer>
              {!isEmpty(state.errors) && (
                <>
                  <Typography>{translateRaw('SIGN_TX_WALLETCONNECT_SESSION_REJECTED')}</Typography>
                  <div style={{ marginTop: '1em' }}>
                    <Button onClick={requestConnection}>
                      {translateRaw('SIGN_TX_WALLETCONNECT_TRY_AGAIN')}
                    </Button>
                  </div>
                </>
              )}
            </SContainer>
          </Overlay>
          <QRCodeContainer data={state.uri} disableSpinner={true} />
        </SSection>
      </SContent>
      <SFooter>
        <Typography>{translate('ADD_WALLETCONNECT_LINK', { $wiki_link: wikiLink })}</Typography>
      </SFooter>
    </>
  );
}

export default WalletConnectDecrypt;
