import EthTx from 'ethereumjs-tx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getTransaction, isNetworkRequestPending } from 'selectors/transaction';
import { getWalletType } from 'selectors/wallet';
import { bindActionCreators, Dispatch } from 'redux';
import {
  signWeb3TransactionRequested,
  signLocalTransactionRequested,
  SignLocalTransactionRequestedAction,
  SignWeb3TransactionRequestedAction,
  TSignLocalTransactionRequested,
  TSignWeb3TransactionRequested
} from 'actions/transaction';

interface DispatchProps {
  signer: TSignLocalTransactionRequested | TSignWeb3TransactionRequested;
}

type Payload =
  | SignLocalTransactionRequestedAction['payload']
  | SignWeb3TransactionRequestedAction['payload'];
type Signer = (
  payload: Payload
) => () => SignLocalTransactionRequestedAction | SignWeb3TransactionRequestedAction;

type Callback = () => any;

interface Props {
  // MapState
  transaction: EthTx;
  isFullTransaction: boolean;
  networkRequestPending: boolean;
  isWeb3Wallet: boolean;
  // MapDispatch
  signer: Signer;
  // Props
  onComplete?: Callback;
}

class GenerateBidClass extends Component<Props & DispatchProps> {
  public onClick = () => {
    const { signer, transaction, onComplete } = this.props;
    if (onComplete) {
      onComplete();
    }
    signer(transaction);
  };
  public render() {
    const { isFullTransaction, networkRequestPending } = this.props;
    return (
      <button
        disabled={!isFullTransaction || networkRequestPending}
        className="btn btn-info btn-block"
        onClick={this.onClick}
      >
        Place A Bid
      </button>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    ...getTransaction(state),
    networkRequestPending: isNetworkRequestPending(state),
    isWeb3Wallet: getWalletType(state).isWeb3Wallet
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AppState>, props: Props) => {
  return bindActionCreators(
    { signer: props.isWeb3Wallet ? signWeb3TransactionRequested : signLocalTransactionRequested },
    dispatch
  );
};

export const GenerateBid = connect(mapStateToProps, mapDispatchToProps)(GenerateBidClass);
