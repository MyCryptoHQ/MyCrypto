// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DONATION_ADDRESSES_MAP } from 'config/data';
import { isValidBTCAddress, isValidETHAddress } from 'libs/validators';
import translate from 'translations';

export default class ReceivingAddress extends Component {
  static propTypes = {
    destinationKind: PropTypes.string.isRequired,
    destinationAddressSwap: PropTypes.func.isRequired,
    destinationAddress: PropTypes.string,
    partTwoCompleteSwap: PropTypes.func
  };

  onChangeDestinationAddress = (event: SyntheticInputEvent) => {
    const value = event.target.value;
    this.props.destinationAddressSwap(value);
  };

  onClickPartTwoComplete = () => {
    this.props.partTwoCompleteSwap(true);
  };

  render() {
    const { destinationKind, destinationAddress } = this.props;
    let validAddress;
    // TODO - find better pattern here once currencies move beyond BTC, ETH, REP
    if (this.props.destinationKind === 'BTC') {
      validAddress = isValidBTCAddress(destinationAddress);
    } else {
      validAddress = isValidETHAddress(destinationAddress);
    }

    return (
      <article className="swap-start">
        <section className="swap-address block">
          <section className="row">
            <div className="col-sm-8 col-sm-offset-2 col-xs-12">
              <label>
                <span>{translate('SWAP_rec_add')}</span>
                <strong> ({destinationKind})</strong>
              </label>
              <input
                className={`form-control ${validAddress
                  ? 'is-valid'
                  : 'is-invalid'}`}
                type="text"
                value={destinationAddress}
                onChange={this.onChangeDestinationAddress}
                placeholder={DONATION_ADDRESSES_MAP[destinationKind]}
              />
            </div>
          </section>
          <section className="row text-center">
            <button
              disabled={!validAddress}
              onClick={this.onClickPartTwoComplete}
              className="btn btn-primary btn-lg"
            >
              <span>{translate('SWAP_start_CTA')}</span>
            </button>
          </section>
        </section>
      </article>
    );
  }
}
