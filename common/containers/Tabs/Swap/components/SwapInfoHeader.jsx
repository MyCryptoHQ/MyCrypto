// @flow
import './SwapInfoHeader.scss';
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
      <section className="SwapInfo-top row text-center">
        <div className="col-xs-3 text-left">
          <button
            className="SwapInfo-top-back"
            onClick={this.props.restartSwap}
          >
            <i className="fa fa-arrow-left" />
            Start New Swap
          </button>
        </div>
        <div className="col-xs-6">
          <h3 className="SwapInfo-top-title">
            {translate('SWAP_information')}
          </h3>
        </div>
        <div className="col-xs-3">
          <a
            className="SwapInfo-top-logo"
            href={bityReferralURL}
            target="_blank"
            rel="noopener"
          >
            <img className="SwapInfo-top-logo-img" src={bityLogo} />
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
      return 'SwapInfo-details-block col-sm-3';
    } else {
      return 'SwapInfo-details-block col-sm-4';
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
      <div className="SwapInfo">
        <SwapInfoHeaderTitle restartSwap={restartSwap} />
        <section className="SwapInfo-details row">
          {/*Amount to send*/}
          {!this.isExpanded() &&
            <div className={this.computedClass()}>
              <h3 className="SwapInfo-details-block-value">
                {` ${originAmount} ${originKind}`}
              </h3>
              <p className="SwapInfo-details-block-label">
                {translate('SEND_amount')}
              </p>
            </div>}

          {/*Reference Number*/}
          {this.isExpanded() &&
            <div className={this.computedClass()}>
              <h3 className="SwapInfo-details-block-value">
                {reference}
              </h3>
              <p className="SwapInfo-details-block-label">
                {translate('SWAP_ref_num')}
              </p>
            </div>}

          {/*Time remaining*/}
          {this.isExpanded() &&
            <div className={this.computedClass()}>
              <h3 className="SwapInfo-details-block-value">
                {this.formattedTime()}
              </h3>
              <p className="SwapInfo-details-block-label">
                {translate('SWAP_time')}
              </p>
            </div>}

          {/*Amount to Receive*/}
          <div className={this.computedClass()}>
            <h3 className="SwapInfo-details-block-value">
              {` ${destinationAmount} ${destinationKind}`}
            </h3>
            <p className="SwapInfo-details-block-label">
              {translate('SWAP_rec_amt')}
            </p>
          </div>

          {/*Your rate*/}
          <div className={this.computedClass()}>
            <h3 className="SwapInfo-details-block-value">
              {`${toFixedIfLarger(
                this.computedOriginDestinationRatio()
              )} ${originKind}/${destinationKind}`}
            </h3>
            <p className="SwapInfo-details-block-label">
              {translate('SWAP_your_rate')}
            </p>
          </div>
        </section>
      </div>
    );
  }
}
