// @flow
import React, { Component } from 'react';
import type { RestartSwapAction } from 'actions/swapTypes';
import SwapProgress from './SwapProgress';
import PaymentInfo from './PaymentInfo';
import BitcoinQR from './BitcoinQR';

type Props = {
  destinationAddress: string,
  destinationKind: string,
  originKind: string,
  originAmount: number,
  destinationAmount: ?number,
  reference: string,
  secondsRemaining: ?number,
  paymentAddress: ?string,
  orderStatus: ?string,
  outputTx: string,
  restartSwap: () => RestartSwapAction,
  startOrderTimerSwap: Function,
  startPollBityOrderStatus: Function,
  stopOrderTimerSwap: Function,
  stopPollBityOrderStatus: Function,
  showNotification: Function
};

export default class PartThree extends Component<Props> {
  componentDidMount() {
    this.props.startPollBityOrderStatus();
    this.props.startOrderTimerSwap();
  }

  componentWillUnmount() {
    this.props.stopOrderTimerSwap();
    this.props.stopPollBityOrderStatus();
  }

  render() {
    let {
      // STATE
      originAmount,
      originKind,
      destinationKind,
      paymentAddress,
      orderStatus,
      destinationAddress,
      outputTx,
      // ACTIONS
      showNotification
    } = this.props;

    let SwapProgressProps = {
      originKind,
      destinationKind,
      orderStatus,
      showNotification,
      destinationAddress,
      outputTx
    };

    const PaymentInfoProps = {
      originKind,
      originAmount,
      paymentAddress
    };

    return (
      <div>
        <SwapProgress {...SwapProgressProps} />
        <PaymentInfo {...PaymentInfoProps} />
        {orderStatus === 'OPEN' && originKind === 'BTC' && <BitcoinQR />}
      </div>
    );
  }
}
