import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import { headings, steps } from './constants';

// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import { AssetOption, assetType } from 'v2/services/AssetOption/types';
import {
  isQueryTransaction,
  getQueryParamWithKey,
  getQueryTransactionData,
  isAdvancedQueryTransaction
} from 'v2/libs/preFillTx';
import { queryObject } from 'v2/libs/preFillTx/types';

export interface TransactionFields {
  asset: string;
  senderAddress: string;
  recipientAddress: string;
  amount: string;
  data: string;
  gasLimitEstimated: string;
  gasPriceSlider: string;
  nonceEstimated: string;
  gasLimitField: string; // Use only if advanced tab is open AND isGasLimitManual is true
  gasPriceField: string; // Use only if advanced tab is open AND user has input gas price
  nonceField: string; // Use only if user has input a manual nonce value.
  isAdvancedTransaction: boolean; // Used to indicate whether transaction fee slider should be displayed and if Advanced Tab fields should be displayed.
}

export interface RawTransactionValues {
  from: string;
  to: string;
  value: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  nonce: string;
}

export interface SendState {
  step: number;
  transactionFields: TransactionFields;
  rawTransactionValues: RawTransactionValues;

  isFetchingAccountValue: boolean; // Used to indicate looking up user's balance of currently-selected asset.
  isResolvingNSName: boolean; // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
  isAddressLabelValid: boolean; // Used to indicate if recipient-address is found in the address book.
  isFetchingAssetPricing: boolean; // Used to indicate fetching CC rates for currently-selected asset.
  isEstimatingGasLimit: boolean; // Used to indicate that gas limit is being estimated using `eth_estimateGas` jsonrpc call.
  isGasLimitManual: boolean; // Used to indicate that user has un-clicked the user-input gas-limit checkbox.

  resolvedNSAddress: string; // Address returned when attempting to resolve an ENS/RNS address.
  recipientAddressLabel: string; //  Recipient-address label found in address book.
  asset: AssetOption | undefined;
  network: string;
  assetType: assetType; // Type of asset selected. Directs how rawTransactionValues field are handled when formatting transaction.
}

const getInitialState = (): SendState => {
  if (isQueryTransaction(location.search)) {
    const params: queryObject = getQueryTransactionData(location.search);
    return {
      step: 0,
      transactionFields: {
        senderAddress: '',
        recipientAddress: getQueryParamWithKey(params, 'to') || '',
        amount: getQueryParamWithKey(params, 'value') || '0.00',
        asset:
          getQueryParamWithKey(params, 'sendmode') === 'token'
            ? getQueryParamWithKey(params, 'tokensymbol') || 'ETH'
            : 'ETH',
        gasPriceSlider: '20',
        gasPriceField: getQueryParamWithKey(params, 'gasprice') || '20',
        gasLimitField:
          getQueryParamWithKey(params, 'gaslimit') ||
          getQueryParamWithKey(params, 'gas') ||
          '21000',
        gasLimitEstimated: '21000',
        nonceEstimated: '0',
        nonceField: '0',
        data: getQueryParamWithKey(params, 'data') || '',
        isAdvancedTransaction: isAdvancedQueryTransaction(location.search) || false // Used to indicate whether transaction fee slider should be displayed and if Advanced Tab fields should be displayed.
      },
      rawTransactionValues: {
        from: '',
        to: '',
        value: '',
        data: '',
        gasLimit: '',
        gasPrice: '',
        nonce: ''
      },
      isFetchingAccountValue: false, // Used to indicate looking up user's balance of currently-selected asset.
      isResolvingNSName: false, // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
      isAddressLabelValid: false, // Used to indicate if recipient-address is found in the address book.
      isFetchingAssetPricing: false, // Used to indicate fetching CC rates for currently-selected asset.
      isEstimatingGasLimit: false, // Used to indicate that gas limit is being estimated using `eth_estimateGas` jsonrpc call.
      isGasLimitManual: false, // Used to indicate that user has un-clicked the user-input gas-limit checkbox.

      resolvedNSAddress: '', // Address returned when attempting to resolve an ENS/RNS address.
      recipientAddressLabel: '', //  Recipient-address label found in address book.
      asset: undefined,
      network: 'ETH',
      assetType: getQueryParamWithKey(params, 'sendmode') === 'token' ? 'erc20' : 'base' // Type of asset selected. Directs how rawTransactionValues field are handled when formatting transaction.
    };
  } else {
    return {
      step: 0,
      transactionFields: {
        senderAddress: '',
        recipientAddress: '',
        amount: '0.00',
        asset: 'ETH',
        gasPriceSlider: '20',
        gasPriceField: '20',
        gasLimitField: '21000',
        gasLimitEstimated: '21000',
        nonceEstimated: '0',
        nonceField: '0',
        data: '',
        isAdvancedTransaction: false // Used to indicate whether transaction fee slider should be displayed and if Advanced Tab fields should be displayed.
      },
      rawTransactionValues: {
        from: '',
        to: '',
        value: '',
        data: '',
        gasLimit: '',
        gasPrice: '',
        nonce: ''
      },
      isFetchingAccountValue: false, // Used to indicate looking up user's balance of currently-selected asset.
      isResolvingNSName: false, // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
      isAddressLabelValid: false, // Used to indicate if recipient-address is found in the address book.
      isFetchingAssetPricing: false, // Used to indicate fetching CC rates for currently-selected asset.
      isEstimatingGasLimit: false, // Used to indicate that gas limit is being estimated using `eth_estimateGas` jsonrpc call.
      isGasLimitManual: false, // Used to indicate that user has un-clicked the user-input gas-limit checkbox.

      resolvedNSAddress: '', // Address returned when attempting to resolve an ENS/RNS address.
      recipientAddressLabel: '', //  Recipient-address label found in address book.
      asset: undefined,
      network: 'ETH',
      assetType: 'base' // Type of asset selected. Directs how rawTransactionValues field are handled when formatting transaction.
    };
  }
};

export class SendAssets extends Component<RouteComponentProps<{}>> {
  public state: SendState = getInitialState();

  public render() {
    const { history } = this.props;
    const { step } = this.state;
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
            stateValues={this.state}
            transactionFields={this.state.transactionFields}
            updateState={this.updateState}
            onNext={this.advanceStep}
            onSubmit={this.updateTransactionFields}
            onReset={this.handleReset}
          />
        </ContentPanel>
      </Layout>
    );
  }

  private advanceStep = () =>
    this.setState((prevState: SendState) => ({
      step: Math.min(prevState.step + 1, steps.length - 1)
    }));

  private regressStep = () =>
    this.setState((prevState: SendState) => ({
      step: Math.min(0, prevState.step - 1)
    }));

  private updateTransactionFields = (transactionFields: TransactionFields) => {
    this.setState({
      ...this.state,
      transactionFields
    });
  };

  private updateState = (state: SendState) => {
    this.setState({
      ...state
    });
  };

  private handleReset = () => this.setState(getInitialState());
}

export default withRouter(SendAssets);
