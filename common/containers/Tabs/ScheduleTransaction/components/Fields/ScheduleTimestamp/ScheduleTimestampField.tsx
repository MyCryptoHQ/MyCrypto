import React, { Component } from 'react';
import { connect } from 'react-redux';
import DateTime from 'react-datetime';
import moment from 'moment';

import { AppState } from 'redux/reducers';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import translate from 'translations';
import { setCurrentScheduleTimestamp, TSetCurrentScheduleTimestamp } from 'redux/schedule/actions';
import {
  getCurrentScheduleTimestamp,
  ICurrentScheduleTimestamp,
  isValidCurrentScheduleTimestamp
} from 'redux/schedule/selectors';

interface DispatchProps {
  setCurrentScheduleTimestamp: TSetCurrentScheduleTimestamp;
}

interface StateProps {
  currentScheduleTimestamp: ICurrentScheduleTimestamp;
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
          value={currentScheduleTimestamp.value}
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
    const value = moment(val).format(EAC_SCHEDULING_CONFIG.SCHEDULE_TIMESTAMP_FORMAT);
    this.props.setCurrentScheduleTimestamp(value);
  };
}

export const ScheduleTimestampField = connect(
  (state: AppState) => ({
    currentScheduleTimestamp: getCurrentScheduleTimestamp(state),
    isValid: isValidCurrentScheduleTimestamp(state)
  }),
  { setCurrentScheduleTimestamp }
)(ScheduleTimestampClass);
