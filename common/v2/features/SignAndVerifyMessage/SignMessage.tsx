import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { InputField, CodeBlock, WalletList } from 'v2/components';
import { BREAK_POINTS } from 'v2/theme';
import { translate, translateRaw } from 'translations';
import {
  ISignedMessage,
  WalletName,
  SecureWalletName,
  INode,
  FormData,
  walletNames
} from 'v2/types';
import { STORIES } from './stories';
import { WALLET_INFO } from 'v2/config';
import { AppState } from 'features/reducers';
import { setupWeb3Node } from 'v2/services/EthService';
import { IFullWallet } from 'v2/services/WalletService';
import { messageToData } from 'features/message/sagas';
import { paritySignerActions } from 'features/paritySigner';

import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

const { SCREEN_XS } = BREAK_POINTS;

export const defaultFormData: FormData = {
  network: 'Ethereum',
  accountType: walletNames.DEFAULT,
  account: '',
  label: 'New Account',
  derivationPath: ''
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

const BackButton = styled(Button)<BackButtonProps>`
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

interface DispatchProps {
  requestParityMessageSignature: paritySignerActions.TRequestMessageSignature;
}

interface StateProps {
  paritySig: string;
  setShowSubtitle(show: boolean): void;
}

type Props = DispatchProps & StateProps;

function SignMessage(props: Props) {
  const [walletName, setWalletName] = useState<WalletName | undefined>(undefined);
  const [wallet, setWallet] = useState<IFullWallet | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [signedMessage, setSignedMessage] = useState<ISignedMessage | null>(null);

  const { setShowSubtitle } = props;

  useEffect(() => {
    if (props.paritySig && signedMessage && walletName === SecureWalletName.PARITY_SIGNER) {
      setSignedMessage({ ...signedMessage, sig: props.paritySig });
      setIsSigned(true);
    }
  }, [props.paritySig]);

  const handleSignMessage = async () => {
    try {
      if (!wallet) {
        throw Error;
      }

      const address = wallet.getAddressString();
      let sig = '';

      if (walletName === SecureWalletName.PARITY_SIGNER) {
        const data = messageToData(message);
        props.requestParityMessageSignature(address, data);
      } else {
        let lib: INode = {} as INode;
        if (walletName === SecureWalletName.WEB3) {
          lib = (await setupWeb3Node()).lib;
        }
        sig = await wallet.signMessage(message, lib);
      }

      const combined = {
        address,
        msg: message,
        sig,
        version: '2'
      };
      setError(undefined);
      setSignedMessage(combined);
      setIsSigned(!!sig);
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

  const onSelect = (selectedWalletName: WalletName) => {
    setWalletName(selectedWalletName);
    setShowSubtitle(false);
  };

  const onUnlock = (selectedWallet: any) => {
    setWallet(selectedWallet);
    setUnlocked(true);
  };

  const resetWalletSelectionAndForm = () => {
    setMessage('');
    setError(undefined);
    setSignedMessage(null);
    setWalletName(undefined);
    setUnlocked(false);
    setIsSigned(false);
    setShowSubtitle(true);
  };

  const story = STORIES.find(x => x.name === walletName);
  const Step = story && story.steps[0];

  return (
    <Content>
      {walletName ? (
        <>
          <BackButton marginBottom={unlocked} basic={true} onClick={resetWalletSelectionAndForm}>
            <img src={backArrowIcon} alt="Back arrow" />
            {translateRaw('CHANGE_WALLET_BUTTON')}
          </BackButton>
          {!unlocked && Step && (
            <Step wallet={WALLET_INFO[walletName]} onUnlock={onUnlock} formData={defaultFormData} />
          )}
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
          {signedMessage && isSigned && (
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
  paritySig: state.paritySigner.sig
});

const mapDispatchToProps = {
  requestParityMessageSignature: paritySignerActions.requestMessageSignature
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignMessage);
