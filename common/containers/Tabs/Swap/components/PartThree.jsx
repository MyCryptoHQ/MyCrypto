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
  stopPollBityOrderStatus: any
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
      // ACTIONS
      restartSwap
    } = this.props;

    let SwapInfoHeaderProps = {
      reference,
      secondsRemaining,
      originAmount,
      originKind,
      destinationKind,
      destinationAmount,
      restartSwap,
      orderStatus
    };

    const PaymentInfoProps = {
      originKind,
      originAmount,
      paymentAddress
    };

    return (
      <div>
        <SwapProgress {...SwapInfoHeaderProps} />
        <PaymentInfo {...PaymentInfoProps} />
      </div>
    );
  }
}
