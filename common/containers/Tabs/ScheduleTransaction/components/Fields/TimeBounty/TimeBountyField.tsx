import React from 'react';
import translate, { translateRaw } from 'translations';
import { Input, Tooltip } from 'components/ui';
import { TimeBountyFieldFactory } from './TimeBountyFieldFactory';
import Help from 'components/ui/Help';

interface Props {
  isReadOnly?: boolean;
}

export const TimeBountyField: React.SFC<Props> = ({ isReadOnly }) => (
  <TimeBountyFieldFactory
    withProps={({ currentTimeBounty, isValid, onChange, readOnly }) => (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">
            <span className="ScheduleFields-field-title">
              <div className="ScheduleFields-field-title-text">
                {translate('SCHEDULE_TIMEBOUNTY')}
              </div>
              <div className="ScheduleFields-field-title-tooltip">
                <Tooltip>{translateRaw('SCHEDULE_TIMEBOUNTY_TOOLTIP')}</Tooltip>
                <Help className="ScheduleFields-field-title-help" />
              </div>
            </span>
          </div>
          <Input
            className={`input-group-input ${isValid ? '' : 'invalid'}`}
            type="text"
            value={currentTimeBounty.raw}
            placeholder={translateRaw('SCHEDULE_TIMEBOUNTY_PLACEHOLDER')}
            readOnly={!!(isReadOnly || readOnly)}
            spellCheck={false}
            onChange={onChange}
          />
        </label>
      </div>
    )}
  />
);
