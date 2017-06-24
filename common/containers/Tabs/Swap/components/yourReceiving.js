import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DONATION_ADDRESSES_MAP } from 'config/data';

export default class YourReceiving extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    destinationKind: PropTypes.string.isRequired
  };

  render() {
    const { destinationKind } = this.props;
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
                className="form-control"
                type="text"
                placeholder={DONATION_ADDRESSES_MAP[destinationKind]}
              />
            </div>
          </section>
          <section className="row text-center">
            <a className="btn btn-primary btn-lg">
              <span>Start Swap</span>
            </a>
          </section>
        </section>
      </article>
    );
  }
}
