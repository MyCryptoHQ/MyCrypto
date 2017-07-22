// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import InteractForm from './InteractForm';
import InteractExplorer from './InteractExplorer';
import './Interact.scss';

type Props = {
  nodeContracts: Array,
  selectedAddress: ?string,
  selectedABIJson: ?string,
  selectedABIFunctions: ?Array,
  accessError: ?string,
  accessContract: Function
};

export default class Interact extends Component {
  props: Props;
  static propTypes = {
    // Store state
    nodeContracts: PropTypes.array.isRequired,
    selectedAddress: PropTypes.string,
    selectedABIJson: PropTypes.string,
    selectedABIFunctions: PropTypes.array,
    accessError: PropTypes.string,
    // Actions
    accessContract: PropTypes.func.isRequired
  };

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
        <InteractExplorer selectedABIFunctions={selectedABIFunctions} />
      </div>
    );
  }
}
