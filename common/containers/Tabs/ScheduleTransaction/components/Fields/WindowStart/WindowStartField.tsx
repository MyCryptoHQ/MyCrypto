import React from 'react';
import translate, { translateRaw } from 'translations';
import { Input } from 'components/ui';
import { WindowStartFieldFactory } from './WindowStartFieldFactory';

interface Props {
  isReadOnly?: boolean;
}

export const WindowStartField: React.SFC<Props> = ({ isReadOnly }) => (
  <WindowStartFieldFactory
    withProps={({ currentWindowStart, isValid, onChange, readOnly }) => (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">{translate('SCHEDULE_BLOCK')}</div>
          <Input
            className={`input-group-input ${isValid ? '' : 'invalid'}`}
            type="text"
            value={currentWindowStart.raw}
            placeholder={translateRaw('SCHEDULE_BLOCK_PLACEHOLDER')}
            readOnly={!!(isReadOnly || readOnly)}
            spellCheck={false}
            onChange={onChange}
          />
        </label>
      </div>
    )}
  />
);
