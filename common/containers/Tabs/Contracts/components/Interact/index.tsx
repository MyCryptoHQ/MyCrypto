import React, { Component } from 'react';
import { connect } from 'react-redux';
import InteractForm from './components/InteractForm';
import InteractExplorer from './components//InteractExplorer';
import { NetworkContract } from 'config/data';
import Contract, { TContract } from 'libs/contracts';
import { getNodeLib } from 'selectors/config';
import { INode } from 'libs/nodes/INode';
import { AppState } from 'reducers';
import { withTx, IWithTx } from '../withTx';

interface State {
  currentContract: Contract | null;
  showExplorer: boolean;
}

class Interact extends Component<IWithTx, State> {
  public initialState: State = { currentContract: null, showExplorer: false };
  public state: State = this.initialState;

  public accessContract = (contractAbi: string, address: string) => ev => {
    const parsedAbi = JSON.parse(contractAbi);
    const contractInstance = new Contract(parsedAbi);
    contractInstance.at(address);
    contractInstance.setNode(this.props.nodeLib);
    this.setState({ currentContract: contractInstance, showExplorer: true });
  };

  public render() {
    const { showExplorer, currentContract } = this.state;
    // TODO: Use common components for address, abi json
    return (
      <div className="Interact">
        <InteractForm accessContract={this.accessContract} />
        <hr />
        {showExplorer &&
          currentContract && (
            <InteractExplorer
              contractFunctions={Contract.getFunctions(currentContract)}
              address={currentContract.address}
            />
          )}
      </div>
    );
  }
}

export default withTx(Interact);
