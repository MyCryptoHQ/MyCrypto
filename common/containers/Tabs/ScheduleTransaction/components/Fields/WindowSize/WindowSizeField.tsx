import React from 'react';
import translate, { translateRaw } from 'translations';
import { Input, Tooltip } from 'components/ui';
import { WindowSizeFieldFactory } from './WindowSizeFieldFactory';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import Help from 'components/ui/Help';

interface Props {
  isReadOnly?: boolean;
}

export const WindowSizeField: React.SFC<Props> = ({ isReadOnly }) => (
  <WindowSizeFieldFactory
    withProps={({ currentWindowSize, currentScheduleType, isValid, onChange, readOnly }) => (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">
            <span className="ScheduleFields-field-title">
              <div className="ScheduleFields-field-title-text">
                {translate('SCHEDULE_WINDOW_SIZE')}
              </div>
              <div className="ScheduleFields-field-title-tooltip">
                <Tooltip>
                  {translateRaw(
                    `SCHEDULE_WINDOW_SIZE_TOOLTIP_${
                      currentScheduleType.value === 'time' ? 'TIME' : 'BLOCK'
                    }`
                  )}
                </Tooltip>
                <Help className="ScheduleFields-field-title-help" />
              </div>
            </span>
          </div>
          <Input
            className={`input-group-input ${isValid ? '' : 'invalid'}`}
            type="text"
            value={currentWindowSize.raw}
            placeholder={
              currentScheduleType.value === 'time'
                ? EAC_SCHEDULING_CONFIG.WINDOW_SIZE_DEFAULT_TIME.toString()
                : EAC_SCHEDULING_CONFIG.WINDOW_SIZE_DEFAULT_BLOCK.toString()
            }
            readOnly={!!(isReadOnly || readOnly)}
            spellCheck={false}
            onChange={onChange}
          />
        </label>
      </div>
    )}
  />
);
