import React, { FunctionComponent, useEffect, useState } from 'react';

import { Button } from '@mycrypto/ui';
import { parse } from 'query-string';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { InputField } from '@components';
import { VerifyParams } from '@features/SignAndVerifyMessage/types';
import { verifySignedMessage } from '@services/EthService';
import { BREAK_POINTS, COLORS } from '@theme';
import translate, { translateRaw } from '@translations';
import { ISignedMessage } from '@types';

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
  ${(props) => props.disabled && 'opacity: 0.4;'}

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
  width: 100%;
  overflow: auto;
`;

const signatureExample: ISignedMessage = {
  address: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  msg: 'asdfasdfasdf',
  sig: '0x4771d78f13ba...',
  version: '2'
};
const signaturePlaceholder = JSON.stringify(signatureExample, null, 2);

interface Props {
  setShowSubtitle(show: boolean): void;
}

const VerifyMessage: FunctionComponent<RouteComponentProps & Props> = ({ location }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [signedMessage, setSignedMessage] = useState<ISignedMessage | null>(null);

  const handleClick = () => handleVerifySignedMessage();

  const handleVerifySignedMessage = (json?: string) => {
    try {
      const parsedSignature: ISignedMessage = JSON.parse(json ?? message);
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

  useEffect(() => {
    const { address, message: queryMessage, signature } = parse(location.search) as {
      [key in VerifyParams]?: string;
    };

    if (address && queryMessage && signature) {
      const json = JSON.stringify(
        {
          address,
          msg: queryMessage,
          sig: signature,
          version: '2'
        },
        null,
        2
      );

      setMessage(json);
      handleVerifySignedMessage(json);
    }
  }, []);

  return (
    <Content>
      <InputField
        value={message}
        label={translate('MSG_SIGNATURE')}
        placeholder={signaturePlaceholder}
        textarea={true}
        onChange={(event) => handleOnChange(event.target.value)}
        height="150px"
        inputError={error}
      />
      <VerifyButton disabled={!message} onClick={handleClick}>
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
};

export default withRouter(VerifyMessage);
