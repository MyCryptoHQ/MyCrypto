import React, { Component } from 'react';
import { DatepickerCommonProps } from './DateTime';

interface State {
  [key: string]: any;

  hours: any;
  minutes: any;
  seconds: any;
  milliseconds: any;
  daypart: string | boolean;
  counters: string[];
}

type Props = DatepickerCommonProps;

export default class DateTimePickerTime extends Component<Props, State> {
  public timeConstraints: any;
  public timer: NodeJS.Timer;
  public increaseTimer: NodeJS.Timer;
  public mouseUpListener: () => void;
  public padValues = {
    hours: 1,
    minutes: 2,
    seconds: 2,
    milliseconds: 3
  };

  constructor(props: any) {
    super(props);

    this.state = this.getInitialState();
  }

  public getInitialState() {
    return this.calculateState(this.props);
  }

  public calculateState(props: Props): State {
    const date = props.selectedDate || props.viewDate;
    const counters: string[] = [];

    const { timeFormat } = this.props;

    if (!timeFormat || typeof timeFormat !== 'string') {
      return {} as State;
    }

    if (timeFormat.toLowerCase().indexOf('h') !== -1) {
      counters.push('hours');
      if (timeFormat.indexOf('m') !== -1) {
        counters.push('minutes');
        if (timeFormat.indexOf('s') !== -1) {
          counters.push('seconds');
        }
      }
    }

    const hours = date.format('H');

    let daypart: boolean | string = false;
    if (this.state !== null && timeFormat.toLowerCase().indexOf(' a') !== -1) {
      if (timeFormat.indexOf(' A') !== -1) {
        daypart = hours >= 12 ? 'PM' : 'AM';
      } else {
        daypart = hours >= 12 ? 'pm' : 'am';
      }
    }

    return {
      hours,
      minutes: date.format('mm'),
      seconds: date.format('ss'),
      milliseconds: date.format('SSS'),
      daypart,
      counters
    };
  }

  public renderCounter(type: string) {
    const { timeFormat } = this.props;

    if (type === 'daypart') {
      return '';
    }

    let value = (this.state as any)[type];
    if (
      type === 'hours' &&
      (timeFormat &&
        typeof timeFormat === 'string' &&
        timeFormat.toLowerCase().indexOf(' a') !== -1)
    ) {
      value = ((value - 1) % 12) + 1;

      if (value === 0) {
        value = 12;
      }
    }

    return (
      <div key={type} className="rdtCounter">
        <span
          className="rdtBtn"
          onMouseDown={this.onStartClicking('increase', type)}
          onContextMenu={this.disableContextMenu}
        >
          ▲
        </span>
        <div className="rdtCount">{value}</div>
        <span
          className="rdtBtn"
          onMouseDown={this.onStartClicking('decrease', type)}
          onContextMenu={this.disableContextMenu}
        >
          ▼
        </span>
      </div>
    );
  }

  public render() {
    const { timeFormat } = this.props;
    const counters: any[] = [];

    this.state.counters.forEach((c: any) => {
      if (counters.length) {
        counters.push(
          <div key={`sep${counters.length}`} className="rdtCounterSeparator">
            :
          </div>
        );
      }

      counters.push(this.renderCounter(c));
    });

    if (this.state.daypart !== false) {
      counters.push(
        <div className="rdtCounter" key={counters.length}>
          <span
            className="rdtBtn"
            onMouseDown={this.onStartClicking('toggleDayPart', 'hours')}
            onContextMenu={this.disableContextMenu}
          >
            ▲
          </span>
          <div className="rdtCount">{this.state.daypart}</div>
          <span
            className="rdtBtn"
            onMouseDown={this.onStartClicking('toggleDayPart', 'hours')}
            onContextMenu={this.disableContextMenu}
          >
            ▼
          </span>
        </div>
      );
    }

    if (
      this.state.counters.length === 3 &&
      timeFormat &&
      typeof timeFormat === 'string' &&
      timeFormat.indexOf('S') !== -1
    ) {
      counters.push(<div className="rdtCounterSeparator" key="sep5" />, ':');
      counters.push(
        <div className="rdtCounter rdtMilli" key="m">
          <input value={this.state.milliseconds} type="text" onChange={this.updateMilli} />
        </div>
      );
    }

    return (
      <div className="rdtTime">
        <table>
          <tbody key="b">
            <tr>
              <td>
                <div className="rdtCounters">{counters}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  public componentWillMount() {
    this.timeConstraints = {
      hours: {
        min: 0,
        max: 23,
        step: 1
      },
      minutes: {
        min: 0,
        max: 59,
        step: 1
      },
      seconds: {
        min: 0,
        max: 59,
        step: 1
      },
      milliseconds: {
        min: 0,
        max: 999,
        step: 1
      }
    };
    ['hours', 'minutes', 'seconds', 'milliseconds'].forEach(type => {
      Object.assign(this.timeConstraints[type], this.props.timeConstraints[type]);
    });
    this.setState(this.calculateState(this.props));
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.setState(this.calculateState(nextProps));
  }

  public updateMilli(e: any) {
    const milli = parseInt(e.target.value, 10);
    if (milli === e.target.value && milli >= 0 && milli < 1000) {
      this.props.setTime('milliseconds', milli);
      this.setState({ milliseconds: milli });
    }
  }

  public onStartClicking(action: any, type: any) {
    const me = this;

    return () => {
      const update: any = {};
      update[type] = (me as any)[action](type);
      me.setState(update);

      me.timer = setTimeout(() => {
        me.increaseTimer = setInterval(() => {
          update[type] = (me as any)[action](type);
          me.setState(update);
        }, 70);
      }, 500);

      me.mouseUpListener = () => {
        clearTimeout(me.timer);
        clearInterval(me.increaseTimer);
        me.props.setTime(type, me.state[type]);
        document.body.removeEventListener('mouseup', me.mouseUpListener);
        document.body.removeEventListener('touchend', me.mouseUpListener);
      };

      document.body.addEventListener('mouseup', me.mouseUpListener);
      document.body.addEventListener('touchend', me.mouseUpListener);
    };
  }

  public disableContextMenu(event: any) {
    event.preventDefault();
    return false;
  }

  public toggleDayPart(type: string) {
    // type is always 'hours'
    let value = parseInt(this.state[type], 10) + 12;
    if (value > this.timeConstraints[type].max) {
      value = this.timeConstraints[type].min + (value - (this.timeConstraints[type].max + 1));
    }
    return this.pad(type, value);
  }

  public increase(type: any) {
    let value = parseInt(this.state[type], 10) + this.timeConstraints[type].step;
    if (value > this.timeConstraints[type].max) {
      value = this.timeConstraints[type].min + (value - (this.timeConstraints[type].max + 1));
    }
    return this.pad(type, value);
  }

  public decrease(type: any) {
    let value = parseInt(this.state[type], 10) - this.timeConstraints[type].step;
    if (value < this.timeConstraints[type].min) {
      value = this.timeConstraints[type].max + 1 - (this.timeConstraints[type].min - value);
    }
    return this.pad(type, value);
  }

  public pad(type: any, value: any) {
    let str = value + '';
    while (str.length < (this.padValues as any)[type]) {
      str = '0' + str;
    }
    return str;
  }
}
