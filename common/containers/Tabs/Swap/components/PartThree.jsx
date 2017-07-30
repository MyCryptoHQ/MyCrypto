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
  startOrderTimerSwap: any,
  startPollBityOrderStatus: any,
  stopOrderTimerSwap: any,
  stopPollBityOrderStatus: any,
  showNotification: any
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
      destinationAmount,
      originKind,
      destinationKind,
      secondsRemaining,
      paymentAddress,
      orderStatus,
      reference,
      destinationAddress,
      // ACTIONS
      restartSwap,
      showNotification
    } = this.props;

    let SwapProgress = {
      reference,
      secondsRemaining,
      originAmount,
      originKind,
      destinationKind,
      destinationAmount,
      restartSwap,
      orderStatus,
      showNotification,
      destinationAddress
    };

    const PaymentInfoProps = {
      originKind,
      originAmount,
      paymentAddress
    };

    return (
      <div>
        <SwapProgress {...SwapProgress} />
        <PaymentInfo {...PaymentInfoProps} />
      </div>
    );
  }
}
