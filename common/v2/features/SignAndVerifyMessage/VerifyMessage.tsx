import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { InputField } from 'v2/components';
import { verifySignedMessage, ISignedMessage } from 'libs/signing';
import { BREAK_POINTS, COLORS } from 'v2/theme';
import { translate, translateRaw } from 'translations';

const { SCREEN_XS } = BREAK_POINTS;
const { WHITE, SUCCESS_GREEN } = COLORS;

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

const SignedMessage = styled.div`
  margin-top: 15px;
  padding: 15px;
  color: ${WHITE};
  font-size: 16px;
  background-color: ${SUCCESS_GREEN};
`;

const signatureExample: ISignedMessage = {
  address: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  msg: 'asdfasdfasdf',
  sig: '0x4771d78f13ba...',
  version: '2'
};
const signaturePlaceholder = JSON.stringify(signatureExample, null, 2);

export default function VerifyMessage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [signedMessage, setSignedMessage] = useState<ISignedMessage | null>(null);

  const handleVerifySignedMessage = () => {
    try {
      const parsedSignature: ISignedMessage = JSON.parse(message);
      const isValid = verifySignedMessage(parsedSignature);

      if (!isValid) {
        throw Error();
      }

      setError(undefined);
      setSignedMessage(parsedSignature);
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
        label={translate('MSG_SIGNATURE')}
        placeholder={signaturePlaceholder}
        textarea={true}
        onChange={event => handleOnChange(event.target.value)}
        height="150px"
        inputError={error}
      />
      <VerifyButton disabled={!message} onClick={handleVerifySignedMessage}>
        {translate('MSG_VERIFY')}
      </VerifyButton>
      {signedMessage && (
        <SignedMessage>
          {translate('VERIFY_MESSAGE_SIGNED', {
            $address: signedMessage.address,
            $msg: signedMessage.msg
          })}
        </SignedMessage>
      )}
    </Content>
  );
}
