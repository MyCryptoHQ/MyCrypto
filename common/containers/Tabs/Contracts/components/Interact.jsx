// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import AddressInput from 'components/inputs/AddressInput';
import ABIInput from 'components/inputs/ABIInput';
import './Interact.scss';

type Props = {};

export default class Interact extends Component {
  props: Props;
  static propTypes = {};

  state = {
    address: '',
    abi: ''
  };

  _handleInputChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
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
        </div>
        <div className="Interact-interface">
          <ABIInput
            label={translate('CONTRACT_Json')}
            name="abi"
            value={abi}
            onChange={this._handleInputChange}
          />
        </div>

        <button className="Contracts-submit btn btn-primary">
          {translate('x_Access')}
        </button>
      </div>
    );
  }
}
