import { connect } from 'react-redux';
import React from 'react';
import { AppState } from 'reducers';
import { getCurrentScheduleType, ICurrentScheduleType } from 'selectors/transaction';
import {
  WindowSizeField,
  TimeBountyField,
  WindowStartField,
  ScheduleGasPriceField,
  ScheduleGasLimitField,
  ScheduleDepositField
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

        <div className="row form-group vcenter-sm">
          <div className="col-lg-3 col-lg-push-9">
            <ScheduleType />
            <hr className="hidden-lg" />
          </div>

          {schedulingType.value === 'time' && (
            <>
              <div className="col-md-5 col-lg-3 col-lg-pull-3">
                <ScheduleTimestampField />
              </div>
              <div className="col-md-4 col-lg-3 col-lg-pull-3">
                <ScheduleTimezoneDropDown />
              </div>
            </>
          )}

          {schedulingType.value === 'block' && (
            <>
              <div className="col-md-9 col-lg-6 col-lg-pull-3">
                <WindowStartField />
              </div>
            </>
          )}

          <div className="col-md-3 col-lg-3 col-lg-pull-3">
            <WindowSizeField />
          </div>
        </div>

        <div className="row form-group">
          <div className="col-xs-6">
            <TimeBountyField />
          </div>
          <div className="col-xs-6">
            <ScheduleDepositField />
          </div>
        </div>

        <div className="row form-group">
          <div className="col-xs-6">
            <ScheduleGasPriceField />
          </div>
          <div className="col-xs-6">
            <ScheduleGasLimitField />
          </div>
        </div>
      </div>
    );
  }
}

export const ScheduleFields = connect((state: AppState) => ({
  schedulingType: getCurrentScheduleType(state)
}))(ScheduleFieldsClass);
