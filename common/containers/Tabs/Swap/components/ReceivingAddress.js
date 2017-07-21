// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { donationAddressMap } from 'config/data';
import { isValidBTCAddress, isValidETHAddress } from 'libs/validators';
import translate from 'translations';

export type ReduxStateProps = {
  destinationKind: PropTypes.string.isRequired,
  destinationAddress: PropTypes.string.isRequired
};

export type ReduxActionProps = {
  destinationAddressSwap: PropTypes.func.isRequired,
  changeStepSwap: PropTypes.func.isRequired,
  stopLoadBityRatesSwap: PropTypes.func.isRequired
};

export default class ReceivingAddress extends Component {
  props: ReduxStateProps & ReduxActionProps;

  onChangeDestinationAddress = (event: SyntheticInputEvent) => {
    const value = event.target.value;
    this.props.destinationAddressSwap(value);
  };

  onClickPartTwoComplete = () => {
    this.props.stopLoadBityRatesSwap();
    this.props.referenceNumberSwap('2342423442');
    this.props.changeStepSwap(3);
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
                <span>
                  {translate('SWAP_rec_add')}
                </span>
                <strong>
                  {' '}({destinationKind})
                </strong>
              </label>
              <input
                className={`form-control ${validAddress
                  ? 'is-valid'
                  : 'is-invalid'}`}
                type="text"
                value={destinationAddress}
                onChange={this.onChangeDestinationAddress}
                placeholder={donationAddressMap[destinationKind]}
              />
            </div>
          </section>
          <section className="row text-center">
            <button
              disabled={!validAddress}
              onClick={this.onClickPartTwoComplete}
              className="btn btn-primary btn-lg"
            >
              <span>
                {translate('SWAP_start_CTA')}
              </span>
            </button>
          </section>
        </section>
      </article>
    );
  }
}
