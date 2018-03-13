import React from 'react';
import translate from 'translations';
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
          <div className="input-group-header">{translate('SCHEDULE_block')}</div>
          <Input
            className={`input-group-input ${isValid ? '' : 'invalid'}`}
            type="text"
            value={currentWindowStart.raw}
            placeholder={translate('SCHEDULE_block_placeholder', true)}
            readOnly={!!(isReadOnly || readOnly)}
            spellCheck={false}
            onChange={onChange}
          />
        </label>
      </div>
    )}
  />
);
