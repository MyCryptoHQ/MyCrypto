import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toFixedIfLarger } from 'utils/formatters';

export default class SwapInformation extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    originAmount: PropTypes.number.isRequired,
    destinationAmount: PropTypes.number.isRequired,
    originKind: PropTypes.string.isRequired,
    destinationKind: PropTypes.string.isRequired
  };

  computedOriginDestinationRatio = () => {
    return this.props.destinationAmount / this.props.originAmount;
  };

  render() {
    const {
      originAmount,
      originKind,
      destinationAmount,
      destinationKind
    } = this.props;

    return (
      <article className="swap-start">
        <section className="row">
          <h5 className="col-xs-6 col-xs-offset-3">Your Information</h5>
          <div className="col-xs-3">
            <a
              className="link"
              href="https://bity.com/af/jshkb37v"
              target="_blank"
              rel="noopener"
            >
              {/* Todo - fix*/}
              <img
                className="pull-right"
                src={'https://www.myetherwallet.com/images/logo-bity.svg'}
                width={100}
                height={38}
              />
            </a>
          </div>
        </section>
        <section className="order-info-wrap row">
          <div className="col-sm-4 order-info">
            <h4>
              {` ${toFixedIfLarger(originAmount, 6)} ${originKind}`}
            </h4>
            <p>Amount to send</p>
          </div>
          <div className="col-sm-4 order-info">
            <h4>
              {` ${toFixedIfLarger(destinationAmount, 6)} ${destinationKind}`}
            </h4>
            <p>Amount to receive</p>
          </div>
          <div className="col-sm-4 order-info">
            <h4>
              {` ${toFixedIfLarger(
                this.computedOriginDestinationRatio(),
                6
              )} ${originKind}/${destinationKind} `}
            </h4>
            <p>Your rate</p>
          </div>
        </section>
      </article>
    );
  }
}
