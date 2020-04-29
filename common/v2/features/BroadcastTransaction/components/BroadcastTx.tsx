import React, { useCallback, useState } from 'react';
import { Button, Identicon } from '@mycrypto/ui';
import { Transaction as EthTx } from 'ethereumjs-tx';
import styled from 'styled-components';
import { parseTransaction, Transaction } from 'ethers/utils';
import { toBuffer } from 'ethereumjs-util';

import translate, { translateRaw } from 'v2/translations';
import { InputField, CodeBlock, NetworkSelectDropdown, InlineMessage } from 'v2/components';
import { getTransactionFields } from 'v2/services/EthService';
import { NetworkId, ITxSigned } from 'v2/types';
import { DEFAULT_NETWORK } from '../../../config';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.5;
  font-weight: normal;
  text-align: center;
  color: ${(props) => props.theme.text};
  white-space: pre-line;

  strong {
    font-weight: 900;
  }

  @media (max-width: 700px) {
    padding: 0 8px;
  }
`;

const InputWrapper = styled.div`
  margin-top: 30px;
  width: 100%;
  display: flex;
  align-items: center;
`;

const PlaceholderButton = styled(Button)`
  opacity: 0.4;
  margin-top: 20px;
  cursor: default;
`;

const SendButton = styled(Button)`
  width: 100%;
`;

const CodeBlockWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  max-width: 510px;
  overflow-x: auto;
`;

const IdenticonIcon = styled(Identicon)`
  margin-left: 12px;
  margin-top: 8px;

  img {
    width: 48px;
    height: 48px;
    max-width: none;
  }
`;

const StyledLabel = styled.label`
  margin-top: 8px;
`;

const NetworkSelectWrapper = styled.div`
  width: 100%;
`;

const getStringifiedTx = (tx: EthTx) => JSON.stringify(getTransactionFields(tx), null, 2);

const makeTxFromSignedTx = (signedTransaction: string) => {
  try {
    const bufferTransaction = toBuffer(signedTransaction);
    const decoded: Transaction = parseTransaction(bufferTransaction);
    const transaction = new EthTx(bufferTransaction, { chain: decoded.chainId });
    return transaction;
  } catch (err) {
    console.debug(`[BroadcastTx] ${err}`);
    return undefined;
  }
};

interface Props {
  signedTx: ITxSigned;
  transaction: EthTx | undefined;
  onComplete(payload: { signedTx: string; networkId: NetworkId }): void;
}

const BroadcastTx = ({ signedTx, onComplete }: Props) => {
  const [networkId, setNetworkId] = useState(DEFAULT_NETWORK);
  const [userInput, setUserInput] = useState(signedTx);
  const [inputError, setInputError] = useState('');
  const [transaction, setTransaction] = useState<EthTx | undefined>(makeTxFromSignedTx(signedTx));

  const validateField = () => {
    if ((transaction && transaction.verifySignature()) || !userInput) {
      setInputError('');
    } else {
      setInputError(translateRaw('BROADCAST_TX_INPUT_ERROR'));
    }
  };

  const handleChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    const { value } = currentTarget;
    const trimmedValue = value.trim();
    setUserInput(value);
    setInputError('');
    setTransaction(makeTxFromSignedTx(trimmedValue));
  };

  const onSend = useCallback(async () => {
    await onComplete({
      signedTx: userInput.trim(),
      networkId
    });
  }, [userInput, networkId]);

  return (
    <ContentWrapper>
      <Description>{translate('BROADCAST_TX_DESCRIPTION')}</Description>
      <InputWrapper>
        <InputField
          label={translateRaw('SEND_SIGNED')}
          value={userInput}
          textarea={true}
          height={'250px'}
          placeholder="0xf86b0284ee6b2800825208944bbeeb066ed09b7aed07bf39eee0460dfa26152088016345785d8a00008029a03ba7a0cc6d1756cd771f2119cf688b6d4dc9d37096089f0331fe0de0d1cc1254a02f7bcd19854c8d46f8de09e457aec25b127ab4328e1c0d24bfbff8702ee1f474"
          onChange={handleChange}
          onBlur={validateField}
          inputError={!transaction ? inputError : ''}
        />
        {transaction && <IdenticonIcon address={userInput} />}
      </InputWrapper>
      {transaction ? (
        <React.Fragment>
          {!transaction.getChainId() && (
            <NetworkSelectWrapper>
              <NetworkSelectDropdown network={networkId} onChange={setNetworkId} />
              {!networkId && (
                <InlineMessage>{translate('BROADCAST_TX_INVALID_CHAIN_ID')}</InlineMessage>
              )}
            </NetworkSelectWrapper>
          )}
          <StyledLabel>{translate('SEND_RAW')}</StyledLabel>
          <CodeBlockWrapper>
            <CodeBlock>{getStringifiedTx(transaction)}</CodeBlock>
          </CodeBlockWrapper>
          <SendButton onClick={onSend}>{translateRaw('SEND_TRANS')}</SendButton>
        </React.Fragment>
      ) : (
        <PlaceholderButton>{translateRaw('SEND_TRANS')}</PlaceholderButton>
      )}
    </ContentWrapper>
  );
};

export default BroadcastTx;
