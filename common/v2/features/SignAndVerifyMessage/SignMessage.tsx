import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { InputField, CodeBlock, WalletList } from 'v2/components';
import { BREAK_POINTS } from 'v2/theme';
import { translate, translateRaw } from 'translations';
import { ISignedMessage } from 'v2/types';
import { STORIES } from './stories';
import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

const { SCREEN_XS } = BREAK_POINTS;

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

const BackButton = styled(Button)`
  align-self: flex-start;
  color: #007a99;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 20px;
  img {
    margin-right: 8px;
  }
`;

const signatureExample: ISignedMessage = {
  address: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  msg: 'asdfasdfasdf',
  sig: '0x4771d78f13ba...',
  version: '2'
};

export default function SignMessage() {
  const [walletName, setWalletName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [signedMessage, setSignedMessage] = useState<ISignedMessage | null>(null);

  const handleSignMessage = () => {
    try {
      setError(undefined);
      // TODO: call correct sign function depending on wallet selection
      setSignedMessage(signatureExample);
    } catch (err) {
      setError(translateRaw('ERROR_38'));
      setSignedMessage(null);
    }
  };

  const handleOnChange = (msg: string) => {
    setMessage(msg);
    setError(undefined);
    setSignedMessage(null);
  };

  const onSelect = (selectedWalletName: string) => {
    setWalletName(selectedWalletName);
  };

  const story = STORIES.find(x => x.name === walletName);
  const Step = story && story.steps[0];

  //TODO: Read unlocked value from redux
  const unlocked = false;

  return (
    <Content>
      {walletName ? (
        <>
          <BackButton basic={true} onClick={() => setWalletName('')}>
            <img src={backArrowIcon} alt="Back arrow" />
            Change Wallet
          </BackButton>
          {Step && <Step />}
        </>
      ) : (
        <WalletList wallets={STORIES} onSelect={onSelect} />
      )}

      {unlocked && walletName && (
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
          <SignButton disabled={!message} onClick={handleSignMessage}>
            {translate('NAV_SIGNMSG')}
          </SignButton>
          {signedMessage && (
            <SignedMessage>
              <SignedMessageLabel>{translate('MSG_SIGNATURE')}</SignedMessageLabel>
              <CodeBlockWrapper>
                <CodeBlock>{JSON.stringify(signedMessage, null, 2)}</CodeBlock>
              </CodeBlockWrapper>
            </SignedMessage>
          )}
          }
        </>
      )}
    </Content>
  );
}
