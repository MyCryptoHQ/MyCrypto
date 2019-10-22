import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { AppState } from 'features/reducers';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import translate from 'translations';
import { scheduleActions, scheduleSelectors, scheduleHelpers } from 'features/schedule';
import DateTime from 'components/ui/DateTime/DateTime';

interface DispatchProps {
  setCurrentScheduleTimestamp: scheduleActions.TSetCurrentScheduleTimestamp;
}

interface StateProps {
  currentScheduleTimestamp: scheduleHelpers.ICurrentScheduleTimestamp;
  isValid: boolean;
}

type Props = DispatchProps & StateProps;

class ScheduleTimestampClass extends Component<Props> {
  public render() {
    const { currentScheduleTimestamp, isValid } = this.props;

    return (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">{translate('SCHEDULE_TIMESTAMP')}</div>
        </label>
        <DateTime
          defaultValue={currentScheduleTimestamp.value}
          onChange={this.handleOnChange}
          isValidDate={this.isValidDate}
          inputProps={{
            className: `input-group-input has-value ${!!isValid ? '' : 'has-blurred invalid'}`
          }}
        />
      </div>
    );
  }

  private isValidDate = (current: Date) => {
    return (
      current >
      moment()
        .subtract(1, 'day')
        .toDate()
    );
  };

  private handleOnChange = (val: any) => {
    const parsedDate = moment(val);

    if (parsedDate.isValid()) {
      const value = parsedDate.format(EAC_SCHEDULING_CONFIG.SCHEDULE_TIMESTAMP_FORMAT);
      this.props.setCurrentScheduleTimestamp(value);
    }
  };
}

export const ScheduleTimestampField = connect(
  (state: AppState) => ({
    currentScheduleTimestamp: scheduleSelectors.getCurrentScheduleTimestamp(state),
    isValid: scheduleSelectors.isValidCurrentScheduleTimestamp(state)
  }),
  { setCurrentScheduleTimestamp: scheduleActions.setCurrentScheduleTimestamp }
)(ScheduleTimestampClass);
