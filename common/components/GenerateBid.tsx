import EthTx from 'ethereumjs-tx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getTransaction, isNetworkRequestPending } from 'selectors/transaction';
import { getWalletType } from 'selectors/wallet';
import { placeBidRequested } from 'actions/ens';

type Callback = () => any;

interface Props {
  // MapState
  transaction: EthTx;
  isFullTransaction: boolean;
  networkRequestPending: boolean;
  isWeb3Wallet: boolean;
  domainRequest;
  // Actions
  placeBidRequested: any;
  // Props
  onComplete?: Callback;
}

class GenerateBidClass extends Component<Props> {
  public onClick = () => {
    const { onComplete, domainRequest, transaction } = this.props;
    if (onComplete) {
      // onComplete();
    }
    this.props.placeBidRequested(domainRequest, transaction.value);
  };
  public render() {
    // const { isFullTransaction, networkRequestPending } = this.props;
    return (
      <button
        // disabled={!isFullTransaction || networkRequestPending}
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
    isWeb3Wallet: getWalletType(state).isWeb3Wallet,
    domainRequest: state.ens.domainRequests
  };
};

export const GenerateBid = connect(mapStateToProps, { placeBidRequested })(GenerateBidClass);
