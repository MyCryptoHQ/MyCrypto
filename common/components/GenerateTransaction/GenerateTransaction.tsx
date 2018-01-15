import translate from 'translations';
import { WithSigner } from './Container';
import EthTx from 'ethereumjs-tx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getTransaction, isNetworkRequestPending, isValidAmount } from 'selectors/transaction';
import { getWalletType } from 'selectors/wallet';

interface StateProps {
  transaction: EthTx;
  networkRequestPending: boolean;
  isFullTransaction: boolean;
  isWeb3Wallet: boolean;
  validAmount: boolean;
}

class GenerateTransactionClass extends Component<StateProps> {
  public render() {
    const {
      isFullTransaction,
      isWeb3Wallet,
      transaction,
      networkRequestPending,
      validAmount
    } = this.props;
    return (
      <WithSigner
        isWeb3={isWeb3Wallet}
        withSigner={signer => (
          <button
            disabled={!isFullTransaction || networkRequestPending || !validAmount}
            className="btn btn-info btn-block"
            onClick={signer(transaction)}
          >
            {isWeb3Wallet ? translate('Send to MetaMask / Mist') : translate('DEP_signtx')}
          </button>
        )}
      />
    );
  }
}

export const GenerateTransaction = connect((state: AppState) => ({
  ...getTransaction(state),
  networkRequestPending: isNetworkRequestPending(state),
  isWeb3Wallet: getWalletType(state).isWeb3Wallet,
  validAmount: isValidAmount(state)
}))(GenerateTransactionClass);
