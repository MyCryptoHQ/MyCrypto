import React, { Component } from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { Aux } from 'components/ui';
import moment from 'moment';

class CountDown extends Component<
  {
    initialTime: number;
  },
  {
    currentTime: number;
  }
> {
  public state = { currentTime: 0 };
  constructor() {
    super();
    this.startCountDown();
  }

  public render() {
    const { currentTime } = this.state;
    return <p>{this.humanizeTime(currentTime)}</p>;
  }

  private humanizeTime = (time: number) => {
    let timeRemaining = time;
    const floorTime = unit => Math.floor(timeRemaining / unit);
    const pad = (num: number) => num.toString().padStart(2, '0');
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = floorTime(day);
    timeRemaining -= days * day;
    const hours = floorTime(hour);
    timeRemaining -= hours * hour;
    const minutes = floorTime(minute);
    timeRemaining -= minutes * minute;
    const seconds = floorTime(second);

    return `${pad(days)} Days ${pad(hours)} Hours ${pad(minutes)} Minutes ${pad(
      seconds
    )} Seconds `;
  };

  private startCountDown = () => {
    const intervalId = window.setInterval(() => {
      const nextTime = +moment(this.props.initialTime).diff(+moment(), 'ms');

      if (nextTime < 0) {
        return clearInterval(intervalId);
      }

      this.setState({ currentTime: nextTime });
    }, 1000);
  };
}

const getDeadlines = (registrationDate: string) => {
  // Get the time to reveal bids, and the time when the action closes
  const time = moment(+registrationDate * 1000);
  const auctionCloseTime = +time;
  const revealBidTime = +time.subtract(2, 'days');
  return { auctionCloseTime, revealBidTime };
};

interface ITime {
  text: string;
  time: number;
}

const EnsTime: React.SFC<ITime> = ({ text, time }) => (
  <div className="sm-6 col-xs-12 order-info">
    <p>{text}</p>
    <h4>{moment(time).toString()}</h4>
    <CountDown initialTime={time} />
  </div>
);

export const NameAuction: React.SFC<IBaseDomainRequest> = ({
  registrationDate,
  name
}) => {
  const { auctionCloseTime, revealBidTime } = getDeadlines(registrationDate);
  return (
    <Aux>
      <h1>
        An auction has been started for <strong>{name}.eth.</strong>
      </h1>
      <EnsTime text="Reveal Bids On" time={revealBidTime} />
      <EnsTime text="Auction Closes On" time={auctionCloseTime} />
    </Aux>
  );
};
