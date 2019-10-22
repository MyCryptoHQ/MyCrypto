import React, { Component } from 'react';
import DaysView from './DaysView';
import MonthsView from './MonthsView';
import YearsView from './YearsView';
import { DatepickerCommonProps } from './DateTime';

interface Props {
  view: string;
  viewProps: DatepickerCommonProps;
}

export default class CalendarContainer extends Component<Props> {
  public render() {
    switch (this.props.view) {
      case 'days':
        return <DaysView {...this.props.viewProps} />;
      case 'months':
        return <MonthsView {...this.props.viewProps} />;
      case 'years':
        return <YearsView {...this.props.viewProps} />;
    }
  }
}
