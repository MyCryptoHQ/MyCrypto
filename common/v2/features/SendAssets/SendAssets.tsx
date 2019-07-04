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
    transactionStrings: {
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
              transactionStrings={this.state.transactionStrings}
              onNext={this.goToNextStep}
              updateSendState={this.updateSendState}
            />
          ) : (
            <Step.elem
              transactionData={this.state.transactionData}
              sharedConfig={this.state.sharedConfig}
              transactionStrings={this.state.transactionStrings}
              updateTransactionStrings={this.updateTransactionStrings}
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
    const sharedConfig = {
      senderAddress: formikValues.transactionFields.account.address,
      senderAddressLabel: formikValues.transactionFields.account.label,
      senderWalletBalanceBase: formikValues.transactionFields.account.balance,
      senderWalletBalanceToken: '',
      senderAccountType: formikValues.transactionFields.account.wallet,
      senderNetwork: formikValues.transactionFields.account.network,
      assetSymbol: formikValues.transactionFields.account.assets,
      assetType: undefined,
      dPath: '',
      recipientAddressLabel: formikValues.recipientAddressLabel,
      recipientResolvedNSAddress: formikValues.recipientResolvedNSAddress
    };

    const transactionData = {
      to: formikValues.transactionFields.recipientAddress,
      gasLimit: formikValues.transactionFields.gasLimitField,
      gasPrice: formikValues.transactionFields.gasPriceField,
      nonce: formikValues.transactionFields.nonceEstimated,
      data: formikValues.transactionFields.account.data,
      value: formikValues.transactionFields.account.amount,
      chainId: formikValues.transactionFields.network
    };
    this.setState({
      transactionData,
      sharedConfig
    });

    console.log(this.state.transactionData, sharedConfig);
  };

  private updateTransactionStrings = (transactionString: any) => {
    console.log(transactionString);
  };

  // private updateState = (state: Partial<ISendState>) => {
  //   if (state.transactionFields) {
  //     const nextAccountField: ITxFields['account'] = {
  //       ...this.state.transactionFields.account,
  //       ...state.transactionFields.account
  //     };

  //     const nextTransactionFields: ITxFields = {
  //       ...this.state.transactionFields,
  //       ...state.transactionFields,
  //       account: nextAccountField
  //     };

  //     this.setState({
  //       transactionFields: nextTransactionFields
  //     });
  //   }

  //   if (state.signedTransaction) {
  //     this.setState({
  //       signedTransaction: state.signedTransaction
  //     });
  //   }
  // };

  // private handleReset = () => this.setState(getInitialState());
}

export default withRouter(SendAssets);
