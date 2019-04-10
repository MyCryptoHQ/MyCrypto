import React from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { AppState } from 'features/reducers';
import { scheduleSelectors } from 'features/schedule';
import { ScheduleTimezoneDropDown, ScheduleTimestampField } from 'components';
import { WindowStartField, ScheduleGasPriceField, ScheduleGasLimitField, TimeBountyField } from '.';
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

        <div className="row form-group">
          {schedulingType.value === 'time' && (
            <>
              <div className="col-md-6">
                <ScheduleTimestampField />
              </div>
              <div className="col-md-6">
                <ScheduleTimezoneDropDown />
              </div>
            </>
          )}

          {schedulingType.value === 'block' && (
            <div className="col-md-12">
              <WindowStartField />
            </div>
          )}
        </div>

        <div className="row form-group">
          <div className="col-xs-12 col-md-12">
            <TimeBountyField />
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
