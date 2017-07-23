// @flow
import React, { Component } from 'react';
import translate from 'translations';

type Props = {
  contracts: Array,
  address: ?string,
  abiJson: ?string,
  accessError: ?string,
  accessContract: Function
};

export default class InteractForm extends Component {
  props: Props;

  state = {
    address: '',
    abiJson: ''
  };

  _handleInput = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  _handleSelectContract = ev => {
    const addr = ev.target.value;
    const contract = this.props.contracts.reduce((prev, contract) => {
      return contract.address === addr ? contract : prev;
    });

    this.setState({
      address: contract.address,
      abiJson: contract.abi
    });
  };

  _accessContract = () => {
    this.props.accessContract(this.state.address, this.state.abiJson);
  };

  render() {
    const { contracts } = this.props;
    const { address, abiJson } = this.state;

    const contractOptions = [];
    if (contracts && contracts.length) {
      contractOptions.push({
        name: 'Select a contract...',
        value: null
      });

      contracts.forEach(contract => {
        contractOptions.push({
          name: `${contract.name} (${contract.address.substr(0, 10)}...)`,
          value: contract.address
        });
      });
    } else {
      contractOptions.push({
        name: 'No contracts available',
        value: null
      });
    }

    // TODO: Use common components for address, abi json
    return (
      <div className="Interact-form">
        <div className="Interact-form-address">
          <label className="Interact-form-address-field form-group">
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

          <label className="Interact-form-address-contract form-group">
            <h4>
              {translate('CONTRACT_Title_2')}
            </h4>
            <select
              className="Interact-form-address-field-input form-control"
              onChange={this._handleSelectContract}
              disabled={!contracts || !contracts.length}
            >
              {contractOptions.map(opt =>
                <option key={opt.value} value={opt.value}>
                  {opt.name}
                </option>
              )}
            </select>
          </label>
        </div>

        <div className="Interact-form-interface">
          <label className="Interact-form-interface-field form-group">
            <h4 className="Interact-form-interface-field-label">
              {translate('CONTRACT_Json')}
            </h4>
            <textarea
              name="abiJson"
              className="Interact-form-interface-field-input form-control"
              onChange={this._handleInput}
              value={abiJson}
              rows={6}
            />
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
