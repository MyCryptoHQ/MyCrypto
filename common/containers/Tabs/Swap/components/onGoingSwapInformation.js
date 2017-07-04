import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toFixedIfLarger } from 'utils/formatters';
import translate from 'translations';

export default class OnGoingSwapInformation extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    referenceNumber: PropTypes.string.isRequired,
    timeRemaining: PropTypes.any, // FIXME
    originAmount: PropTypes.number.isRequired,
    originKind: PropTypes.string.isRequired,
    destinationKind: PropTypes.string.isRequired,
    destinationAmount: PropTypes.number.isRequired,
    restartSwap: PropTypes.func.isRequired
  };

  computedOriginDestinationRatio = () => {
    return toFixedIfLarger(
      this.props.destinationAmount / this.props.originAmount,
      6
    );
  };

  render() {
    const {
      referenceNumber,
      timeRemaining,
      originAmount,
      originKind,
      destinationKind,
      restartSwap
    } = this.props;
    return (
      <div>
        <section className="row text-center">
          <div className="col-xs-3 text-left">
            <button className="btn btn-danger btn-xs" onClick={restartSwap}>
              Start New Swap
            </button>
          </div>
          <h5 className="col-xs-6 ng-scope">{translate('SWAP_information')}</h5>
          <div className="col-xs-3">
            <a
              className="link"
              href="https://bity.com/af/jshkb37v"
              target="_blank"
              rel="noopener"
            >
              <img
                className="pull-right"
                src={'https://www.myetherwallet.com/images/logo-bity.svg'}
                width={100}
                height={38}
              />
            </a>
          </div>
        </section>
        <section className="row order-info-wrap">
          <div className="col-sm-3 order-info">
            <h4>{referenceNumber}</h4>
            <p>{translate('SWAP_ref_num')}</p>
          </div>
          <div className="col-sm-3 order-info">
            <h4>{timeRemaining}</h4>
            <p>
              {translate('SWAP_time')}
            </p>
          </div>
          <div className="col-sm-3 order-info">
            <h4>{originAmount} {originKind}</h4>
            <p>{translate('SWAP_rec_amt')}</p>
          </div>
          <div className="col-sm-3 order-info">
            <h4>
              {`${this.computedOriginDestinationRatio()} ${destinationKind}/${originKind}`}
            </h4>
            <p>{translate('SWAP_your_rate')}</p>
          </div>
        </section>
      </div>
    );
  }
}
