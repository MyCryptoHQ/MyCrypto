import React from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { AppState } from 'features/reducers';
import { scheduleSelectors } from 'features/schedule';
import {
  ScheduleTimezoneDropDown,
  ScheduleTimestampField,
  ScheduleType,
  DataField
} from 'components';
import {
  WindowSizeField,
  WindowStartField,
  ScheduleGasPriceField,
  ScheduleGasLimitField,
  ScheduleDepositField,
  TimeBountyField
} from '.';
import './ScheduleFields.scss';

interface Props {
  schedulingType: scheduleSelectors.ICurrentScheduleType;
}

class ScheduleFieldsClass extends React.Component<Props> {
  public render() {
    const { schedulingType } = this.props;

    return (
      <div className="ScheduleFields">
        <div className="ScheduleFields-title">{translate('SCHEDULING_TITLE')}</div>

        <div className="ScheduleFields-description">{translate('SCHEDULING_DESCRIPTION')}</div>

        <div className="row form-group vcenter-sm">
          <div className="col-lg-3 col-lg-push-9">
            <ScheduleType />
            <hr className="hidden-lg" />
          </div>

          {schedulingType.value === 'time' && (
            <>
              <div className="col-md-6 col-lg-4 col-lg-pull-3">
                <ScheduleTimestampField />
              </div>
              <div className="col-md-4 col-lg-3 col-lg-pull-3">
                <ScheduleTimezoneDropDown />
              </div>
            </>
          )}

          {schedulingType.value === 'block' && (
            <>
              <div className="col-md-6 col-lg-6 col-lg-pull-3">
                <WindowStartField />
              </div>
            </>
          )}

          <div
            className={`${
              schedulingType.value === 'block' ? 'col-md-6 col-lg-2' : 'col-md-2 col-lg-2'
            } col-lg-pull-3`}
          >
            <WindowSizeField />
          </div>
        </div>

        <div className="row form-group">
          <div className="col-xs-12 col-md-6">
            <TimeBountyField />
            <hr className="hidden-md hidden-lg" />
          </div>
          <div className="col-xs-12 col-md-6">
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

        <div className="row form-group">
          <div className="col-xs-12 AdvancedGas-data">
            <DataField />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <a
              href="https://blog.chronologic.network/announcing-the-ethereum-alarm-clock-chronologic-partnership-b3d7545bea3b"
              target="_blank"
              rel="noopener noreferrer"
              className="ScheduleFields-logo"
            />
          </div>
        </div>
      </div>
    );
  }
}

export const ScheduleFields = connect((state: AppState) => ({
  schedulingType: scheduleSelectors.getCurrentScheduleType(state)
}))(ScheduleFieldsClass);
