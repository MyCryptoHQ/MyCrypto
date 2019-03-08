import React, { Component } from 'react';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface Props {
  addTime?: any;
  isValidDate?: any;
  renderMonth?: any;
  selectedDate?: any;
  setDate?: any;
  showView?: any;
  subtractTime?: any;
  updateOn?: any;
  updateSelectedDate?: any;
  viewDate?: any;
}

export default class DateTimePickerMonths extends Component<Props> {
  constructor(props: any) {
    super(props);

    this.renderMonth = this.renderMonth.bind(this);
  }

  public render() {
    return (
      <div className="rdtMonths">
        <table>
          <thead>
            <tr>
              <th className="rdtPrev" onClick={() => this.props.subtractTime(1, 'years')}>
                <span>‹</span>
              </th>
              <th
                className="rdtSwitch"
                onClick={() => this.props.showView('years')}
                colSpan={2}
                data-value={this.props.viewDate.year()}
              >
                {this.props.viewDate.year()}
              </th>
              <th className="rdtNext" onClick={() => this.props.addTime(1, 'years')}>
                <span>›</span>
              </th>
            </tr>
          </thead>
        </table>
        <table>
          <tbody>{this.renderMonths()}</tbody>
        </table>
      </div>
    );
  }

  private renderMonths() {
    const date = this.props.selectedDate;
    const month = this.props.viewDate.month();
    const year = this.props.viewDate.year();
    const rows: JSX.Element[] = [];
    let i = 0;
    let months: JSX.Element[] = [];
    const renderer = this.props.renderMonth || this.renderMonth;
    const isValid = this.props.isValidDate || this.alwaysValidDate;
    let classes;
    let props;
    let isDisabled;
    let noOfDaysInMonth;
    let daysInMonth;
    let validDay;
    // Date is irrelevant because we're only interested in month
    const irrelevantDate = 1;

    let currentMonth: any;

    while (i < 12) {
      classes = 'rdtMonth';
      currentMonth = this.props.viewDate.clone().set({ year, month: i, date: irrelevantDate });

      noOfDaysInMonth = currentMonth.endOf('month').format('D');
      // tslint:disable-next-line:variable-name
      daysInMonth = Array.from({ length: noOfDaysInMonth }, (_e: any, j: number) => {
        return j + 1;
      });

      validDay = daysInMonth.find(d => {
        const day = currentMonth.clone().set('date', d);
        return isValid(day);
      });

      isDisabled = validDay === undefined;

      if (isDisabled) {
        classes += ' rdtDisabled';
      }

      if (date && i === date.month() && year === date.year()) {
        classes += ' rdtActive';
      }

      props = {
        key: i,
        'data-value': i,
        className: classes
      };

      if (!isDisabled) {
        props.onClick = this.props.setDate('month');
      }

      months.push(renderer(props, i, year, date && date.clone()));

      if (months.length === 4) {
        rows.push(<tr key={month + '_' + rows.length}>{months}</tr>);
        months = [];
      }

      i++;
    }

    return rows;
  }

  private renderMonth(props: any, month: any) {
    const localMoment = this.props.viewDate;
    const monthStr = localMoment.localeData().monthsShort(localMoment.month(month));
    const strLength = 3;
    // Because some months are up to 5 characters long, we want to
    // use a fixed string length for consistency
    const monthStrFixedLength = monthStr.substring(0, strLength);

    return <td {...props}>{capitalize(monthStrFixedLength)}</td>;
  }

  private alwaysValidDate() {
    return 1;
  }
}
