import { TShowNotification } from 'actions/notifications';
import {
  TRestartSwap,
  TStartPollBityOrderStatus,
  TStartPollShapeshiftOrderStatus,
  TStopOrderTimerSwap,
  TStopPollBityOrderStatus,
  TStopPollShapeshiftOrderStatus
} from 'actions/swap';
import { SwapInput } from 'reducers/swap/types';
import React, { PureComponent } from 'react';
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
  restartSwap: TRestartSwap;
  startPollBityOrderStatus: TStartPollBityOrderStatus;
  stopPollBityOrderStatus: TStopPollBityOrderStatus;
  startPollShapeshiftOrderStatus: TStartPollShapeshiftOrderStatus;
  stopPollShapeshiftOrderStatus: TStopPollShapeshiftOrderStatus;
  stopOrderTimerSwap: TStopOrderTimerSwap;
  showNotification: TShowNotification;
}

export default class PartThree extends PureComponent<ReduxActionProps & ReduxStateProps, {}> {
  public componentDidMount() {
    const { provider } = this.props;
    if (provider === 'shapeshift') {
      this.props.startPollShapeshiftOrderStatus();
    } else {
      this.props.startPollBityOrderStatus();
    }
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
      showNotification
    } = this.props;

    const SwapProgressProps = {
      originId: origin.label,
      destinationId: destination.label,
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
