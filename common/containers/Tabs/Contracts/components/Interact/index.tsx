import React, { Component } from 'react';
import InteractForm from './components/InteractForm';
import InteractExplorer from './components//InteractExplorer';
import Contract from 'libs/contracts';
import { withTx, IWithTx } from '../withTx';
import {
  TxModal,
  Props as DMProps,
  TTxModal
} from 'containers/Tabs/Contracts/components/TxModal';
import { IUserSendParams } from 'libs/contracts/ABIFunction';
import BN from 'bn.js';
import {
  TxCompare,
  TTxCompare
} from 'containers/Tabs/Contracts/components/TxCompare';

interface State {
  currentContract: Contract | null;
  showExplorer: boolean;
  address: string | null;
  signedTx: string | null;
  rawTx: any | null;
  gasLimit: string;
  value: string;
  displayModal: boolean;
}

class Interact extends Component<IWithTx, State> {
  public initialState: State = {
    currentContract: null,
    showExplorer: false,
    address: null,
    signedTx: null,
    rawTx: null,
    gasLimit: '30000',
    value: '0',
    displayModal: false
  };
  public state: State = this.initialState;

  public componentWillReceiveProps(nextProps: IWithTx) {
    if (nextProps.wallet && this.state.currentContract) {
      Contract.setConfigForTx(this.state.currentContract, nextProps);
    }
  }

  public accessContract = (contractAbi: string, address: string) => () => {
    try {
      const parsedAbi = JSON.parse(contractAbi);
      const contractInstance = new Contract(parsedAbi);
      contractInstance.at(address);
      contractInstance.setNode(this.props.nodeLib);
      this.setState({
        currentContract: contractInstance,
        showExplorer: true,
        address
      });
    } catch (e) {
      this.props.showNotification(
        'danger',
        `Contract Access Error: ${(e as Error).message ||
          'Can not parse contract'}`
      );
      this.resetState();
    }
  };

  public render() {
    const {
      showExplorer,
      currentContract,
      gasLimit,
      value,
      signedTx,
      displayModal
    } = this.state;
    const { wallet, showNotification } = this.props;
    const txGenerated = !!signedTx;

    return (
      <div className="Interact">
        <InteractForm
          accessContract={this.accessContract}
          resetState={this.resetState}
        />
        <hr />
        {showExplorer &&
          currentContract && (
            <InteractExplorer
              {...{
                address: currentContract.address,
                walletDecrypted: !!wallet,
                handleInput: this.handleInput,
                contractFunctions: Contract.getFunctions(currentContract),
                gasLimit,
                value,
                handleFunctionSend: this.handleFunctionSend,
                txGenerated,
                txModal: txGenerated ? this.makeModal() : null,
                txCompare: txGenerated ? this.makeCompareTx() : null,
                toggleModal: this.toggleModal,
                displayModal,
                showNotification
              }}
            />
          )}
      </div>
    );
  }

  private makeCompareTx = (): React.ReactElement<TTxCompare> => {
    const { nonce } = this.state.rawTx;
    const { signedTx } = this.state;

    if (!nonce || !signedTx) {
      throw Error('Can not display raw tx, nonce empty or no signed tx');
    }

    return <TxCompare signedTx={signedTx} />;
  };

  private makeModal = (): React.ReactElement<TTxModal> => {
    const { networkName, node: { network, service } } = this.props;
    const { signedTx } = this.state;

    if (!signedTx) {
      throw Error('Can not deploy contract, no signed tx');
    }

    const props: DMProps = {
      action: 'send a contract state modifying transaction',
      networkName,
      network,
      service,
      handleBroadcastTx: this.handleBroadcastTx,
      onClose: this.resetState
    };

    return <TxModal {...props} />;
  };

  private toggleModal = () => this.setState({ displayModal: true });

  private resetState = () => this.setState(this.initialState);

  private handleBroadcastTx = () => {
    const { signedTx } = this.state;
    if (!signedTx) {
      return null;
    }

    this.props.broadcastTx(signedTx);
    this.resetState();
  };

  private handleFunctionSend = (selectedFunction, inputs) => async () => {
    try {
      const { address, gasLimit, value } = this.state;
      if (!address) {
        return null;
      }

      const parsedInputs = Object.keys(inputs).reduce(
        (accu, key) => ({ ...accu, [key]: inputs[key].parsedData }),
        {}
      );

      const userInputs: IUserSendParams = {
        input: parsedInputs,
        to: address,
        gasLimit: new BN(gasLimit),
        value
      };

      const { signedTx, rawTx } = await selectedFunction.send(userInputs);
      this.setState({ signedTx, rawTx });
    } catch (e) {
      this.props.showNotification(
        'danger',
        `Function send error: ${(e as Error).message}` ||
          'Invalid input parameters',
        5000
      );
    }
  };

  private handleInput = name => (ev: React.FormEvent<any>) =>
    this.setState({ [name]: ev.currentTarget.value });
}

export default withTx(Interact);
