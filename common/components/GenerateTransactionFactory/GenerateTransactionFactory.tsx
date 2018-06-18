import React, { Component } from 'react';
import { connect } from 'react-redux';
import EthTx from 'ethereumjs-tx';
import { addHexPrefix } from 'ethereumjs-util';

import translate from 'translations';
import { getTransactionFields, makeTransaction } from 'libs/transaction';
import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import {
  transactionNetworkSelectors,
  transactionSignSelectors,
  transactionSelectors
} from 'features/transaction';
import { walletSelectors } from 'features/wallet';
import { OfflineBroadcast } from 'components/SendButtonFactory/OfflineBroadcast';
import { CodeBlock } from 'components/ui';
import { WithSigner } from './Container';

export interface CallbackProps {
  disabled: boolean;
  isWeb3Wallet: boolean;
  onClick(): void;
}

interface StateProps {
  transaction: EthTx;
  walletType: walletSelectors.IWalletType;
  serializedTransaction: AppState['transaction']['sign']['local']['signedTransaction'];
  networkRequestPending: boolean;
  isFullTransaction: boolean;
  isWeb3Wallet: boolean;
  validGasPrice: boolean;
  validGasLimit: boolean;
  signedTx: boolean;
}

interface OwnProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = OwnProps & StateProps;

export class GenerateTransactionFactoryClass extends Component<Props> {
  public render() {
    const {
      walletType,
      serializedTransaction,
      isFullTransaction,
      isWeb3Wallet,
      networkRequestPending,
      validGasPrice,
      validGasLimit,
      transaction,
      signedTx
    } = this.props;

    const getStringifiedTx = (serializedTx: Buffer) =>
      JSON.stringify(getTransactionFields(makeTransaction(serializedTx)), null, 2);

    const isButtonDisabled =
      !isFullTransaction || networkRequestPending || !validGasPrice || !validGasLimit;

    return (
      <React.Fragment>
        <WithSigner
          isWeb3={isWeb3Wallet}
          withSigner={signer =>
            this.props.withProps({
              disabled: isButtonDisabled,
              isWeb3Wallet,
              onClick: () => signer(transaction)
            })
          }
        />
        {signedTx && (
          <React.Fragment>
            {/* shows the json representation of the transaction */}
            <div className="col-xs-12">
              <label>
                {walletType.isWeb3Wallet ? 'Transaction Parameters' : translate('SEND_RAW')}
              </label>
              <CodeBlock>{getStringifiedTx(serializedTransaction as Buffer)}</CodeBlock>
            </div>
            {serializedTransaction && (
              <div className="col-xs-12">
                <label>
                  {walletType.isWeb3Wallet
                    ? 'Serialized Transaction Parameters'
                    : translate('SEND_SIGNED')}
                </label>
                <CodeBlock>{addHexPrefix(serializedTransaction.toString('hex'))}</CodeBlock>
              </div>
            )}
            <OfflineBroadcast />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export const GenerateTransactionFactory = connect((state: AppState) => ({
  ...derivedSelectors.getTransaction(state),
  walletType: walletSelectors.getWalletType(state),
  serializedTransaction: derivedSelectors.getSerializedTransaction(state),
  networkRequestPending: transactionNetworkSelectors.isNetworkRequestPending(state),
  isWeb3Wallet: walletSelectors.getWalletType(state).isWeb3Wallet,
  validGasPrice: transactionSelectors.isValidGasPrice(state),
  validGasLimit: transactionSelectors.isValidGasLimit(state),
  signedTx: !!transactionSignSelectors.getSignedTx(state)
}))(GenerateTransactionFactoryClass);
