import Big from 'bignumber.js';
import { GWei, TUnit } from 'libs/units';
import { generateCompleteTransaction as makeAndSignTx } from 'libs/transaction';
import React, { Component } from 'react';
import { AppState } from 'reducers';
import { Props } from './types';
import {
  getNodeLib,
  getNodeConfig,
  getNetworkConfig,
  getGasPriceGwei
} from 'selectors/config';
import ethUtil from 'ethereumjs-util';
import { connect } from 'react-redux';
import { showNotification as dShowNotification } from 'actions/notifications';

const deployHOC = PassedComponent => {
  class WrappedComponent extends Component<Props> {
    public initialState = {
      data: '',
      gasLimit: '300000',
      to: ''
    };
    public state = this.initialState;

    public asyncSetState = value =>
      new Promise(resolve => this.setState(value, resolve));

    public resetState = () => this.asyncSetState(this.initialState);

    public handleSubmit = async () => {
      const {
        props: { wallet, showNotification },
        state: { data },
        getDeteministicContractAddress,
        makeSignedTxFromState,
        resetState
      } = this;

      if (data === '') {
        return;
      }

      try {
        const address = await wallet.getAddress();
        await getDeteministicContractAddress(address);
        await makeSignedTxFromState();
      } catch (e) {
        console.log('showing notif');
        showNotification(
          'danger',
          e.message || 'Error during contract tx generation',
          5000
        );
        return resetState();
      }
    };

    public handleInput = inputName => (ev: any) =>
      this.setState({ [inputName]: ev.target.value });

    public render() {
      const {
        handleInput,
        handleSubmit,
        state: { data: byteCode, gasLimit },
        props: { wallet }
      } = this;

      const props = {
        handleInput,
        handleSubmit,
        byteCode,
        gasLimit,
        walletExists: !!wallet
      };
      return <PassedComponent {...props} />;
    }

    private makeSignedTxFromState = () => {
      const {
        props: { nodeLib, wallet, gasPrice, network: { chainId } },
        state: { to, data, gasLimit },
        asyncSetState
      } = this;

      const transactionInput = {
        unit: 'ether',
        to,
        value: '0', //shouldnt makeAndSignTx handle default value of none?
        data
      };

      const bigGasLimit = new Big(gasLimit);

      return makeAndSignTx(
        wallet,
        nodeLib,
        gasPrice,
        bigGasLimit,
        chainId,
        transactionInput
      )
        .then(({ signedTx }) => asyncSetState({ signedTx }))
        .catch(e => {
          throw e;
        });
    };

    private getDeteministicContractAddress = async address => {
      const { props: { nodeLib }, asyncSetState } = this;

      const nonce = await nodeLib
        .getTransactionCount(address)
        .then(n => new Big(n).toString());

      //NOTE: Do we even need to check for this?
      const prefixedAddress =
        address.substring(0, 2) === '0x' ? address : `0x${address}`;

      const determinedContractAddress = ethUtil
        .generateAddress(prefixedAddress, nonce)
        .toString('hex');

      return asyncSetState({
        to: `0x${determinedContractAddress}`
      });
    };
  }
  return connect(mapStateToProps, { showNotification: dShowNotification })(
    WrappedComponent
  );
};

const mapStateToProps = (state: AppState) => ({
  wallet: state.wallet.inst,
  balance: state.wallet.balance,
  node: getNodeConfig(state),
  nodeLib: getNodeLib(state),
  network: getNetworkConfig(state),
  gasPrice: new GWei(getGasPriceGwei(state)).toWei(),
  transactions: state.wallet.transactions
});

export default deployHOC;
