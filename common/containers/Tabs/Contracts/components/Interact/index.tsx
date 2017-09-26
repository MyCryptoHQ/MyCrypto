import React, { Component } from 'react';
import InteractForm from './components/InteractForm';
import InteractExplorer from './components//InteractExplorer';
import { ABIFunction } from 'actions/contracts';
import { NetworkContract } from 'config/data';

interface Props {
  NetworkContracts: NetworkContract[];
  selectedAddress: string | undefined | null;
  selectedABIJson: string | undefined | null;
  selectedABIFunctions: ABIFunction[];
  accessContract: Function;
}

export default class Interact extends Component {
  public props: Props;

  public render() {
    const {
      NetworkContracts,
      selectedAddress,
      selectedABIJson,
      selectedABIFunctions,
      accessContract
    } = this.props;

    // TODO: Use common components for address, abi json
    return (
      <div className="Interact">
        <InteractForm
          contracts={NetworkContracts}
          address={selectedAddress}
          abiJson={selectedABIJson}
          accessContract={accessContract}
        />
        <hr />
        <InteractExplorer
          address={selectedAddress}
          functions={selectedABIFunctions}
        />
      </div>
    );
  }
}
