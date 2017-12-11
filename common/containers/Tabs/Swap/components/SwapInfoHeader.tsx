import { RestartSwapAction } from 'actions/swap';
import { SwapInput } from 'reducers/swap/types';
import React, { Component } from 'react';
import translate from 'translations';
import { toFixedIfLarger } from 'utils/formatters';
import './SwapInfoHeader.scss';
import SwapInfoHeaderTitle from './SwapInfoHeaderTitle';

export interface SwapInfoHeaderProps {
  origin: SwapInput;
  destination: SwapInput;
  reference: string;
  secondsRemaining: number | null;
  restartSwap(): RestartSwapAction;
}

export default class SwapInfoHeader extends Component<SwapInfoHeaderProps, {}> {
  public computedOriginDestinationRatio = () => {
    const { origin, destination } = this.props;
    if (!origin.amount || !destination.amount) {
      return;
    }
    return destination.amount / origin.amount;
  };

  public isExpanded = () => {
    const { reference, restartSwap } = this.props;
    return reference && restartSwap;
  };

  public computedClass = () => {
    if (this.isExpanded()) {
      return 'SwapInfo-details-block col-sm-3';
    } else {
      return 'SwapInfo-details-block col-sm-4';
    }
  };

  public formattedTime = () => {
    const { secondsRemaining } = this.props;
    if (secondsRemaining || secondsRemaining === 0) {
      const minutes = Math.floor(secondsRemaining / 60);
      const seconds = secondsRemaining - minutes * 60;
      const stringMinutes = minutes < 10 ? '0' + minutes : minutes;
      const stringSeconds = seconds < 10 ? '0' + seconds : seconds;
      return stringMinutes + ':' + stringSeconds;
    } else {
      throw Error('secondsRemaining must be a number');
    }
  };

  public render() {
    const computedOriginDestinationRatio = this.computedOriginDestinationRatio();
    const { reference, origin, destination, restartSwap } = this.props;
    return (
      <div className="SwapInfo">
        <SwapInfoHeaderTitle restartSwap={restartSwap} />
        <section className="SwapInfo-details row">
          {/*Amount to send*/}
          {!this.isExpanded() && (
            <div className={this.computedClass()}>
              <h3 className="SwapInfo-details-block-value">{` ${origin.amount} ${origin.id}`}</h3>
              <p className="SwapInfo-details-block-label">{translate('SEND_amount')}</p>
            </div>
          )}

          {/*Reference Number*/}
          {this.isExpanded() && (
            <div className={this.computedClass()}>
              <h3 className="SwapInfo-details-block-value">{reference}</h3>
              <p className="SwapInfo-details-block-label">{translate('SWAP_ref_num')}</p>
            </div>
          )}

          {/*Time remaining*/}
          {this.isExpanded() && (
            <div className={this.computedClass()}>
              <h3 className="SwapInfo-details-block-value">{this.formattedTime()}</h3>
              <p className="SwapInfo-details-block-label">{translate('SWAP_time')}</p>
            </div>
          )}

          {/*Amount to Receive*/}
          <div className={this.computedClass()}>
            <h3 className="SwapInfo-details-block-value">
              {` ${destination.amount} ${destination.id}`}
            </h3>
            <p className="SwapInfo-details-block-label">{translate('SWAP_rec_amt')}</p>
          </div>

          {/*Your rate*/}
          <div className={this.computedClass()}>
            <h3 className="SwapInfo-details-block-value">
              {`${computedOriginDestinationRatio &&
                toFixedIfLarger(computedOriginDestinationRatio)} ${destination.id}/${origin.id}`}
            </h3>
            <p className="SwapInfo-details-block-label">{translate('SWAP_your_rate')}</p>
          </div>
        </section>
      </div>
    );
  }
}
