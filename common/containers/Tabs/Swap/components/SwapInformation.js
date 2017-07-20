import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toFixedIfLarger } from 'utils/formatters';
import translate from 'translations';

export type ReduxStateProps = {
  originAmount: PropTypes.number.isRequired,
  destinationAmount: PropTypes.number.isRequired,
  originKind: PropTypes.string.isRequired,
  destinationKind: PropTypes.string.isRequired
};

export default class SwapInformation extends Component {
  props: ReduxStateProps;

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
          <h5 className="col-xs-6 col-xs-offset-3">
            {translate('SWAP_information')}
          </h5>
          <div className="col-xs-3">
            <a
              className="link"
              href="https://bity.com/af/jshkb37v"
              target="_blank"
              rel="noopener"
            >
              {/* Todo - fix*/}
              <img
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
            <p>
              {translate('SEND_amount')}
            </p>
          </div>
          <div className="col-sm-4 order-info">
            <h4>
              {` ${toFixedIfLarger(destinationAmount, 6)} ${destinationKind}`}
            </h4>
            <p>
              {translate('SWAP_rec_amt')}
            </p>
          </div>
          <div className="col-sm-4 order-info">
            <h4>
              {` ${toFixedIfLarger(
                this.computedOriginDestinationRatio(),
                6
              )} ${originKind}/${destinationKind} `}
            </h4>
            <p>
              {translate('SWAP_your_rate')}
            </p>
          </div>
        </section>
      </article>
    );
  }
}
