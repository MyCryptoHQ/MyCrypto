import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { toBuffer, bufferToHex } from 'ethereumjs-util';
import EthTx from 'ethereumjs-tx';
import styled from 'styled-components';

import translate, { translateRaw } from 'translations';
import { computeIndexingHash, getTransactionFields, makeTransaction } from 'libs/transaction';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { transactionSignActions } from 'features/transaction';
import { SendButton } from 'components/SendButton';

import { ExtendedContentPanel, InputField, QRCode, CodeBlock } from 'v2/components';
import { Button, Identicon } from '@mycrypto/ui';

interface StateProps {
  stateTransaction: AppState['transaction']['sign']['local']['signedTransaction'];
}
interface DispatchProps {
  signLocalTransactionSucceeded: transactionSignActions.TSignLocalTransactionSucceeded;
  signTransactionFailed: transactionSignActions.TSignTransactionFailed;
}
interface State {
  userInput: string;
  inputError: string;
}
const INITIAL_STATE: State = { userInput: '', inputError: '' };

type Props = DispatchProps & StateProps & RouteComponentProps<{}>;

const getStringifiedTx = (serializedTx: Buffer) =>
  JSON.stringify(getTransactionFields(makeTransaction(serializedTx)), null, 2);

const InputWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  align-items: center;
`;

const PlaceholderButton = styled(Button)`
  opacity: 0.4;
  margin-top: 20px;
  cursor: default;
`;

const CodeBlockWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  max-width: 510px;
  overflow-x: auto;
`;

const QRCodeWrapper = styled.div`
   {
    max-width: 15rem;
    margin: 1rem auto;
    width: 100%;
    text-align: center;
  }
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
class BroadcastTx extends Component<Props> {
  public state: State = INITIAL_STATE;

  public render() {
    const { userInput } = this.state;
    const stateTransaction = userInput ? this.props.stateTransaction : '';

    return (
      <ExtendedContentPanel
        heading={translateRaw('BROADCAST_TX_TITLE')}
        description={translate('BROADCAST_TX_DESCRIPTION')}
        centered={true}
        width="650px"
      >
        <InputWrapper>
          <InputField
            label={translateRaw('SEND_SIGNED')}
            value={userInput}
            placeholder="0xf86b0284ee6b2800825208944bbeeb066ed09b7aed07bf39eee0460dfa26152088016345785d8a00008029a03ba7a0cc6d1756cd771f2119cf688b6d4dc9d37096089f0331fe0de0d1cc1254a02f7bcd19854c8d46f8de09e457aec25b127ab4328e1c0d24bfbff8702ee1f474"
            onChange={this.handleChange}
            onBlur={this.validateField}
            inputError={!stateTransaction ? this.state.inputError : ''}
          />

          {stateTransaction && <IdenticonIcon address={userInput} />}
        </InputWrapper>

        {stateTransaction && (
          <React.Fragment>
            <label>{translate('SEND_RAW')}</label>
            <CodeBlockWrapper>
              <CodeBlock>{getStringifiedTx(stateTransaction)}</CodeBlock>
            </CodeBlockWrapper>
            <SendButton />
          </React.Fragment>
        )}

        {!stateTransaction && <PlaceholderButton>{translateRaw('SEND_TRANS')}</PlaceholderButton>}
        <QRCodeWrapper>
          {stateTransaction && <QRCode data={bufferToHex(stateTransaction)} />}
        </QRCodeWrapper>
      </ExtendedContentPanel>
    );
  }

  protected validateField = () => {
    const { stateTransaction } = this.props;
    if (!!stateTransaction || !this.state.userInput) {
      this.setState({ inputError: '' });
    } else {
      this.setState({ inputError: translateRaw('BROADCAST_TX_INPUT_ERROR') });
    }
  };

  protected handleChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    const { value } = currentTarget;
    this.setState({ userInput: value, inputError: '' });

    try {
      const bufferTransaction = toBuffer(value);
      const tx = new EthTx(bufferTransaction);
      if (!tx.verifySignature()) {
        throw Error();
      }
      const indexingHash = computeIndexingHash(bufferTransaction);
      this.props.signLocalTransactionSucceeded({
        signedTransaction: bufferTransaction,
        indexingHash,
        noVerify: true
      });
    } catch {
      this.props.signTransactionFailed();
    }
  };
}

export default connect(
  (state: AppState) => ({ stateTransaction: selectors.getSerializedTransaction(state) }),
  {
    signLocalTransactionSucceeded: transactionSignActions.signLocalTransactionSucceeded,
    signTransactionFailed: transactionSignActions.signTransactionFailed
  }
)(BroadcastTx);
