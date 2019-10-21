import React, { Component } from 'react';
import moment from 'moment';

interface Props {
  addTime?: any;
  isValidDate?: any;
  renderDay?: any;
  selectedDate?: any;
  showView?: any;
  subtractTime?: any;
  updateSelectedDate?: any;
  viewDate?: any;
}

export default class DateTimePickerDays extends Component<Props> {
  public render() {
    const date = this.props.viewDate;
    const locale = date.localeData();

    return (
      <div className="rdtDays">
        <table>
          <thead>
            <tr>
              <th className="rdtPrev" onClick={() => this.props.subtractTime(1, 'months')}>
                <span>‹</span>
              </th>
              <th
                className="rdtSwitch"
                onClick={() => this.props.showView('months')}
                colSpan={5}
                data-value={this.props.viewDate.month()}
              >
                {locale.months(date) + ' ' + date.year()}
              </th>
              <th className="rdtNext" onClick={() => this.props.addTime(1, 'months')}>
                <span>›</span>
              </th>
            </tr>
            <tr>
              {this.getDaysOfWeek(locale).map((day, index) => (
                <th key={day + index} className="dow">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{this.renderDays()}</tbody>
        </table>
      </div>
    );
  }

  /**
   * Get a list of the days of the week
   * depending on the current locale
   * @return {array} A list with the shortname of the days
   */
  public getDaysOfWeek(locale: any) {
    const days = locale._weekdaysMin;
    const first = locale.firstDayOfWeek();
    const dow: string[] = [];

    days.forEach((day: string, index: number) => {
      dow[(7 + index - first) % 7] = day;
    });

    return dow;
  }

  public renderDays() {
    const date = this.props.viewDate;
    const selected = this.props.selectedDate && this.props.selectedDate.clone();
    const prevMonth = date.clone().subtract(1, 'months');
    const currentYear = date.year();
    const currentMonth = date.month();
    const weeks: JSX.Element[] = [];
    let days: JSX.Element[] = [];
    const renderer = this.props.renderDay || this.renderDay;
    const isValid = this.props.isValidDate || this.alwaysValidDate;
    let classes;
    let isDisabled;
    let dayProps;
    let currentDate;

    const endOfCurrentMonth = date.endOf('month');

    // Go to the last week of the previous month
    prevMonth.date(prevMonth.daysInMonth()).startOf('week');
    const lastDay = prevMonth.clone().add(42, 'd');

    while (prevMonth.isBefore(lastDay)) {
      classes = 'rdtDay';
      currentDate = prevMonth.clone();
      let rdtNew = false;

      if (
        (prevMonth.year() === currentYear && prevMonth.month() < currentMonth) ||
        prevMonth.year() < currentYear
      ) {
        classes += ' rdtOld';
      } else if (
        (prevMonth.year() === currentYear && prevMonth.month() > currentMonth) ||
        prevMonth.year() > currentYear
      ) {
        rdtNew = true;
      }

      if (selected && prevMonth.isSame(selected, 'day')) {
        classes += ' rdtActive';
      }

      if (prevMonth.isSame(moment(), 'day')) {
        classes += ' rdtToday';
      }

      isDisabled = !isValid(currentDate, selected);
      if (isDisabled) {
        classes += ' rdtDisabled';
      }

      if (!rdtNew) {
        dayProps = {
          key: prevMonth.format('M_D'),
          'data-value': prevMonth.date(),
          className: classes
        };

        if (!isDisabled) {
          (dayProps as any).onClick = (event: any) => this.updateSelectedDate(event);
        }

        days.push(renderer(dayProps, currentDate, selected));
      }

      if (
        days.length === 7 ||
        (prevMonth.date() === endOfCurrentMonth.date() && prevMonth.month() === currentMonth)
      ) {
        weeks.push(<tr key={prevMonth.format('M_D')}>{days}</tr>);

        days = [];
      }

      prevMonth.add(1, 'd');
    }

    return weeks;
  }

  public updateSelectedDate(event: any) {
    this.props.updateSelectedDate(event, true);
  }

  public renderDay(props: any[], currentDate: any) {
    return <td {...props}>{currentDate.date()}</td>;
  }

  public alwaysValidDate() {
    return 1;
  }
}
