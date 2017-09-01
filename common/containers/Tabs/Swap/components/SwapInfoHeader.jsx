// @flow
import React, { Component } from 'react';
import translate from 'translations';
import type { RestartSwapAction } from 'actions/swapTypes';
import bityLogo from 'assets/images/logo-bity.svg';
import { bityReferralURL } from 'config/data';
import { toFixedIfLarger } from 'utils/formatters';

export type SwapInfoHeaderTitleProps = {
  restartSwap: () => RestartSwapAction
};

class SwapInfoHeaderTitle extends Component {
  props: SwapInfoHeaderTitleProps;

  render() {
    return (
      <section className="row text-center">
        <div className="col-xs-3 text-left">
          <button
            className="btn btn-danger btn-xs"
            onClick={this.props.restartSwap}
          >
            Start New Swap
          </button>
        </div>
        <h5 className="col-xs-6">
          {translate('SWAP_information')}
        </h5>
        <div className="col-xs-3">
          <a
            className="link"
            href={bityReferralURL}
            target="_blank"
            rel="noopener"
          >
            <img
              className="pull-right"
              src={bityLogo}
              width={100}
              height={38}
            />
          </a>
        </div>
      </section>
    );
  }
}

export type SwapInfoHeaderProps = {
  originAmount: number,
  originKind: string,
  destinationKind: string,
  destinationAmount: number,
  reference: string,
  secondsRemaining: ?number,
  restartSwap: () => RestartSwapAction
};

export default class SwapInfoHeader extends Component {
  props: SwapInfoHeaderProps;

  computedOriginDestinationRatio = () => {
    return this.props.destinationAmount / this.props.originAmount;
  };

  isExpanded = () => {
    const { reference, restartSwap } = this.props;
    return reference && restartSwap;
  };

  computedClass = () => {
    if (this.isExpanded()) {
      return 'col-sm-3 order-info';
    } else {
      return 'col-sm-4 order-info';
    }
  };

  formattedTime = () => {
    const { secondsRemaining } = this.props;
    if (secondsRemaining || secondsRemaining === 0) {
      let minutes = Math.floor(secondsRemaining / 60);
      let seconds = secondsRemaining - minutes * 60;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      return minutes + ':' + seconds;
    } else {
      throw Error('secondsRemaining must be a number');
    }
  };

  render() {
    const {
      reference,
      originAmount,
      destinationAmount,
      originKind,
      destinationKind,
      restartSwap
    } = this.props;
    return (
      <div>
        <SwapInfoHeaderTitle restartSwap={restartSwap} />
        <section className="row order-info-wrap">
          {/*Amount to send*/}
          {!this.isExpanded() &&
            <div className={this.computedClass()}>
              <h4>
                {` ${originAmount} ${originKind}`}
              </h4>
              <p>
                {translate('SEND_amount')}
              </p>
            </div>}

          {/*Reference Number*/}
          {this.isExpanded() &&
            <div className={this.computedClass()}>
              <h4>
                {reference}
              </h4>
              <p>
                {translate('SWAP_ref_num')}
              </p>
            </div>}

          {/*Time remaining*/}
          {this.isExpanded() &&
            <div className={this.computedClass()}>
              <h4>
                {this.formattedTime()}
              </h4>
              <p>
                {translate('SWAP_time')}
              </p>
            </div>}

          {/*Amount to Receive*/}
          <div className={this.computedClass()}>
            <h4>
              {` ${destinationAmount} ${destinationKind}`}
            </h4>
            <p>
              {translate('SWAP_rec_amt')}
            </p>
          </div>

          {/*Your rate*/}
          <div className={this.computedClass()}>
            <h4>
              {` ${toFixedIfLarger(
                this.computedOriginDestinationRatio()
              )} ${originKind}/${destinationKind} `}
            </h4>
            <p>
              {translate('SWAP_your_rate')}
            </p>
          </div>
        </section>
      </div>
    );
  }
}
