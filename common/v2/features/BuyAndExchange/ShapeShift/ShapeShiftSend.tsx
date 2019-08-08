import React, { Component } from 'react';

import { ShapeShiftService, SendAmountResponse, DepositStatuses } from 'v2/services';
import { ShapeShiftSendField } from './components';
import { SHAPESHIFT_STATUS_PING_RATE } from './constants';
import { getSecondsRemaining, getTimeRemaining, getStatusWording } from './helpers';
import strategies from './strategies';
import './ShapeShiftSend.scss';

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
    const { transaction } = this.props;
    const { timeRemaining, status } = this.state;
    const { orderId, withdrawalAmount, depositAmount, quotedRate, pair, deposit } = transaction;
    const [depositAsset, withdrawAsset] = pair.toUpperCase().split('_');
    const { generateSendScreenLayout } = strategies[depositAsset] || strategies.default;

    return (
      <section className="ShapeShiftSend-wrapper">
        <form className="ShapeShiftSend ShapeShiftWidget">
          {generateSendScreenLayout({
            transaction,
            sendField: (
              <ShapeShiftSendField dark={true} label="Send" value={depositAmount}>
                <h2>{depositAsset}</h2>
              </ShapeShiftSendField>
            ),
            addressField: (
              <ShapeShiftSendField
                dark={true}
                label="to this address"
                value={deposit}
                className="smallest"
              />
            ),
            timeField: (
              <ShapeShiftSendField
                label="Time remaining"
                value={timeRemaining}
                className="smaller"
              />
            ),
            receiveAmountField: (
              <ShapeShiftSendField
                label="Amount to receive"
                value={withdrawalAmount}
                className="smaller"
              >
                <h3>{withdrawAsset}</h3>
              </ShapeShiftSendField>
            ),
            rateField: (
              <ShapeShiftSendField label="Rate" value={quotedRate} className="smaller">
                <h3>
                  {withdrawAsset}/{depositAsset}
                </h3>
              </ShapeShiftSendField>
            ),
            referenceNumberField: (
              <ShapeShiftSendField label="Reference number" value={orderId} className="smallest" />
            ),
            statusField: (
              <ShapeShiftSendField
                label="Status"
                value={getStatusWording(status)}
                className="smaller uppercase"
              />
            )
          })}
        </form>
      </section>
    );
  }

  private tick = () =>
    this.setState({
      timeRemaining: getTimeRemaining(this.props.transaction.expiration)
    });

  private checkStatus = async () => {
    const {
      transaction: { deposit }
    } = this.props;
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
