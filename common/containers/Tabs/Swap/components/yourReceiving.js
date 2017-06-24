import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DONATION_ADDRESSES_MAP } from 'config/data';
import Validator from 'libs/validator';

export default class YourReceiving extends Component {
  constructor(props) {
    super(props);
    this.validator = new Validator();
    this.state = {
      validAddress: false
    };
  }

  static propTypes = {
    destinationKind: PropTypes.string.isRequired,
    receivingAddressSwap: PropTypes.func.isRequired,
    receivingAddress: PropTypes.string
  };

  onChangeReceivingAddress = event => {
    const value = event.target.value;
    this.props.receivingAddressSwap(value);
    let validAddress;
    // TODO - find better pattern here once currencies move beyond BTC, ETH, REP
    if (this.props.destinationKind === 'BTC') {
      validAddress = this.validator.isValidBTCAddress(value);
    } else {
      validAddress = this.validator.isValidETHAddress(value);
    }
    this.setState({ validAddress });
  };

  render() {
    const { destinationKind, receivingAddress } = this.props;
    const { validAddress } = this.state;
    return (
      <article className="swap-start">
        <section className="swap-address block">
          <section className="row">
            <div className="col-sm-8 col-sm-offset-2 col-xs-12">
              <label>
                <span>Your Receiving Address</span>
                <strong> ({destinationKind})</strong>
              </label>
              <input
                className={`form-control ${validAddress
                  ? 'is-valid'
                  : 'is-invalid'}`}
                type="text"
                value={receivingAddress}
                onChange={this.onChangeReceivingAddress}
                placeholder={DONATION_ADDRESSES_MAP[destinationKind]}
              />
            </div>
          </section>
          <section className="row text-center">
            <button disabled={!validAddress} className="btn btn-primary btn-lg">
              <span>Start Swap</span>
            </button>
          </section>
        </section>
      </article>
    );
  }
}
