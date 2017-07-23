// @flow
import React, { Component } from 'react';
import InteractForm from './InteractForm';
import InteractExplorer from './InteractExplorer';
import './Interact.scss';

type Props = {
  nodeContracts: Array,
  selectedAddress: ?string,
  selectedABIJson: ?string,
  selectedABIFunctions: ?Array,
  accessContract: Function
};

export default class Interact extends Component {
  props: Props;

  render() {
    const {
      nodeContracts,
      selectedAddress,
      selectedABIJson,
      selectedABIFunctions,
      accessContract
    } = this.props;

    // TODO: Use common components for address, abi json
    return (
      <div className="Interact">
        <InteractForm
          contracts={nodeContracts}
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
