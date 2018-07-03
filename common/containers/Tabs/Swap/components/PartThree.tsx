import React, { PureComponent } from 'react';

import { notificationsActions } from 'features/notifications';
import { SwapInput } from 'features/swap/types';
import {
  TRestartSwap,
  TStartPollBityOrderStatus,
  TStartPollShapeshiftOrderStatus,
  TStopOrderTimerSwap,
  TStopPollBityOrderStatus,
  TStopPollShapeshiftOrderStatus,
  TStartOrderTimerSwap
} from 'features/swap/actions';
import BitcoinQR from './BitcoinQR';
import PaymentInfo from './PaymentInfo';
import SwapProgress from './SwapProgress';
import { LiteSend } from './LiteSend';

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
  startOrderTimerSwap: TStartOrderTimerSwap;
  restartSwap: TRestartSwap;
  startPollBityOrderStatus: TStartPollBityOrderStatus;
  stopPollBityOrderStatus: TStopPollBityOrderStatus;
  startPollShapeshiftOrderStatus: TStartPollShapeshiftOrderStatus;
  stopPollShapeshiftOrderStatus: TStopPollShapeshiftOrderStatus;
  stopOrderTimerSwap: TStopOrderTimerSwap;
  showNotificationWithComponent: notificationsActions.TShowNotificationWithComponent;
}

export default class PartThree extends PureComponent<ReduxActionProps & ReduxStateProps, {}> {
  public componentDidMount() {
    const { provider } = this.props;
    if (provider === 'shapeshift') {
      this.props.startPollShapeshiftOrderStatus();
    } else {
      this.props.startPollBityOrderStatus();
    }
    this.props.startOrderTimerSwap();
  }

  public componentWillUnmount() {
    this.props.stopOrderTimerSwap();
    this.props.stopPollBityOrderStatus();
    this.props.stopPollShapeshiftOrderStatus();
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
      showNotificationWithComponent
    } = this.props;

    const SwapProgressProps = {
      destinationId: destination.label,
      originId: origin.label,
      destinationAddress,
      outputTx,
      provider,
      bityOrderStatus,
      shapeshiftOrderStatus,
      showNotificationWithComponent
    };

    const PaymentInfoProps = {
      origin,
      paymentAddress
    };

    const BitcoinQRProps = {
      paymentAddress,
      destinationAmount: destination.amount as number
    };

    const OpenOrder = bityOrderStatus === 'OPEN' || shapeshiftOrderStatus === 'no_deposits';

    return (
      <div>
        <SwapProgress {...SwapProgressProps} />

        <PaymentInfo {...PaymentInfoProps} />

        <LiteSend />
        {OpenOrder && origin.label === 'BTC' && <BitcoinQR {...BitcoinQRProps} />}
      </div>
    );
  }
}
