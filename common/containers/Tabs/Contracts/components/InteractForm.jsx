// @flow
import React, { Component } from 'react';
import translate from 'translations';
import './InteractForm.scss';
import type { NetworkContract } from 'config/data';

type Props = {
  contracts: Array<NetworkContract>,
  address: ?string,
  abiJson: ?string,
  accessContract: Function
};

export default class InteractForm extends Component {
  props: Props;

  state = {
    address: '',
    abiJson: ''
  };

  _handleInput = (ev: SyntheticInputEvent) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  _handleSelectContract = (ev: SyntheticInputEvent) => {
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

    let contractOptions;
    if (contracts && contracts.length) {
      contractOptions = [
        {
          name: 'Select a contract...',
          value: null
        }
      ];

      contractOptions = contractOptions.concat(
        contracts.map(contract => {
          return {
            name: `${contract.name} (${contract.address.substr(0, 10)}...)`,
            value: contract.address
          };
        })
      );
    } else {
      contractOptions = [
        {
          name: 'No contracts available',
          value: null
        }
      ];
    }

    // TODO: Use common components for address, abi json
    return (
      <div className="InteractForm">
        <div className="InteractForm-address">
          <label className="InteractForm-address-field form-group">
            <h4>
              {translate('CONTRACT_Title_2')}
            </h4>
            <input
              name="address"
              value={address}
              className="InteractForm-address-field-input form-control"
              onChange={this._handleInput}
            />
          </label>

          <label className="InteractForm-address-contract form-group">
            <h4>
              {translate('CONTRACT_Title_2')}
            </h4>
            <select
              className="InteractForm-address-field-input form-control"
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

        <div className="InteractForm-interface">
          <label className="InteractForm-interface-field form-group">
            <h4 className="InteractForm-interface-field-label">
              {translate('CONTRACT_Json')}
            </h4>
            <textarea
              name="abiJson"
              className="InteractForm-interface-field-input form-control"
              onChange={this._handleInput}
              value={abiJson}
              rows={6}
            />
          </label>
        </div>

        <button
          className="InteractForm-submit btn btn-primary"
          onClick={this._accessContract}
        >
          {translate('x_Access')}
        </button>
      </div>
    );
  }
}
