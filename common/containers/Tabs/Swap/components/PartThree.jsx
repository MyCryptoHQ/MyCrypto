import React, { Component } from 'react';
import type {
  LoadBityRatesRequestedSwapAction,
  RestartSwapAction,
  StopLoadBityRatesSwapAction
} from 'actions/swap';
import SwapProgress from './SwapProgress';
import PaymentInfo from './PaymentInfo';

type ReduxStateProps = {
  destinationAddress: string,
  destinationKind: string,
  originKind: string,
  originAmount: ?number,
  destinationAmount: ?number,
  isPostingOrder: boolean,
  reference: string,
  secondsRemaining: ?number,
  paymentAddress: ?string,
  orderStatus: ?string
};

type ReduxActionProps = {
  loadBityRatesRequestedSwap: () => LoadBityRatesRequestedSwapAction,
  restartSwap: () => RestartSwapAction,
  stopLoadBityRatesSwap: () => StopLoadBityRatesSwapAction,
  startOrderTimerSwap: Function,
  startPollBityOrderStatus: Function,
  stopOrderTimerSwap: Function,
  stopPollBityOrderStatus: Function,
  showNotification: Function
};

export default class PartThree extends Component {
  props: ReduxActionProps & ReduxStateProps;

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
      </div>
    );
  }
}
