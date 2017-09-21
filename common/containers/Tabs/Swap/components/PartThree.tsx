import { TShowNotification } from 'actions/notifications';
import {
  loadBityRatesRequestedSwap,
  restartSwap,
  startOrderTimerSwap,
  startPollBityOrderStatus,
  stopLoadBityRatesSwap,
  stopOrderTimerSwap,
  stopPollBityOrderStatus
} from 'actions/swap';
import React, { Component } from 'react';
import BitcoinQR from './BitcoinQR';
import PaymentInfo from './PaymentInfo';
import SwapProgress from './SwapProgress';

interface ReduxStateProps {
  destinationAddress: string;
  destinationKind: string;
  originKind: string;
  originAmount: number;
  destinationAmount: number;
  isPostingOrder: boolean;
  reference: string;
  secondsRemaining?: number;
  paymentAddress: string;
  orderStatus: string;
  outputTx: any;
}

interface ReduxActionProps {
  loadBityRatesRequestedSwap: typeof loadBityRatesRequestedSwap;
  restartSwap: typeof restartSwap;
  stopLoadBityRatesSwap: typeof stopLoadBityRatesSwap;
  startOrderTimerSwap: typeof startOrderTimerSwap;
  startPollBityOrderStatus: typeof startPollBityOrderStatus;
  stopOrderTimerSwap: typeof stopOrderTimerSwap;
  stopPollBityOrderStatus: typeof stopPollBityOrderStatus;
  showNotification: TShowNotification;
}

export default class PartThree extends Component<
  ReduxActionProps & ReduxStateProps,
  {}
> {
  public componentDidMount() {
    this.props.startPollBityOrderStatus();
    this.props.startOrderTimerSwap();
  }

  public componentWillUnmount() {
    this.props.stopOrderTimerSwap();
    this.props.stopPollBityOrderStatus();
  }

  public render() {
    const {
      // STATE
      originAmount,
      originKind,
      destinationKind,
      paymentAddress,
      orderStatus,
      destinationAddress,
      outputTx,
      destinationAmount,
      // ACTIONS
      showNotification
    } = this.props;

    const SwapProgressProps = {
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

    const BitcoinQRProps = {
      paymentAddress,
      amount: destinationAmount
    };

    return (
      <div>
        <SwapProgress {...SwapProgressProps} />
        <PaymentInfo {...PaymentInfoProps} />
        {orderStatus === 'OPEN' &&
          originKind === 'BTC' &&
          <BitcoinQR {...BitcoinQRProps} />}
      </div>
    );
  }
}
