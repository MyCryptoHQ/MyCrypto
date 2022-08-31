import { useState } from 'react';

import { Button as ButtonUI } from '@mycrypto/ui';
import { Wallet } from '@mycrypto/wallets';
import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import backArrowIcon from '@assets/images/icn-back-arrow.svg';
import {
  Box,
  Button,
  CodeBlock,
  DemoGatewayBanner,
  InputField,
  Text,
  WalletList
} from '@components';
import { DEFAULT_NETWORK, WALLETS_CONFIG } from '@config';
import { WalletConnectWallet } from '@services';
import type { IFullWallet } from '@services/WalletService';
import { AppState, getIsDemoMode, getWalletConnection, useSelector } from '@store';
import { BREAK_POINTS } from '@theme';
import translate, { translateRaw } from '@translations';
import { WalletId } from '@types';
import { useUnmount } from '@vendor';

import {
  messageUpdate,
  selectMessage,
  selectSignedMessage,
  selectSignMessageError,
  selectSignMessageStatus,
  selectWalletId,
  signMessage,
  signMessageReset,
  walletSelect
} from './signMessage.slice';
import { getStories } from './stories';

const SignButton = styled(Button)<{ disabled?: boolean }>`
  ${(props) => props.disabled && 'opacity: 0.4;'}

  @media (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    width: 100%;
  }
`;

const BackButton = styled(ButtonUI)<{ marginBottom: boolean }>`
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

interface OwnProps {
  setShowSubtitle(show: boolean): void;
}

function SignMessage({
  setShowSubtitle,
  isDemoMode,
  signedMessage,
  message,
  messageUpdate,
  status,
  error,
  walletSelect,
  walletId,
  signMessageReset,
  signMessage
}: Props & OwnProps) {
  const [wallet, setWallet] = useState<Wallet | IFullWallet | undefined>(undefined);
  const params = useSelector(getWalletConnection(walletId!));

  useUnmount(() => {
    // Kill WalletConnect session
    if (wallet && walletId === WalletId.WALLETCONNECT) {
      (wallet as WalletConnectWallet).kill();
    }
    signMessageReset();
  });

  const onSelect = (walletId: WalletId) => {
    setShowSubtitle(false);
    walletSelect(walletId);
  };

  const onUnlock = (w: Wallet | IFullWallet | IFullWallet[]) => {
    const selectedWallet = Array.isArray(w) ? w[0] : w;
    setWallet(selectedWallet);
  };

  const handleSignMessage = () => {
    if (!wallet || !message) {
      throw Error('[signMessageWorker]: Missing arguments');
    }
    signMessage({ message, wallet });
  };

  const reset = () => {
    signMessageReset();
    setWallet(undefined);
    setShowSubtitle(true);
  };

  const story = getStories().find((x) => x.name === walletId);
  const Step = story && story.steps[0];

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
              walletParams={params}
              onUnlock={onUnlock}
              formData={{
                network: DEFAULT_NETWORK
              }}
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
            onChange={(event) => messageUpdate(event.target.value)}
            height="150px"
            inputError={error && translateRaw('SIGN_MESSAGE_ERROR')}
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
              <Text variant="label">{translate('MSG_SIGNATURE')}</Text>
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
      walletSelect,
      messageUpdate,
      signMessageReset,
      signMessage
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

export default connector(SignMessage);
