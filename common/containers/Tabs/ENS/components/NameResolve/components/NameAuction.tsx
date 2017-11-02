import React, { Component } from 'react';
import { IBaseDomainRequest } from 'libs/ens';
import { Aux } from 'components/ui';

import moment from 'moment';

interface ITime {
  text: string;
  time: number;
}

const getDeadlines = (registrationDate: string) => {
  // Get the time to reveal bids, and the time when the action closes

  const time = moment(+registrationDate * 1000);
  const auctionCloseTime = +time;
  const revealBidTime = +time.subtract(2, 'days');

  return { auctionCloseTime, revealBidTime };
};

interface State {
  currentTime: number;
}
interface Props {
  initialTime: number;
}

class CountDown extends Component<Props, State> {
  public state = { currentTime: 0 };

  constructor() {
    super();

    this.startCountDown();
  }

  public render() {
    return <p>{moment(this.state.currentTime)}</p>;
  }

  private startCountDown = () => {
    const second = 1000;
    const intervalId = window.setInterval(() => {
      const { initialTime } = this.props;
      const nextTime = +moment(initialTime).diff(+moment(), 'ms');

      if (nextTime < 0) {
        return clearInterval(intervalId);
      }
      this.setState({ currentTime: nextTime });

      return { currentTime: nextTime };
    }, second);
  };
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
        <strong>An auction has been started for {name}.eth</strong>
      </h1>
      <EnsTime text="Reveal Bids On" time={revealBidTime} />
      <EnsTime text="Auction Closes On" time={auctionCloseTime} />
    </Aux>
  );
};
