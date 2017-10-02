import Big from 'bignumber.js';
import { GWei, TUnit } from 'libs/units';
import { generateCompleteTransaction as makeAndSignTx } from 'libs/transaction';
import React, { Component } from 'react';
import { AppState } from 'reducers';
import { Props, State } from './types';
import { TxCompare, Props as TxDisplayProps } from './components/TxCompare';
import {
  getNodeLib,
  getNodeConfig,
  getNetworkConfig,
  getGasPriceGwei
} from 'selectors/config';
import ethUtil from 'ethereumjs-util';
import { connect } from 'react-redux';
import { showNotification } from 'actions/notifications';
import {
  DeployModal,
  Props as DeployModalProps
} from './components/DeployModal';
import { broadcastTx } from 'actions/wallet';
import { getTxFromState } from 'selectors/wallet';

const deployHOC = PassedComponent => {
  class WrappedComponent extends Component<Props, State> {
    public initialState: State = {
      data: '',
      gasLimit: '300000',
      determinedContractAddress: '',
      signedTx: null,
      nonce: null,
      address: null,
      to: '0x',
      value: '0x0',
      displayModal: false
    };
    public state: State = this.initialState;

    public asyncSetState = value =>
      new Promise(resolve => this.setState(value, resolve));

    public resetState = () => this.setState(this.initialState);

    public handleSignTx = async () => {
      const {
        props: { showNotification },
        state: { data },
        getDeteministicContractAddress,
        makeSignedTxFromState,
        resetState,
        getNonce,
        getAddress
      } = this;

      if (data === '') {
        return;
      }

      try {
        await getAddress();
        await getNonce();

        await getDeteministicContractAddress();
        await makeSignedTxFromState();
      } catch (e) {
        showNotification(
          'danger',
          e.message || 'Error during contract tx generation',
          5000
        );
        return resetState();
      }
    };

    public handleInput = inputName => (ev: any) =>
      this.setState({
        [inputName]: ev.target.value
      });

    public render() {
      const {
        handleInput,
        handleSignTx,
        handleDeploy,
        displayCompareTx,
        state: { data: byteCode, gasLimit, signedTx, displayModal },
        props: { wallet }
      } = this;

      const props = {
        handleInput,
        handleSignTx,
        handleDeploy,
        byteCode,
        gasLimit,
        displayModal,
        walletExists: !!wallet,
        TxCompare: signedTx ? displayCompareTx() : null,
        DeployModal: signedTx ? this.displayDeployModal() : null
      };
      return <PassedComponent {...props} />;
    }

    private displayCompareTx = () => {
      const { nonce, gasLimit, data, value, signedTx, to } = this.state;
      const { gasPrice, network: { chainId } } = this.props;
      if (!nonce || !signedTx) {
        throw Error('Can not display raw tx, nonce empty');
      }
      const props: TxDisplayProps = {
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
    private handleDeploy = () => this.setState({ displayModal: true });
    private displayDeployModal = () => {
      const { network: { name }, node: { network, service } } = this.props;
      const { signedTx } = this.state;

      if (!signedTx) {
        throw Error('Can not deploy contract, no signed tx');
      }

      const props: DeployModalProps = {
        chainName: name,
        nodeName: network,
        nodeProvider: service,
        handleBroadcastTx: this.handleBroadcastTx,
        onClose: () => this.resetState()
      };
      return <DeployModal {...props} />;
    };

    private handleBroadcastTx = () => {
      const { signedTx } = this.state;
      if (!signedTx) {
        throw Error('Can not broadcast tx, signed tx does not exist');
      }
      this.props.broadcastTx(signedTx);
      this.resetState();
    };

    private makeSignedTxFromState = () => {
      const {
        props: { nodeLib, wallet, gasPrice, network: { chainId } },
        state: { data, gasLimit, value, to },
        asyncSetState
      } = this;

      const transactionInput = {
        unit: 'ether' as any,
        to,
        data,
        value
      }; //shouldnt makeAndSignTx handle default value of none?

      const bigGasLimit = new Big(gasLimit);

      return makeAndSignTx(
        wallet,
        nodeLib,
        gasPrice,
        bigGasLimit,
        chainId,
        transactionInput,
        true
      ).then(({ signedTx }) => asyncSetState({ signedTx }));
    };

    private getDeteministicContractAddress = () => {
      const { asyncSetState, state: { nonce, address } } = this;

      if (!address || !nonce) {
        throw Error(
          'Can not determine contract address, no nonce or address supplied'
        );
      }

      //NOTE: Do we even need to check for this?
      const prefixedAddress =
        address.substring(0, 2) === '0x' ? address : `0x${address}`;

      const determinedContractAddress = ethUtil
        .generateAddress(prefixedAddress, nonce)
        .toString('hex');

      return asyncSetState({
        determinedContractAddress: `0x${determinedContractAddress}`
      });
    };

    private getNonce = async () => {
      const { props: { nodeLib }, state: { address }, asyncSetState } = this;
      if (!address) {
        throw Error('Can not get nonce, no address supplied');
      }

      const nonce = await nodeLib
        .getTransactionCount(address)
        .then(n => new Big(n).toString());

      return asyncSetState({ nonce });
    };

    private getAddress = () =>
      this.props.wallet
        .getAddress()
        .then(address => this.asyncSetState({ address }));
  }

  return connect(mapStateToProps, {
    showNotification,
    broadcastTx
  })(WrappedComponent);
};

const mapStateToProps = (state: AppState) => ({
  wallet: state.wallet.inst,
  balance: state.wallet.balance,
  node: getNodeConfig(state),
  nodeLib: getNodeLib(state),
  network: getNetworkConfig(state),
  gasPrice: new GWei(getGasPriceGwei(state)).toWei()
});

export default deployHOC;
