// Legacy
import sendIcon from 'common/assets/images/icn-send.svg';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ContentPanel } from 'v2/components';
import { Layout } from 'v2/features';
import {
  ConfirmTransaction,
  SendAssetsForm,
  SignTransaction,
  TransactionReceipt
} from './components';
import { SendState } from './types';

const steps = [
  { label: 'Send Assets', elem: SendAssetsForm },
  { label: '', elem: SignTransaction },
  { label: 'ConfirmTransaction', elem: ConfirmTransaction },
  { label: 'Transaction Complete', elem: TransactionReceipt }
];

// due to MetaMask deprecating eth_sign method, it has different step order, where sign and send are one panel
const web3Steps = [
  { label: 'Send Assets', elem: SendAssetsForm },
  { label: 'ConfirmTransaction', elem: ConfirmTransaction },
  { label: '', elem: SignTransaction },
  { label: 'Transaction Complete', elem: TransactionReceipt }
];

export class SendAssets extends Component<RouteComponentProps<{}>, SendState> {
  public state: SendState = {
    step: 0,
    transactionData: {
      to: '',
      gasLimit: '',
      gasPrice: '',
      nonce: '',
      data: '',
      value: '',
      chainId: undefined
    },
    sharedConfig: {
      senderAddress: '',
      senderAddressLabel: '',
      senderWalletBalanceBase: '',
      senderWalletBalanceToken: '',
      senderAccountType: '',
      senderNetwork: '',
      assetSymbol: '',
      assetType: undefined,
      dPath: '',
      recipientAddressLabel: '',
      recipientResolvedNSAddress: ''
    },
    transaction: {
      serialized: '',
      signed: '',
      txHash: ''
    }
  };

  public render() {
    const { step, sharedConfig } = this.state;
    const Step = steps[step];
    const Web3Steps = web3Steps[step];

    return (
      <Layout className="SendAssets" centered={true}>
        <ContentPanel
          onBack={this.goToPrevStep}
          className="SendAssets"
          heading={sharedConfig.senderAccountType === 'web3' ? Web3Steps.label : Step.label}
          icon={sendIcon}
          stepper={{ current: step + 1, total: steps.length - 1 }}
        >
          {sharedConfig.senderAccountType === 'web3' ? (
            //@ts-ignoretslint-ignore //deprecated eth_sign
            <Web3Steps.elem
              transactionData={this.state.transactionData}
              sharedConfig={this.state.sharedConfig}
              transactionStrings={this.state.transaction}
              onNext={this.goToNextStep}
              updateSendState={this.updateSendState}
            />
          ) : (
            //@ts-ignoretslint-ignore
            <Step.elem
              transactionData={this.state.transactionData}
              sharedConfig={this.state.sharedConfig}
              transactionStrings={this.state.transaction}
              updateSendState={this.updateSendState}
              onNext={this.goToNextStep}
            />
          )}
        </ContentPanel>
      </Layout>
    );
  }

  private goToNextStep = () =>
    this.setState((prevState: SendState) => ({
      step: Math.min(prevState.step + 1, steps.length - 1)
    }));

  private goToPrevStep = () =>
    this.setState((prevState: SendState) => ({
      step: Math.max(0, prevState.step - 1)
    }));

  private updateSendState = (formikValues: any) => {
    // console.log('formik', formikValues);
    const sharedConfig = {
      senderAddress: formikValues.account.address,
      senderAddressLabel: formikValues.account.label,
      senderWalletBalanceBase: formikValues.account.balance,
      senderWalletBalanceToken: '',
      senderAccountType: formikValues.account.wallet,
      senderNetwork: formikValues.account.network,
      assetNetwork: formikValues.asset.network, //TODO: properly set this field in formik
      assetSymbol: formikValues.sharedConfig.assetSymbol,
      assetType: formikValues.sharedConfig.assetType,
      dPath: formikValues.account.dPath,
      recipientAddressLabel: formikValues.sharedConfig.recipientAddressLabel,
      recipientResolvedNSAddress: formikValues.sharedConfig.recipientResolvedNSAddress
    };

    const transactionData = {
      to: formikValues.sharedConfig.recipientResolvedNSAddress
        ? formikValues.sharedConfig.recipientResolvedNSAddress
        : formikValues.transactionData.to,
      gasLimit: formikValues.formikState.isAdvancedTransaction
        ? formikValues.formikState.gasLimitField
        : formikValues.formikState.gasLimitEstimated,
      gasPrice: formikValues.formikState.isAdvancedTransaction
        ? formikValues.formikState.gasPriceField
        : formikValues.formikState.gasEstimates.standard, //TODO: Properly set correcy gasPrice field in formik
      nonce: formikValues.formikState.nonceEstimated,
      data: formikValues.transactionData.data,
      value: formikValues.transactionData.value,
      chainId: formikValues.transactionData.network //TODO: grab chain from network name
    };
    this.setState({
      transactionData,
      sharedConfig
    });
    /*NEXT STEPS: Process transaction data according to formik values
    * Set conditional gas price and gas limit depending on isAdvancedTransaction in Formik and set transactionData.gasLimit and transactionData.gasPrice
    * process transaction correctly and serialize transaction
    * pass serialized transaction to SendState transaction.serialized
    */

    this.processTransactionData();
  };

  private processTransactionData() {
    // console.log(processFormDataToTx(this.state));
    // console.log('state', this.state);
  }

  // private updateTransactionStrings = (transactionString: any) => {
  //   console.log(transactionString);
  // };

  // private handleReset = () => this.setState(getInitialState());
}

export default withRouter(SendAssets);
