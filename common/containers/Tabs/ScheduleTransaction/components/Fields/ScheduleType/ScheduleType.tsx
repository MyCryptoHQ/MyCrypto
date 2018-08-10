import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { AppState } from 'features/reducers';
import { scheduleActions, scheduleSelectors } from 'features/schedule';

interface DispatchProps {
  setScheduleType: scheduleActions.TSetScheduleType;
}

interface StateProps {
  currentScheduleType: scheduleSelectors.ICurrentScheduleType;
}

type Props = DispatchProps & StateProps;

class ScheduleTypeClass extends Component<Props> {
  public render() {
    const { currentScheduleType } = this.props;

    return (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="row">
            <div className="col-xs-6">
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    name="scheduleType"
                    value="time"
                    onChange={this.handleOnChange}
                    checked={currentScheduleType.value === 'time'}
                  />
                  {translate('SCHEDULE_TYPE_TIME')}
                </label>
              </div>
            </div>
            <div className="col-xs-6">
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    name="scheduleType"
                    value="block"
                    onChange={this.handleOnChange}
                    checked={currentScheduleType.value === 'block'}
                  />
                  {translate('SCHEDULE_TYPE_BLOCK')}
                </label>
              </div>
            </div>
          </div>
        </label>
      </div>
    );
  }

  private handleOnChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.currentTarget.value;
    this.props.setScheduleType({ raw: value, value });
  };
}

export const ScheduleType = connect(
  (state: AppState) => ({
    currentScheduleType: scheduleSelectors.getCurrentScheduleType(state)
  }),
  { setScheduleType: scheduleActions.setScheduleType }
)(ScheduleTypeClass);
