import React, { Component } from 'react';
import { setScheduleType, TSetScheduleType } from 'actions/schedule';
import { connect } from 'react-redux';
import translate from 'translations';
import { getCurrentScheduleType, ICurrentScheduleType } from 'selectors/schedule';
import { AppState } from 'reducers';

interface DispatchProps {
  setScheduleType: TSetScheduleType;
}

interface StateProps {
  currentScheduleType: ICurrentScheduleType;
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
    currentScheduleType: getCurrentScheduleType(state)
  }),
  { setScheduleType }
)(ScheduleTypeClass);
