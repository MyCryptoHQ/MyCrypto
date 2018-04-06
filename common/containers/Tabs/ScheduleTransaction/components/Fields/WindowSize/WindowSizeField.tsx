import React from 'react';
import translate, { translateRaw } from 'translations';
import { Input } from 'components/ui';
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
            {translate('SCHEDULE_WINDOW_SIZE')}
            <Help tooltip={translateRaw('SCHEDULE_WINDOW_SIZE_TOOLTIP')} />
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
