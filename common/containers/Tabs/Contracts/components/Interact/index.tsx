import React, { Component } from 'react';
import { connect } from 'react-redux';

import Contract from 'libs/contracts';
import * as selectors from 'features/selectors';
import { notificationsActions } from 'features/notifications';
import InteractForm from './components/InteractForm';
import { InteractExplorer } from './components/InteractExplorer';

interface State {
  currentContract: Contract | null;
  showExplorer: boolean;
}

interface StateProps {
  currentTo: ReturnType<typeof selectors.getCurrentTo>;
}

interface DispatchProps {
  showNotification: notificationsActions.TShowNotification;
}

type Props = StateProps & DispatchProps;
class InteractClass extends Component<Props, State> {
  public initialState: State = {
    currentContract: null,
    showExplorer: false
  };
  public state: State = this.initialState;

  public accessContract = (contractAbi: string) => () => {
    try {
      const parsedAbi = JSON.parse(contractAbi);
      const contractInstance = new Contract(parsedAbi);

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

    const interactProps = {
      accessContract: this.accessContract,
      resetState: this.resetState
    };

    return (
      <main className="Interact Tab-content-pane" role="main">
        <InteractForm {...interactProps} />
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

export const Interact = connect(null, { showNotification: notificationsActions.showNotification })(
  InteractClass
);
