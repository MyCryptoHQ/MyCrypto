import React from 'react';

import { Input } from 'components/ui';
import { AmountFieldFactory } from 'components/AmountFieldFactory';

export const AmountField: React.SFC = () => (
  <div className="input-group-wrapper InteractExplorer-field">
    <label className="input-group">
      <div className="input-group-header">Value</div>
      <AmountFieldFactory
        withProps={({ currentValue: { raw }, isValid, onChange, readOnly }) => (
          <Input
            name="value"
            value={raw}
            isValid={isValid || raw === ''}
            onChange={onChange}
            readOnly={readOnly}
            className="InteractExplorer-field-input"
          />
        )}
      />
    </label>
  </div>
);
