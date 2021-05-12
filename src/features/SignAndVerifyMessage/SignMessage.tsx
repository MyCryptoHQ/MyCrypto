import React, { useState } from 'react';

import { Button as ButtonUI } from '@mycrypto/ui';
import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { toChecksumAddress } from 'ethereumjs-util';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import backArrowIcon from '@assets/images/icn-back-arrow.svg';
import { Box, Button, CodeBlock, DemoGatewayBanner, InputField, WalletList } from '@components';
import { DEFAULT_NETWORK, WALLETS_CONFIG } from '@config';
import { WalletConnectWallet } from '@services';
import type { IFullWallet } from '@services/WalletService';
import { AppState, getIsDemoMode } from '@store';
import { BREAK_POINTS } from '@theme';
import translate, { translateRaw } from '@translations';
import { FormData, WalletId } from '@types';
import { useUnmount } from '@vendor';

import {
  selectMessage,
  selectSignedMessage,
  selectSignMessageError,
  selectSignMessageStatus,
  selectWalletId,
  signMessage,
  signMessageReset,
  updateMessage,
  walletSelect,
  walletUnlock
} from './signMessage.slice';
import { getStories } from './stories';

const { SCREEN_XS } = BREAK_POINTS;

export const defaultFormData: Pick<FormData, 'network'> = {
  network: DEFAULT_NETWORK
};

interface SignButtonProps {
  disabled?: boolean;
}
const SignButton = styled(Button)<SignButtonProps>`
  ${(props) => props.disabled && 'opacity: 0.4;'}

  @media (max-width: ${SCREEN_XS}) {
    width: 100%;
  }
`;

const SignedMessageLabel = styled.p`
  font-size: 18px;
  width: 100%;
  line-height: 1;
  text-align: left;
  font-weight: normal;
  margin-bottom: 9px;
  color: ${(props) => props.theme.text};
`;

interface BackButtonProps {
  marginBottom: boolean;
}

const BackButton = styled(ButtonUI)<BackButtonProps>`
  align-self: flex-start;
  color: #007a99;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 20px;
  ${(props) => props.marginBottom && 'margin-bottom: 40px;'}

  img {
    margin-right: 8px;
  }
`;

interface SignProps {
  setShowSubtitle(show: boolean): void;
}

function SignMessage({
  setShowSubtitle,
  isDemoMode,
  signedMessage,
  message,
  updateMessage,
  status,
  error,
  signMessageReset,
  walletSelect,
  walletUnlock,
  walletId,
  signMessage
}: Props) {
  const [wallet, setWallet] = useState<IFullWallet | undefined>(undefined);
  const handleSignMessage = async () => {
    if (!wallet || !message) {
      throw Error('[signMessageWorker]: Missing arguments'); // Error is handled in catch
    }
    signMessage({ message, wallet });
  };

  const onSelect = (walletId: WalletId) => {
    setShowSubtitle(false);
    walletSelect(walletId);
  };

  const onUnlock = (w: IFullWallet) => {
    const selectedWallet = Array.isArray(w) ? w[0] : w;
    setWallet(selectedWallet);
    walletUnlock({
      address: toChecksumAddress(selectedWallet.getAddressString()),
      network: selectedWallet.network
    });
  };

  const reset = () => {
    signMessageReset();
    setWallet(undefined);
    setShowSubtitle(true);
  };

  const story = getStories().find((x) => x.name === walletId);
  const Step = story && story.steps[0];

  useUnmount(() => {
    // Kill WalletConnect session
    if (wallet && walletId === WalletId.WALLETCONNECT) {
      (wallet as WalletConnectWallet).kill();
    }
  });

  return (
    <Box variant="columnAlign">
      {isDemoMode && <DemoGatewayBanner />}
      {walletId ? (
        <>
          <BackButton marginBottom={!!wallet} basic={true} onClick={reset}>
            <img src={backArrowIcon} alt="Back arrow" />
            {translateRaw('CHANGE_WALLET_BUTTON')}
          </BackButton>
          {!wallet && (
            <Step
              wallet={WALLETS_CONFIG[walletId]}
              onUnlock={onUnlock}
              formData={defaultFormData}
            />
          )}
        </>
      ) : (
        <WalletList wallets={getStories()} onSelect={onSelect} />
      )}

      {wallet && (
        <>
          <InputField
            value={message}
            label={translate('MSG_MESSAGE')}
            placeholder={translateRaw('SIGN_MSG_PLACEHOLDER')}
            textarea={true}
            onChange={(event) => updateMessage(event.target.value)}
            height="150px"
            inputError={error}
          />
          <SignButton
            disabled={!message || isDemoMode}
            onClick={handleSignMessage}
            loading={status === 'SIGN_REQUEST'}
          >
            {status === 'SIGN_REQUEST' ? translate('SUBMITTING') : translate('NAV_SIGNMSG')}
          </SignButton>
          {status === 'SIGN_SUCCESS' && (
            <Box mt="10px" width="100%">
              <SignedMessageLabel>{translate('MSG_SIGNATURE')}</SignedMessageLabel>
              <Box width="100%">
                <CodeBlock>{JSON.stringify(signedMessage, null, 2)}</CodeBlock>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

const mapStateToProps = (state: AppState) => ({
  isDemoMode: getIsDemoMode(state),
  status: selectSignMessageStatus(state),
  error: selectSignMessageError(state),
  signedMessage: selectSignedMessage(state),
  message: selectMessage(state),
  walletId: selectWalletId(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      walletUnlock,
      signMessageReset,
      updateMessage,
      walletSelect,
      signMessage
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector> & SignProps;

export default connector(SignMessage);
