import { connect } from 'react-redux';
import React from 'react';
import { AppState } from 'reducers';
import { getCurrentScheduleType, ICurrentScheduleType } from 'selectors/transaction';
import {
  WindowSizeField,
  TimeBountyField,
  WindowStartField,
  ScheduleGasPriceField,
  ScheduleGasLimitField
} from '.';
import { ScheduleTimezoneDropDown, ScheduleTimestampField, ScheduleType } from 'components';
import './ScheduleFields.scss';

interface Props {
  schedulingType: ICurrentScheduleType;
}

class ScheduleFieldsClass extends React.Component<Props> {
  public render() {
    const { schedulingType } = this.props;

    return (
      <div className="scheduled-tx-settings">
        <div className="scheduled-tx-settings_title">Scheduled Transaction Settings</div>
        <br />

        <div className="row form-group">
          <div className="col-xs-12 col-sm-6 col-md-3 col-md-push-9">
            <ScheduleType />
          </div>

          {schedulingType.value === 'time' && (
            <>
              <div className="col-xs-12 col-md-3 col-md-pull-3">
                <ScheduleTimestampField />
              </div>
              <div className="col-xs-12 col-md-3 col-md-pull-3">
                <ScheduleTimezoneDropDown />
              </div>
            </>
          )}

          {schedulingType.value === 'block' && (
            <>
              <div className="col-xs-12 col-md-6 col-md-pull-3">
                <WindowStartField />
              </div>
            </>
          )}

          <div className="col-xs-12 col-md-3 col-md-pull-3">
            <WindowSizeField />
          </div>
        </div>

        <div className="row form-group">
          <div className="col-xs-4">
            <ScheduleGasPriceField />
          </div>
          <div className="col-xs-4">
            <ScheduleGasLimitField />
          </div>
          <div className="col-xs-4">
            <TimeBountyField />
          </div>
        </div>
      </div>
    );
  }
}

export const ScheduleFields = connect((state: AppState) => ({
  schedulingType: getCurrentScheduleType(state)
}))(ScheduleFieldsClass);
