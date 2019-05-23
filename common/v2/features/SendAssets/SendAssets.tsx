// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { isAdvancedQueryTransaction } from 'utils/helpers';
import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';

import {
  ConfirmTransaction,
  SendAssetsForm,
  SignTransaction,
  TransactionReceipt
} from './components';
import { ITxFields, ISendState } from './types';

const getInitialState = (): ISendState => {
  return {
    step: 0,
    transactionFields: {
      senderAddress: '',
      recipientAddress: '',
      amount: '0',
      asset: 'ETH',
      gasPriceSlider: '20',
      gasPriceField: '20',
      gasLimitField: '21000',
      gasLimitEstimated: '21000',
      nonceEstimated: '0',
      nonceField: '0',
      data: '',
      isAdvancedTransaction: isAdvancedQueryTransaction(location.search) || false, // Used to indicate whether transaction fee slider should be displayed and if Advanced Tab fields should be displayed.
      isGasLimitManual: false,
      accountType: undefined
    },
    isFetchingAccountValue: false, // Used to indicate looking up user's balance of currently-selected asset.
    isResolvingNSName: false, // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
    isAddressLabelValid: false, // Used to indicate if recipient-address is found in the address book.
    isFetchingAssetPricing: false, // Used to indicate fetching CC rates for currently-selected asset.
    isEstimatingGasLimit: false, // Used to indicate that gas limit is being estimated using `eth_estimateGas` jsonrpc call.

    resolvedNSAddress: '', // Address returned when attempting to resolve an ENS/RNS address.
    recipientAddressLabel: '', //  Recipient-address label found in address book.
    asset: undefined,
    network: 'ETH',
    assetType: 'base' // Type of asset selected. Directs how rawTransactionValues field are handled when formatting transaction.
  };
};

const steps = [
  { label: 'Send Assets', elem: SendAssetsForm },
  { label: 'Sign Transaction', elem: SignTransaction },
  { label: 'ConfirmTransaction', elem: ConfirmTransaction },
  { label: 'Transaction Complete', elem: TransactionReceipt }
];

export class SendAssets extends Component<RouteComponentProps<{}>> {
  public state: ISendState = getInitialState();

  public render() {
    const { step } = this.state;
    const Step = steps[step];
    return (
      <Layout className="SendAssets" centered={true}>
        <ContentPanel
          onBack={this.goToPrevStep}
          className="SendAssets"
          heading={Step.label}
          icon={sendIcon}
          stepper={{ current: step + 1, total: steps.length - 1 }}
        >
          <Step.elem
            transactionFields={this.state.transactionFields}
            onNext={this.goToNextStep}
            updateState={this.updateState}
            onSubmit={this.updateTransactionFields}
            stateValues={this.state}
          />
        </ContentPanel>
      </Layout>
    );
  }

  private goToNextStep = () =>
    this.setState((prevState: ISendState) => ({
      step: Math.min(prevState.step + 1, steps.length - 1)
    }));

  private goToPrevStep = () =>
    this.setState((prevState: ISendState) => ({
      step: Math.max(0, prevState.step - 1)
    }));

  private updateTransactionFields = (transactionFields: ITxFields) => {
    this.setState({
      transactionFields: { ...this.state.transactionFields, ...transactionFields }
    });
  };

  private updateState = (state: ISendState) => {
    this.setState({
      transactionFields: { ...this.state.transactionFields, ...state.transactionFields }
    });
  };

  // private handleReset = () => this.setState(getInitialState());
}

export default withRouter(SendAssets);
