// @flow
import React, { Component } from 'react';
import translate from 'translations';
import * as swapTypes from 'actions/swapTypes';
import bityLogo from 'assets/images/logo-bity.svg';
import { bityReferralURL } from 'config/data';

export type StateProps = {
  secondsRemaining: string,
  originAmount: number,
  originKind: string,
  destinationKind: string,
  destinationAmount: number,
  reference: string
};

export type ActionProps = {
  restartSwap: () => swapTypes.RestartSwapAction
};

class SwapInfoHeaderTitle extends Component {
  props: ActionProps;

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

export default class SwapInfoHeader extends Component {
  props: StateProps & ActionProps;

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
    let minutes = Math.floor(this.props.secondsRemaining / 60);
    let seconds = this.props.secondsRemaining - minutes * 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ':' + seconds;
  };

  render() {
    const {
      reference,
      originAmount,
      destinationAmount,
      originKind,
      destinationKind,
      restartSwap,
      secondsRemaining
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
              {` ${this.computedOriginDestinationRatio()} ${originKind}/${destinationKind} `}
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
