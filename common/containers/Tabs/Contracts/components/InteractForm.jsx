// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';

type Props = {
  contracts: Array,
  address: ?string,
  abiJson: ?string,
  accessContract: Function
};

export default class InteractForm extends Component {
  props: Props;
  static propTypes = {
    // Store state
    contracts: PropTypes.array.isRequired,
    address: PropTypes.string,
    abiJson: PropTypes.string,
    accessError: PropTypes.string,
    // Actions
    accessContract: PropTypes.func.isRequired
  };

  state = {
    address: '',
    abiJson: ''
  };

  _handleInput = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  _handleSelectContract = ev => {
    console.log(ev);
  };

  _accessContract = () => {
    this.accessContract(this.state.address, this.state.abiJson);
  };

  render() {
    const { address, abiJson } = this.state;

    // TODO: Use common components for address, abi json
    return (
      <div className="Interact-form">
        <div className="Interact-form-address">
          <label className="Interact-form-address-field">
            <h4>
              {translate('CONTRACT_Title_2')}
            </h4>
            <input
              name="address"
              value={address}
              className="Interact-form-address-field-input form-control"
              onChange={this._handleInput}
            />
          </label>

          <label className="Interact-form-address-contract">
            <h4>
              {translate('CONTRACT_Title_2')}
            </h4>
            <select
              className="Interact-form-address-field-input form-control"
              onChange={this._handleSelectContract}
            >
              <option>Select a contract...</option>
            </select>
          </label>
        </div>

        <div className="Interact-form-interface">
          <label className="Interact-form-interface-field">
            <h4 className="Interact-form-interface-field-label">
              {translate('CONTRACT_Json')}
            </h4>
            <textarea
              name="abiJson"
              className="Interact-form-interface-field-input form-control"
              onChange={this._handleInput}
            >
              {abiJson}
            </textarea>
          </label>
        </div>

        <button
          className="Interact-form-submit btn btn-primary"
          onClick={this._accessContract}
        >
          {translate('x_Access')}
        </button>
      </div>
    );
  }
}
