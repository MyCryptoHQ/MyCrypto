import React, { Component } from 'react';
import { toBuffer } from 'ethereumjs-util';
import { Button, Identicon } from '@mycrypto/ui';
import { Transaction as EthTx } from 'ethereumjs-tx';
import styled from 'styled-components';

import translate, { translateRaw } from 'v2/translations';
import { InputField, QRCode, CodeBlock, NetworkSelectDropdown, InlineMessage } from 'v2/components';
import { getTransactionFields, makeTransaction } from 'v2/services/EthService';

interface State {
  userInput: string;
  inputError: string;
  networkSelectError: string;
  stringifiedTransaction: string;
  transaction: EthTx | undefined;
}

interface Props {
  transaction: any;
  signedTransaction: string;
  network: string;
  selectNetwork(network: string): void;
  goToNextStep(): void;
  setTransaction(transaction: EthTx | undefined): void;
  setSignedTransaction(signedTransaction: string): void;
}

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
  color: ${props => props.theme.text};
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

const QRCodeWrapper = styled.div`
  max-width: 15rem;
  margin: 1rem auto;
  width: 100%;
  text-align: center;
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

const getStringifiedTx = (serializedTx: Buffer) =>
  JSON.stringify(getTransactionFields(makeTransaction(serializedTx)), null, 2);

class BroadcastTx extends Component<Props> {
  public state: State = {
    stringifiedTransaction: '',
    userInput: '',
    inputError: '',
    networkSelectError: '',
    transaction: undefined
  };

  public handleSendClicked = () => {
    const { goToNextStep, setTransaction, network } = this.props;
    this.setState({ networkSelectError: '' });
    if (!network) {
      this.setState({ networkSelectError: translateRaw('SELECT_NETWORK_ERROR') });
      return;
    }

    setTransaction(this.state.transaction);
    goToNextStep();
  };

  public render() {
    const { network, selectNetwork } = this.props;
    const { userInput } = this.state;
    const stateTransaction = userInput ? this.state.stringifiedTransaction : '';

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
            onChange={this.handleChange}
            onBlur={this.validateField}
            inputError={!stateTransaction ? this.state.inputError : ''}
          />
          {stateTransaction && <IdenticonIcon address={userInput} />}
        </InputWrapper>
        {stateTransaction && (
          <React.Fragment>
            {this.state.transaction && !this.state.transaction.getChainId() && (
              <NetworkSelectWrapper>
                <NetworkSelectDropdown network={network} onChange={selectNetwork} />
                {this.state.networkSelectError && (
                  <InlineMessage>{this.state.networkSelectError}</InlineMessage>
                )}
              </NetworkSelectWrapper>
            )}
            <StyledLabel>{translate('SEND_RAW')}</StyledLabel>
            <CodeBlockWrapper>
              <CodeBlock>{stateTransaction}</CodeBlock>
            </CodeBlockWrapper>
            <SendButton onClick={this.handleSendClicked}>{translateRaw('SEND_TRANS')}</SendButton>
          </React.Fragment>
        )}
        {!stateTransaction && <PlaceholderButton>{translateRaw('SEND_TRANS')}</PlaceholderButton>}
        <QRCodeWrapper>{stateTransaction && <QRCode data={stateTransaction} />}</QRCodeWrapper>
      </ContentWrapper>
    );
  }

  protected validateField = () => {
    const { stringifiedTransaction } = this.state;
    if (!!stringifiedTransaction || !this.state.userInput) {
      this.setState({ inputError: '' });
    } else {
      this.setState({ inputError: translateRaw('BROADCAST_TX_INPUT_ERROR') });
    }
  };

  protected handleChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    const { setSignedTransaction } = this.props;
    const { value } = currentTarget;
    this.setState({ userInput: value, inputError: '', stringifiedTransaction: '' });
    setSignedTransaction(value);

    const bufferTransaction = toBuffer(value);
    const tx = new EthTx(bufferTransaction);
    if (tx.verifySignature()) {
      const stringifiedTransaction = getStringifiedTx(bufferTransaction);
      this.setState({ stringifiedTransaction, transaction: tx });
    }
  };
}

export default BroadcastTx;
