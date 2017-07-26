// @flow
import React, { Component } from 'react';
import InteractForm from './InteractForm';
import InteractExplorer from './InteractExplorer';
import type { ABIFunction } from 'actions/contracts';
import type { NetworkContract } from 'config/data';

type Props = {
  NetworkContracts: Array<NetworkContract>,
  selectedAddress: ?string,
  selectedABIJson: ?string,
  selectedABIFunctions: ?Array<ABIFunction>,
  accessContract: Function
};

export default class Interact extends Component {
  props: Props;

  render() {
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
