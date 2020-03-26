import React, { useState } from 'react';
import styled from 'styled-components';
import { Button as ButtonUI } from '@mycrypto/ui';
import { toChecksumAddress } from 'ethereumjs-util';

import { InputField, CodeBlock, WalletList, Button } from 'v2/components';
import { BREAK_POINTS } from 'v2/theme';
import translate, { translateRaw } from 'v2/translations';
import { ISignedMessage, INode, FormData, WalletId } from 'v2/types';
import { WALLETS_CONFIG, DEFAULT_NETWORK } from 'v2/config';
import { setupWeb3Node } from 'v2/services/EthService';
import { IFullWallet, withWalletConnect, IUseWalletConnect } from 'v2/services/WalletService';

import { getStories } from './stories';

import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

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
  ${props => props.disabled && 'opacity: 0.4;'}

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
  color: ${props => props.theme.text};
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
  ${props => props.marginBottom && 'margin-bottom: 40px;'}

  img {
    margin-right: 8px;
  }
`;

enum SignStatus {
  NOT_SIGNED,
  SIGNING,
  SIGNED
}

interface Props {
  useWalletConnectProps: IUseWalletConnect;
  setShowSubtitle(show: boolean): void;
}

function SignMessage(props: Props) {
  const [walletName, setWalletName] = useState<WalletId | undefined>(undefined);
  const [wallet, setWallet] = useState<IFullWallet | null>(null);
  const [signStatus, setSignStatus] = useState<SignStatus>(SignStatus.NOT_SIGNED);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [signedMessage, setSignedMessage] = useState<ISignedMessage | null>(null);

  const { setShowSubtitle, useWalletConnectProps } = props;

  const handleSignMessage = async () => {
    setSignStatus(SignStatus.SIGNING);
    try {
      if (!wallet) {
        throw Error;
      }

      const address = toChecksumAddress(wallet.getAddressString());
      let sig = '';

      let lib: INode = {} as INode;
      if (walletName === WalletId.METAMASK) {
        lib = (await setupWeb3Node()).lib;
      }
      sig = await wallet.signMessage(message, lib);

      const combined = {
        address,
        msg: message,
        sig,
        version: '2'
      };
      setError(undefined);
      setSignedMessage(combined);
      setSignStatus(SignStatus.SIGNED);
    } catch (err) {
      setSignStatus(SignStatus.NOT_SIGNED);
      setError(translateRaw('SIGN_MESSAGE_ERROR'));
      console.debug('[SignMessage]', err);
    }
  };

  const handleOnChange = (msg: string) => {
    setMessage(msg);
    setError(undefined);
    setSignStatus(SignStatus.NOT_SIGNED);
  };

  const onSelect = (selectedWalletName: WalletId) => {
    setWalletName(selectedWalletName);
    setShowSubtitle(false);
  };

  const onUnlock = (selectedWallet: any) => {
    setWallet(selectedWallet);
  };

  const resetWalletSelectionAndForm = () => {
    setMessage('');
    setError(undefined);
    setWalletName(undefined);
    setSignStatus(SignStatus.NOT_SIGNED);
    setShowSubtitle(true);
    setWallet(null);
  };

  const story = getStories().find(x => x.name === walletName);
  const Step = story && story.steps[0];

  return (
    <Content>
      {walletName ? (
        <>
          <BackButton marginBottom={!!wallet} basic={true} onClick={resetWalletSelectionAndForm}>
            <img src={backArrowIcon} alt="Back arrow" />
            {translateRaw('CHANGE_WALLET_BUTTON')}
          </BackButton>
          {!wallet && (
            <Step
              wallet={WALLETS_CONFIG[walletName]}
              onUnlock={onUnlock}
              formData={defaultFormData}
              useWalletConnectProps={useWalletConnectProps}
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
            onChange={event => handleOnChange(event.target.value)}
            height="150px"
            inputError={error}
          />
          <SignButton
            disabled={!message}
            onClick={handleSignMessage}
            loading={signStatus === SignStatus.SIGNING}
          >
            {translate('NAV_SIGNMSG')}
          </SignButton>
          {signStatus === SignStatus.SIGNED && (
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

export default withWalletConnect(SignMessage);
