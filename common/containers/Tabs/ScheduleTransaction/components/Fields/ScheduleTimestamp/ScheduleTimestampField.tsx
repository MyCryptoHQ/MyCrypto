import React, { Component } from 'react';
import { setCurrentScheduleTimestamp, TSetCurrentScheduleTimestamp } from 'actions/schedule';
import { connect } from 'react-redux';
import translate from 'translations';
import {
  getCurrentScheduleTimestamp,
  ICurrentScheduleTimestamp,
  isValidCurrentScheduleTimestamp
} from 'selectors/schedule';
import { AppState } from 'reducers';
import DateTime from 'react-datetime';
import moment from 'moment';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

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
