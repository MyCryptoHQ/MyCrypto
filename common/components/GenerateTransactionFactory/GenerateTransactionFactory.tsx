import { WithSigner } from './Container';
import EthTx from 'ethereumjs-tx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getTransaction, isNetworkRequestPending } from 'selectors/transaction';
import { getWalletType } from 'selectors/wallet';

export interface CallbackProps {
  disabled: boolean;
  isWeb3Wallet: boolean;
  onClick(): void;
}

interface StateProps {
  transaction: EthTx;
  networkRequestPending: boolean;
  isFullTransaction: boolean;
  isWeb3Wallet: boolean;
}

interface OwnProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = OwnProps & StateProps;

class GenerateTransactionFactoryClass extends Component<Props> {
  public render() {
    const { isFullTransaction, isWeb3Wallet, transaction, networkRequestPending } = this.props;

    return (
      <WithSigner
        isWeb3={isWeb3Wallet}
        withSigner={signer => {
          const disabled = !isFullTransaction || !!networkRequestPending;
          const onClick = () => signer(transaction);

          return this.props.withProps({
            disabled,
            isWeb3Wallet,
            onClick
          });
        }}
      />
    );
  }
}

export const GenerateTransactionFactory = connect((state: AppState) => ({
  ...getTransaction(state),
  networkRequestPending: isNetworkRequestPending(state),
  isWeb3Wallet: getWalletType(state).isWeb3Wallet
}))(GenerateTransactionFactoryClass);
