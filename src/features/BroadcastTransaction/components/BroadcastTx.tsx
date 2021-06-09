import React, { useEffect, useState } from 'react';

import { parse as parseTransaction, Transaction } from '@ethersproject/transactions';
import { toBuffer } from 'ethereumjs-util';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import {
  Button,
  CodeBlock,
  InlineMessage,
  InputField,
  Label,
  NetworkSelector,
  Tooltip
} from '@components';
import { verifyTransaction } from '@helpers';
import { AppState } from '@store';
import { getNetwork } from '@store/network.slice';
import translate, { translateRaw } from '@translations';
import { ISignedTx, NetworkId } from '@types';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  label {
    align-self: flex-start;
  }
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

const SendButton = styled(Button)`
  width: 100%;
`;

const CodeBlockWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  overflow-x: auto;
`;

const StyledLabel = styled(Label)`
  align-self: flex-start;
  margin-top: 8px;
`;

const NetworkSelectWrapper = styled.div`
  width: 100%;
`;

const getStringifiedTx = (tx: Transaction) => JSON.stringify(tx, null, 2);

const makeTxFromSignedTx = (signedTransaction: string) => {
  try {
    const bufferTransaction = toBuffer(signedTransaction);
    const decoded: Transaction = parseTransaction(bufferTransaction);
    return decoded;
  } catch (err) {
    console.debug(`[BroadcastTx] ${err}`);
    return undefined;
  }
};

interface Props {
  networkId: NetworkId;
  signedTx: ISignedTx;
  transaction: Transaction | undefined;
  onComplete(signedTx: string): void;
  handleNetworkChanged(network: NetworkId): void;
}

const BroadcastTx = ({
  signedTx,
  networkId,
  onComplete,
  handleNetworkChanged
}: Props & ConnectedProps<typeof connector>) => {
  const [userInput, setUserInput] = useState(signedTx);
  const [inputError, setInputError] = useState('');
  const [transaction, setTransaction] = useState<Transaction | undefined>(
    makeTxFromSignedTx(signedTx)
  );

  useEffect(() => {
    if (transaction && verifyTransaction(transaction)) {
      setInputError('');
    } else {
      setInputError(translateRaw('BROADCAST_TX_INPUT_ERROR'));
    }
  }, [transaction]);

  const handleChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    const { value } = currentTarget;
    const trimmedValue = value.trim();
    setUserInput(value);
    setInputError('');
    setTransaction(makeTxFromSignedTx(trimmedValue));
  };

  const isValid = transaction !== undefined && inputError.length === 0;

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
          inputError={userInput.length > 0 ? inputError : ''}
        />
      </InputWrapper>
      {isValid && (
        <React.Fragment>
          {!transaction!.chainId && (
            <NetworkSelectWrapper>
              <NetworkSelector network={networkId} onChange={handleNetworkChanged} />
              {!networkId && (
                <InlineMessage>{translate('BROADCAST_TX_INVALID_CHAIN_ID')}</InlineMessage>
              )}
            </NetworkSelectWrapper>
          )}
          <StyledLabel>
            {translate('SEND_RAW')}
            <Tooltip tooltip={translateRaw('BROADCAST_TX_RAW_TOOLTIP')} />
          </StyledLabel>
          <CodeBlockWrapper>
            <CodeBlock>{getStringifiedTx(transaction!)}</CodeBlock>
          </CodeBlockWrapper>
        </React.Fragment>
      )}
      <SendButton disabled={!isValid} onClick={() => onComplete(userInput.trim())}>
        {translateRaw('SEND_TRANS')}
      </SendButton>
    </ContentWrapper>
  );
};

const mapStateToProps = (state: AppState) => ({
  getNetwork: (n: NetworkId) => getNetwork(n)(state)
});

const connector = connect(mapStateToProps);

export default connector(BroadcastTx);
