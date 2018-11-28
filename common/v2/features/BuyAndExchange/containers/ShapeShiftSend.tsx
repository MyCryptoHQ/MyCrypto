import React, { Component } from 'react';

import { SendAmountResponse } from 'v2/services';
import { getSecondsRemaining, getTimeRemaining } from '../helpers';

interface Props {
  transaction: SendAmountResponse;
}

interface State {
  timeRemaining: string;
}

export default class ShapeShiftSend extends Component<Props> {
  public state: State = {
    timeRemaining: getTimeRemaining(this.props.transaction.expiration)
  };

  private interval: NodeJS.Timer | null = null;

  public componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  public componentDidUpdate() {
    const secondsRemaining = getSecondsRemaining(this.props.transaction.expiration);

    if (secondsRemaining <= 0) {
      clearInterval(this.interval as NodeJS.Timer);
    }
  }

  public componentWillUnmount() {
    clearInterval(this.interval as NodeJS.Timer);
  }

  public render() {
    const {
      transaction: { orderId, withdrawalAmount, depositAmount, quotedRate, pair, deposit }
    } = this.props;
    const { timeRemaining } = this.state;
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
      </section>
    );
  }

  private tick = () =>
    this.setState({
      timeRemaining: getTimeRemaining(this.props.transaction.expiration)
    });
}
