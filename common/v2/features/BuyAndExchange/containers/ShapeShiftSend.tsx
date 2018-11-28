import React, { Component } from 'react';

import { ShapeShiftService, SendAmountResponse, DepositStatuses } from 'v2/services';
import { SHAPESHIFT_STATUS_PING_RATE } from '../constants';
import { getSecondsRemaining, getTimeRemaining, getStatusWording } from '../helpers';

interface Props {
  transaction: SendAmountResponse;
}

interface State {
  timeRemaining: string;
  status: DepositStatuses;
}

export default class ShapeShiftSend extends Component<Props> {
  public state: State = {
    timeRemaining: getTimeRemaining(this.props.transaction.expiration),
    status: DepositStatuses.no_deposits
  };

  private timeRemainingInterval: NodeJS.Timer | null = null;
  private statusInterval: NodeJS.Timer | null = null;

  public componentDidMount() {
    this.timeRemainingInterval = setInterval(this.tick, 1000);
    this.statusInterval = setInterval(this.checkStatus, SHAPESHIFT_STATUS_PING_RATE);
  }

  public componentDidUpdate() {
    const { status } = this.state;

    if (![DepositStatuses.out_of_time, DepositStatuses.error].includes(status)) {
      const secondsRemaining = getSecondsRemaining(this.props.transaction.expiration);

      if (secondsRemaining <= 0) {
        this.stopIntervals();
        this.setState({ status: DepositStatuses.out_of_time });
      }
    }
  }

  public componentWillUnmount() {
    this.stopIntervals();
  }

  public render() {
    const {
      transaction: { orderId, withdrawalAmount, depositAmount, quotedRate, pair, deposit }
    } = this.props;
    const { timeRemaining, status } = this.state;
    const [depositAsset, withdrawAsset] = pair.toUpperCase().split('_');

    return (
      <section className="ShapeShiftSend">
        <ul>
          <li>Reference number: {orderId}</li>
          <li>Time remaining: {timeRemaining}</li>
          <li>
            Amount of {withdrawAsset} to receive: {withdrawalAmount}
          </li>
          <li>
            Rate: {quotedRate} {withdrawAsset}/{depositAsset}
          </li>
        </ul>
        <p>
          Send {depositAmount} {depositAsset} to{' '}
        </p>
        <input type="text" disabled={true} value={deposit} />
        <div>Status: {getStatusWording(status)}</div>
      </section>
    );
  }

  private tick = () =>
    this.setState({
      timeRemaining: getTimeRemaining(this.props.transaction.expiration)
    });

  private checkStatus = async () => {
    const { transaction: { deposit } } = this.props;
    const status = await ShapeShiftService.instance.getDepositStatus(deposit);

    if (status === DepositStatuses.complete) {
      this.stopIntervals();
    }

    this.setState({ status });
  };

  private stopIntervals = () => {
    clearInterval(this.timeRemainingInterval as NodeJS.Timer);
    clearInterval(this.statusInterval as NodeJS.Timer);
  };
}
