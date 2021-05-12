import React, { useState } from 'react';

import { Button as ButtonUI } from '@mycrypto/ui';
import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { toChecksumAddress } from 'ethereumjs-util';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import backArrowIcon from '@assets/images/icn-back-arrow.svg';
import { Button, CodeBlock, DemoGatewayBanner, InputField, WalletList } from '@components';
import { DEFAULT_NETWORK, WALLETS_CONFIG } from '@config';
import { WalletConnectWallet } from '@services';
import type { IFullWallet } from '@services/WalletService';
import { AppState, getIsDemoMode } from '@store';
import { BREAK_POINTS } from '@theme';
import translate, { translateRaw } from '@translations';
import { FormData, WalletId } from '@types';
import { addHexPrefix } from '@utils';
import { useUnmount } from '@vendor';

import {
  selectMessage,
  selectSignedMessage,
  selectSignMessageError,
  selectSignMessageStatus,
  selectWalletId,
  signMessageFailure,
  signMessageRequest,
  signMessageReset,
  signMessageSuccess,
  updateMessage,
  walletSelect,
  walletUnlock
} from './signMessage.slice';
import { getStories } from './stories';

const { SCREEN_XS } = BREAK_POINTS;

export const defaultFormData: Pick<FormData, 'network'> = {
  network: DEFAULT_NETWORK
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface SignButtonProps {
  disabled?: boolean;
}
const SignButton = styled(Button)<SignButtonProps>`
  ${(props) => props.disabled && 'opacity: 0.4;'}

  @media (max-width: ${SCREEN_XS}) {
    width: 100%;
  }
`;

const SignedMessage = styled.div`
  margin-top: 10px;
  width: 100%;
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

const CodeBlockWrapper = styled.div`
  width: 100%;
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
  signMessageRequest,
  signMessageSuccess,
  signMessageFailure,
  message,
  updateMessage,
  status,
  error,
  signMessageReset,
  walletSelect,
  walletUnlock,
  walletId
}: Props) {
  const [wallet, setWallet] = useState<IFullWallet | undefined>(undefined);
  const handleSignMessage = async () => {
    signMessageRequest();
    try {
      if (!wallet || !walletId || !message) throw Error;

      const address = toChecksumAddress(wallet.getAddressString());

      const sig = await wallet.signMessage(message);
      const final = {
        address,
        msg: message,
        sig: addHexPrefix(sig),
        version: '2'
      };
      signMessageSuccess(final);
    } catch (err) {
      // setError(translateRaw('SIGN_MESSAGE_ERROR'));
      signMessageFailure(err);
      console.debug('[SignMessage]', err);
    }
  };

  const onSelect = (walletId: WalletId) => {
    walletSelect(walletId);
    setShowSubtitle(false);
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
    <Content>
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
            <SignedMessage>
              <SignedMessageLabel>{translate('MSG_SIGNATURE')}</SignedMessageLabel>
              <CodeBlockWrapper>
                <CodeBlock>{JSON.stringify(signedMessage, null, 2)}</CodeBlock>
              </CodeBlockWrapper>
            </SignedMessage>
          )}
        </>
      )}
    </Content>
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
      signMessageRequest,
      signMessageReset,
      signMessageSuccess,
      signMessageFailure,
      updateMessage,
      walletSelect
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector> & SignProps;

export default connector(SignMessage);
