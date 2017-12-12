import { TShowNotification } from 'actions/notifications';
import {
  TRestartSwap,
  TStartOrderTimerSwap,
  TStartPollBityOrderStatus,
  TStopOrderTimerSwap,
  TStopPollBityOrderStatus
} from 'actions/swap';
import { SwapInput } from 'reducers/swap/types';
import React, { Component } from 'react';
import BitcoinQR from './BitcoinQR';
import PaymentInfo from './PaymentInfo';
import SwapProgress from './SwapProgress';

interface ReduxStateProps {
  destinationAddress: string;
  origin: SwapInput;
  destination: SwapInput;
  reference: string;
  secondsRemaining: number | null;
  paymentAddress: string | null;
  provider: string;
  bityOrderStatus: string | null;
  shapeshiftOrderStatus: string | null;
  outputTx: any;
}

interface ReduxActionProps {
  restartSwap: TRestartSwap;
  startOrderTimerSwap: TStartOrderTimerSwap;
  startPollBityOrderStatus: TStartPollBityOrderStatus;
  stopOrderTimerSwap: TStopOrderTimerSwap;
  stopPollBityOrderStatus: TStopPollBityOrderStatus;
  showNotification: TShowNotification;
}

export default class PartThree extends Component<ReduxActionProps & ReduxStateProps, {}> {
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
      origin,
      destination,
      paymentAddress,
      provider,
      bityOrderStatus,
      shapeshiftOrderStatus,
      destinationAddress,
      outputTx,
      // ACTIONS
      showNotification
    } = this.props;

    const SwapProgressProps = {
      originId: origin.id,
      destinationId: destination.id,
      provider,
      bityOrderStatus,
      shapeshiftOrderStatus,
      showNotification,
      destinationAddress,
      outputTx
    };

    const PaymentInfoProps = {
      origin,
      paymentAddress
    };

    const BitcoinQRProps = {
      paymentAddress,
      destinationAmount: destination.amount
    };

    const OpenOrder = bityOrderStatus === 'OPEN' || shapeshiftOrderStatus === 'no_deposits';

    return (
      <div>
        <SwapProgress {...SwapProgressProps} />
        <PaymentInfo {...PaymentInfoProps} />
        {OpenOrder && origin.id === 'BTC' && <BitcoinQR {...BitcoinQRProps} />}
      </div>
    );
  }
}
