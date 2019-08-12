import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { InputField } from 'v2/components';
import { BREAK_POINTS } from 'v2/theme';
import { translate, translateRaw } from 'translations';
import { ISignedMessage } from 'v2/types';

const { SCREEN_XS } = BREAK_POINTS;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface VerifyButtonProps {
  disabled?: boolean;
}
const VerifyButton = styled(Button)<VerifyButtonProps>`
  ${props => props.disabled && 'opacity: 0.4;'}

  @media (max-width: ${SCREEN_XS}) {
    width: 100%;
  }
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
      <VerifyButton disabled={!message} onClick={handleSignMessage}>
        {translate('NAV_SIGNMSG')}
      </VerifyButton>
      {signedMessage && (
        <InputField
          value={JSON.stringify(signedMessage, null, 2)}
          label={translate('MSG_SIGNATURE')}
          textarea={true}
          onChange={event => handleOnChange(event.target.value)}
          height="150px"
        />
      )}
    </Content>
  );
}
