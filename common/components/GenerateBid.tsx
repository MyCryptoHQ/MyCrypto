import EthTx from 'ethereumjs-tx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getTransaction, isNetworkRequestPending } from 'selectors/transaction';
import { getWalletType } from 'selectors/wallet';

type Callback = () => void;

interface Props {
  // MapState
  transaction: EthTx;
  isFullTransaction: boolean;
  networkRequestPending: boolean;
  isWeb3Wallet: boolean;
  // Props
  onComplete?: Callback;
}

class GenerateBidClass extends Component<Props> {
  public onClick = () => {
    const { onComplete } = this.props;
    if (onComplete) {
      onComplete();
    }
  };
  public render() {
    return (
      <button className="btn btn-info btn-block" onClick={this.onClick}>
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

export const GenerateBid = connect(mapStateToProps)(GenerateBidClass);
