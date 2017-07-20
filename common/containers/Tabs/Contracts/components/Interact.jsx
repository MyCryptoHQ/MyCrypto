// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import AddressInput from 'components/inputs/AddressInput';
import ABIInput from 'components/inputs/ABIInput';
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

  state = {
    address: '',
    abiJson: ''
  };

  _handleInputChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  _accessContract = () => {
    this.accessContract(this.state.address, this.state.abiJson);
  };

  render() {
    const { address, abi } = this.state;

    return (
      <div className="Interact">
        <div className="Interact-address">
          <AddressInput
            label={translate('CONTRACT_Title')}
            value={address}
            name="address"
            onChange={this._handleInputChange}
            showIdenticon={true}
          />
          <label className="Interact-address-contract">
            <h4>
              {translate('CONTRACT_Title_2')}
            </h4>
            <select className="form-control">
              <option>Select a contract...</option>
            </select>
          </label>
        </div>
        <div className="Interact-interface">
          <ABIInput
            label={translate('CONTRACT_Json')}
            name="abiJson"
            value={abi}
            onChange={this._handleInputChange}
          />
        </div>

        <button
          className="Contracts-submit btn btn-primary"
          onClick={this._accessContract}
        >
          {translate('x_Access')}
        </button>
      </div>
    );
  }
}
