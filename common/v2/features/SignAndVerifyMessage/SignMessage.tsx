import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { InputField, CodeBlock } from 'v2/components';
import { BREAK_POINTS } from 'v2/theme';
import { translate, translateRaw } from 'translations';
import { ISignedMessage } from 'v2/types';

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

const signatureExample: ISignedMessage = {
  address: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  msg: 'asdfasdfasdf',
  sig: '0x4771d78f13ba...',
  version: '2'
};

export default function SignMessage() {
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

  return (
    <Content>
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
    </Content>
  );
}
