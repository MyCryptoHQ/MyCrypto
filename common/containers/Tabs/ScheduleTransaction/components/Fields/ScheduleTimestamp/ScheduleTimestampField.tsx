import React from 'react';
import translate from 'translations';
import { ScheduleTimestampFieldFactory } from './ScheduleTimestampFieldFactory';

interface Props {
  isReadOnly?: boolean;
}

export const ScheduleTimestampField: React.SFC<Props> = ({ isReadOnly }) => (
  <ScheduleTimestampFieldFactory
    withProps={({ currentScheduleTimestamp, isValid, onChange, readOnly }) => (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">{translate('SCHEDULE_TIMESTAMP')}</div>
          <input
            className={`input-group-input ${isValid ? '' : 'invalid'}`}
            type="text"
            value={currentScheduleTimestamp.raw}
            readOnly={!!(isReadOnly || readOnly)}
            spellCheck={false}
            onChange={onChange}
            id="datepicker"
          />
        </label>
      </div>
    )}
  />
);
