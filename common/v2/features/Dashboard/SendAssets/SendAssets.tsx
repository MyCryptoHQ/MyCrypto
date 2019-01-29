import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ContentPanel, Layout } from 'v2/components';
import { headings, steps } from './constants';
import './SendAssets.scss';

export interface Transaction {
  senderAddress: string;
  recipientAddress: string;
  amount: string;
  asset: string;
  transactionFee: string;
  advancedMode: boolean;
  automaticallyCalculateGasLimit: boolean;
  gasPrice: string;
  gasLimit: string;
  nonce: string;
  data: string;
}

interface State {
  step: number;
  transaction: Transaction;
}

export class SendAssets extends Component<RouteComponentProps<{}>> {
  public state: State = {
    step: 0,
    transaction: {
      senderAddress: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      recipientAddress: '0x80200997f095da94E404F7E0d581AAb1fFba9f7d',
      amount: '0.00',
      asset: 'ETH',
      transactionFee: '',
      advancedMode: false,
      automaticallyCalculateGasLimit: true,
      gasPrice: '',
      gasLimit: '',
      nonce: '',
      data: ''
    }
  };

  public render() {
    const { history } = this.props;
    const { step, transaction } = this.state;
    const onBack = step === 0 ? history.goBack : this.regressStep;
    const Step = steps[step];

    return (
      <Layout className="SendAssets" centered={true}>
        <ContentPanel
          onBack={onBack}
          className="SendAssets-panel"
          heading={headings[step]}
          stepper={{
            current: step + 1,
            total: steps.length
          }}
        >
          <Step
            transaction={transaction}
            onNext={this.advanceStep}
            onSubmit={this.updateTransaction}
          />
        </ContentPanel>
      </Layout>
    );
  }

  private advanceStep = () =>
    this.setState((prevState: State) => ({
      step: Math.min(prevState.step + 1, steps.length - 1)
    }));

  private regressStep = () =>
    this.setState((prevState: State) => ({
      step: Math.min(0, prevState.step - 1)
    }));

  private updateTransaction = (transaction: Transaction) =>
    this.setState({
      transaction
    });
}

export default withRouter(SendAssets);
