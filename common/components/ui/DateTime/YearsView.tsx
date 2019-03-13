import React, { Component } from 'react';
import { DatepickerCommonProps } from './DateTime';

interface OwnProps {
  updateOn?: string;
}

type Props = DatepickerCommonProps & OwnProps;

export default class DateTimePickerYears extends Component<Props> {
  public render() {
    const year = this.props.viewDate.year();

    return (
      <div className="rdtYears">
        <table>
          <thead>
            <tr>
              <th className="rdtPrev" onClick={() => this.props.subtractTime(10, 'years')}>
                <span>‹</span>
              </th>
              <th className="rdtSwitch" onClick={() => this.props.showView('years')} colSpan={2}>
                {year + '-' + (year + 9)}
              </th>
              <th className="rdtNext" onClick={() => this.props.addTime(10, 'years')}>
                <span>›</span>
              </th>
            </tr>
          </thead>
        </table>
        <table>
          <tbody>{this.renderYears(year)}</tbody>
        </table>
      </div>
    );
  }

  public renderYears(year: number) {
    let years: JSX.Element[] = [];
    let i = -1;
    const rows: JSX.Element[] = [];
    const renderer = this.props.renderYear || this.renderYear;
    const selectedDate = this.props.selectedDate;
    const isValid: any = this.props.isValidDate || this.alwaysValidDate;
    let classes;
    let props: any;
    let currentYear: any;
    let isDisabled;
    let noOfDaysInYear;
    let daysInYear;
    let validDay;
    // Month and date are irrelevant here because
    // we're only interested in the year
    const irrelevantMonth = 0;
    const irrelevantDate = 1;

    year--;
    while (i < 11) {
      classes = 'rdtYear';
      currentYear = this.props.viewDate
        .clone()
        .set({ year, month: irrelevantMonth, date: irrelevantDate });

      noOfDaysInYear = currentYear.endOf('year').format('DDD');
      // tslint:disable-next-line:variable-name
      daysInYear = Array.from({ length: noOfDaysInYear }, (_e, j) => {
        return j + 1;
      });

      validDay = daysInYear.find(d => {
        const day = currentYear.clone().dayOfYear(d);
        return isValid(day);
      });

      isDisabled = validDay === undefined;

      if (isDisabled) {
        classes += ' rdtDisabled';
      }

      if (selectedDate && selectedDate.year() === year) {
        classes += ' rdtActive';
      }

      props = {
        key: year,
        'data-value': year,
        className: classes
      };

      if (!isDisabled) {
        props.onClick =
          this.props.updateOn === 'years' ? this.updateSelectedYear : this.props.setDate('year');
      }

      years.push(renderer(props, year, selectedDate && selectedDate.clone()));

      if (years.length === 4) {
        rows.push(<tr key={i}>{years}</tr>);
        years = [];
      }

      year++;
      i++;
    }

    return rows;
  }

  public updateSelectedYear(event: any) {
    this.props.updateSelectedDate(event);
  }

  public renderYear(props: Props, year: number) {
    return <td {...props}>{year}</td>;
  }

  public alwaysValidDate() {
    return 1;
  }
}
