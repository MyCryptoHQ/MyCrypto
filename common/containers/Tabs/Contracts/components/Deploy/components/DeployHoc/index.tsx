import Big from 'bignumber.js';
import React, { Component } from 'react';
import {
  generateCompleteTransaction as makeAndSignTx,
  TransactionInput
} from 'libs/transaction';
import { Props, State, initialState } from './types';
import { DeployModal, Props as DMProps } from './components/DeployModal';
import { TxCompare, Props as TCProps } from './components/TxCompare';
import { withTx } from '../../../withTx';

export const deployHOC = PassedComponent => {
  class WrappedComponent extends Component<Props, State> {
    public state: State = initialState;

    public asyncSetState = value =>
      new Promise(resolve => this.setState(value, resolve));

    public resetState = () => this.setState(initialState);

    public handleSignTx = async () => {
      const { props, state } = this;

      if (state.data === '') {
        return;
      }

      try {
        await this.getAddressAndNonce();
        await this.makeSignedTxFromState();
      } catch (e) {
        props.showNotification(
          'danger',
          e.message || 'Error during contract tx generation',
          5000
        );

        return this.resetState();
      }
    };

    public handleInput = inputName => ev =>
      this.setState({
        [inputName]: ev.target.value
      });

    public handleDeploy = () => this.setState({ displayModal: true });

    public render() {
      const { data: byteCode, gasLimit, signedTx, displayModal } = this.state;

      const props = {
        handleInput: this.handleInput,
        handleSignTx: this.handleSignTx,
        handleDeploy: this.handleDeploy,
        byteCode,
        gasLimit,
        displayModal,
        walletExists: !!this.props.wallet,
        TxCompare: signedTx ? this.displayCompareTx() : null,
        DeployModal: signedTx ? this.displayDeployModal() : null
      };

      return <PassedComponent {...props} />;
    }

    private displayCompareTx = () => {
      const { nonce, gasLimit, data, value, signedTx, to } = this.state;
      const { gasPrice, chainId } = this.props;

      if (!nonce || !signedTx) {
        throw Error('Can not display raw tx, nonce empty or no signed tx');
      }

      const props: TCProps = {
        nonce,
        gasPrice,
        chainId,
        data,
        gasLimit,
        to,
        value,
        signedTx
      };

      return <TxCompare {...props} />;
    };

    private displayDeployModal = () => {
      const { networkName, node: { network, service } } = this.props;
      const { signedTx } = this.state;

      if (!signedTx) {
        throw Error('Can not deploy contract, no signed tx');
      }

      const props: DMProps = {
        chainName: networkName,
        nodeName: network,
        nodeProvider: service,
        handleBroadcastTx: this.handleBroadcastTx,
        onClose: this.resetState
      };

      return <DeployModal {...props} />;
    };

    private handleBroadcastTx = () => {
      if (!this.state.signedTx) {
        throw Error('Can not broadcast tx, signed tx does not exist');
      }
      this.props.broadcastTx(this.state.signedTx);
      this.resetState();
    };

    private makeSignedTxFromState = () => {
      const { props, state: { data, gasLimit, value, to } } = this;
      const transactionInput: TransactionInput = {
        unit: 'ether',
        to,
        data,
        value
      };

      return makeAndSignTx(
        props.wallet,
        props.nodeLib,
        props.gasPrice,
        new Big(gasLimit),
        props.chainId,
        transactionInput,
        true
      ).then(({ signedTx }) => this.asyncSetState({ signedTx }));
    };

    private getAddressAndNonce = async () => {
      const address = await this.props.wallet.getAddress();
      const nonce = await this.props.nodeLib
        .getTransactionCount(address)
        .then(n => new Big(n).toString());
      return this.asyncSetState({ nonce, address });
    };
  }
  return withTx(WrappedComponent);
};
