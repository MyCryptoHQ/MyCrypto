import React, { Component } from 'react';
import moment from 'moment';

interface Props {
  initialTime: number;
}

interface State {
  timeDisplay: string;
}

class CountDown extends Component<Props, State> {
  public state = { timeDisplay: '' };

  public componentDidMount() {
    this.startCountDown();
  }

  public render() {
    return <p>{this.state.timeDisplay}</p>;
  }

  private startCountDown = () => {
    const time = moment(this.props.initialTime);
    let intervalId;

    const setTimeDisplay = () => {
      const diff = moment.duration(time.diff(moment()));
      let timeDisplay;

      if (diff) {
        const pieces = [
          diff.days() > 0 && `${diff.days()} days`,
          diff.hours() > 0 && `${diff.hours()} hours`,
          diff.minutes() > 0 && `${diff.minutes()} minutes`,
          diff.seconds() > 0 && `${diff.seconds()} seconds`
        ].filter(piece => !!piece);
        timeDisplay = `in ${pieces.join(', ')}`;
      } else {
        clearInterval(intervalId);
        timeDisplay = 'Auction is over!';
      }

      this.setState({ timeDisplay });
    };

    intervalId = setInterval(setTimeDisplay, 1000);
    setTimeDisplay();
  };
}

interface ITime {
  text: string;
  time: number;
}

const ENSTime: React.SFC<ITime> = ({ text, time }) => (
  <section>
    <p>{text}</p>
    <h4>{moment(time).format('LLLL')}</h4>
    <CountDown initialTime={time} />
  </section>
);

export default ENSTime;
