import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import { headings, steps } from './constants';
import './SendAssets.scss';

// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';

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

const getInitialState = (): State => ({
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
});

export class SendAssets extends Component<RouteComponentProps<{}>> {
  public state: State = getInitialState();

  public render() {
    const { history } = this.props;
    const { step, transaction } = this.state;
    const backOptions = [history.goBack, this.regressStep];
    // Step 3, ConfirmTransaction, cannot go back (as backOptions[2] is undefined)
    const onBack = backOptions[step];
    const Step = steps[step];

    return (
      <Layout className="SendAssets" centered={true}>
        <ContentPanel
          onBack={onBack}
          className="SendAssets-panel"
          heading={headings[step]}
          icon={sendIcon}
          stepper={{
            current: step + 1,
            total: steps.length
          }}
        >
          <Step
            transaction={transaction}
            onNext={this.advanceStep}
            onSubmit={this.updateTransaction}
            onReset={this.handleReset}
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

  private handleReset = () => this.setState(getInitialState());
}

export default withRouter(SendAssets);
