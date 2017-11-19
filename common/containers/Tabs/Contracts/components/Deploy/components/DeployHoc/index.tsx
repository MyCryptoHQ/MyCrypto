import BN from 'bn.js';
import { Wei } from 'libs/units';
import React, { Component } from 'react';
import {
  generateCompleteTransaction as makeAndSignTx,
  TransactionInput
} from 'libs/transaction';
import { Props, State, initialState } from './types';
import {
  TxModal,
  Props as DMProps,
  TTxModal
} from 'containers/Tabs/Contracts/components/TxModal';
import {
  TxCompare,
  TTxCompare
} from 'containers/Tabs/Contracts/components/TxCompare';
import { withTx } from 'containers/Tabs/Contracts/components//withTx';
import { Props as DProps } from '../../';

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

    public handleInput = inputName => (
      ev: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>
    ): void => {
      if (this.state.signedTx) {
        this.resetState();
      }

      this.setState({
        [inputName]: ev.currentTarget.value
      });
    };

    public handleDeploy = () => this.setState({ displayModal: true });

    public render() {
      const { data: byteCode, gasLimit, signedTx, displayModal } = this.state;

      const props: DProps = {
        handleInput: this.handleInput,
        handleSignTx: this.handleSignTx,
        handleDeploy: this.handleDeploy,
        byteCode,
        gasLimit,
        displayModal,
        walletExists: !!this.props.wallet,
        txCompare: signedTx ? this.displayCompareTx() : null,
        deployModal: signedTx ? this.displayDeployModal() : null
      };

      return <PassedComponent {...props} />;
    }

    private displayCompareTx = (): React.ReactElement<TTxCompare> => {
      const { signedTx, nonce } = this.state;

      if (!nonce || !signedTx) {
        throw Error('Can not display raw tx, nonce empty or no signed tx');
      }

      return <TxCompare signedTx={signedTx} />;
    };

    private displayDeployModal = (): React.ReactElement<TTxModal> => {
      const { networkName, node: { network, service } } = this.props;
      const { signedTx } = this.state;

      if (!signedTx) {
        throw Error('Can not deploy contract, no signed tx');
      }

      const props: DMProps = {
        action: 'deploy a contract',
        networkName,
        network,
        service,
        handleBroadcastTx: this.handleBroadcastTx,
        onClose: this.resetState
      };

      return <TxModal {...props} />;
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
        Wei(gasLimit),
        props.chainId,
        transactionInput,
        true
      ).then(({ signedTx }) => this.asyncSetState({ signedTx }));
    };

    private getAddressAndNonce = async () => {
      const address = await this.props.wallet.getAddressString();
      const nonce = await this.props.nodeLib
        .getTransactionCount(address)
        .then(n => new BN(n).toString());
      return this.asyncSetState({ nonce, address });
    };
  }
  return withTx(WrappedComponent);
};
