import React, { Component } from 'react';
import InteractForm from './components/InteractForm';
import { InteractExplorer } from './components//InteractExplorer';
import Contract from 'libs/contracts';
import { setToField, TSetToField } from 'actions/transaction';
import { Address } from 'libs/units';
import { showNotification, TShowNotification } from 'actions/notifications';
import { connect } from 'react-redux';

interface State {
  currentContract: Contract | null;
  showExplorer: boolean;
}

interface DispatchProps {
  setToField: TSetToField;
  showNotification: TShowNotification;
}

class InteractClass extends Component<DispatchProps, State> {
  public initialState: State = {
    currentContract: null,
    showExplorer: false
  };
  public state: State = this.initialState;

  public accessContract = (contractAbi: string, address: string) => () => {
    try {
      const parsedAbi = JSON.parse(contractAbi);
      const contractInstance = new Contract(parsedAbi);
      this.props.setToField({ raw: address, value: Address(address) });
      // dispatch address to to field
      this.setState({
        currentContract: contractInstance,
        showExplorer: true
      });
    } catch (e) {
      this.props.showNotification(
        'danger',
        `Contract Access Error: ${(e as Error).message || 'Can not parse contract'}`
      );
      this.resetState();
    }
  };

  public render() {
    const { showExplorer, currentContract } = this.state;

    return (
      <main className="Interact Tab-content-pane" role="main">
        <InteractForm accessContract={this.accessContract} resetState={this.resetState} />
        <hr />
        {showExplorer &&
          currentContract && (
            <InteractExplorer contractFunctions={Contract.getFunctions(currentContract)} />
          )}
      </main>
    );
  }

  private resetState = () => this.setState(this.initialState);
}
export const Interact = connect(null, { showNotification, setToField })(InteractClass);
