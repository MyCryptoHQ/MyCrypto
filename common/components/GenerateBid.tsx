import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { isNetworkRequestPending, getValue } from 'selectors/transaction';
import { getWalletType } from 'selectors/wallet';
import { placeBidRequested } from 'actions/ens';

type Callback = () => void;

interface Props {
  // MapState
  userInput: {
    bidValue: any;
    bidMask: any;
    secret: any;
  };
  isValid: boolean;
  isFullTransaction: boolean;
  networkRequestPending: boolean;
  isWeb3Wallet: boolean;
  // Actions
  placeBidRequested: any;
  // Props
  onComplete?: Callback;
}

class GenerateBidClass extends Component<Props> {
  public onClick = () => {
    const { onComplete, userInput } = this.props;
    const { bidValue, bidMask, secret } = userInput;
    if (onComplete) {
      onComplete();
    }
    this.props.placeBidRequested(bidValue, bidMask, secret);
  };
  public render() {
    const { isValid, userInput } = this.props;
    console.log(!isValid, !!userInput.bidValue);
    return (
      <button
        className="btn btn-info btn-block"
        onClick={this.onClick}
        // TODO: reformat to remove negative conditions
        disabled={!isValid && !userInput.bidValue}
      >
        Place A Bid
      </button>
    );
  }
}

const mapStateToProps = (state: AppState, props) => {
  return {
    networkRequestPending: isNetworkRequestPending(state),
    isWeb3Wallet: getWalletType(state).isWeb3Wallet,
    userInput: { ...props.userInput, bidValue: getValue(state).value }
  };
};

export const GenerateBid = connect(mapStateToProps, { placeBidRequested })(GenerateBidClass);
