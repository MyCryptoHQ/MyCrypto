import { FunctionComponent, useEffect, useState } from 'react';

import { parse } from 'query-string';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { Button, InputField } from '@components';
import { ProviderHandler } from '@services/EthService';
import { selectDefaultNetwork, useSelector } from '@store';
import { BREAK_POINTS, COLORS } from '@theme';
import translate, { translateRaw } from '@translations';
import { ISignedMessage } from '@types';
import { verifySignedMessage } from '@utils';
import { normalizeJson, normalizeSingleQuotes } from '@utils/normalize';

import { VerifyParams } from './types';

const { SCREEN_XS } = BREAK_POINTS;
const { WHITE, SUCCESS_GREEN } = COLORS;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VerifyButton = styled(Button)`
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
  const [loading, setLoading] = useState<boolean>(false);
  const network = useSelector(selectDefaultNetwork);
  const provider = new ProviderHandler(network);

  const handleClick = () => handleVerifySignedMessage();

  const handleVerifySignedMessage = async (
    json?: string,
    trySingleQuotes?: boolean
  ): Promise<void> => {
    const rawMessage = json ?? message;
    setLoading(true);

    try {
      const normalizedMessage = trySingleQuotes ? normalizeSingleQuotes(rawMessage) : rawMessage;
      const parsedSignature: ISignedMessage = normalizeJson(normalizedMessage);

      const isValid = verifySignedMessage(parsedSignature);
      const isValidEIP1271 = !isValid && (await provider.isValidEIP1271Signature(parsedSignature));
      if (!isValid && !isValidEIP1271) {
        throw Error();
      }

      setError(undefined);
      setSignedMessage(parsedSignature);
    } catch (err) {
      if (!trySingleQuotes) {
        return handleVerifySignedMessage(rawMessage, true);
      }

      setError(translateRaw('ERROR_38'));
      setSignedMessage(null);
    } finally {
      setLoading(false);
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
      <VerifyButton disabled={!message} loading={loading} onClick={handleClick}>
        {translate('MSG_VERIFY')}
      </VerifyButton>
      {signedMessage && (
        <SignedMessage data-testid="sign-result">
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
