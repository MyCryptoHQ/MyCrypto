import React, { Component } from 'react';
import { connect } from 'react-redux';
import EthTx from 'ethereumjs-tx';
import { getTransactionFields } from 'libs/transaction';
import {
  estimateGasRequested,
  TEstimateGasRequested
} from 'actions/transaction';

type Estimate = (transaction: EthTx) => void;

interface Props {
  estimateGasRequested: TEstimateGasRequested;
  withEstimate({
    estimate
  }: {
    estimate: Estimate;
  }): React.ReactElement<any> | null;
}

class EstimateGasClass extends Component<Props, {}> {
  public render() {
    return this.props.withEstimate({ estimate: this.estimate });
  }
  private estimate = (transaction: EthTx): void => {
    // dont need gasLimit
    const {
      gasLimit,
      gasPrice,
      nonce,
      chainId,
      ...rest
    } = getTransactionFields(transaction);
    this.props.estimateGasRequested(rest);
  };
}

export const EstimateGas = connect(null, { estimateGasRequested })(
  EstimateGasClass
);
