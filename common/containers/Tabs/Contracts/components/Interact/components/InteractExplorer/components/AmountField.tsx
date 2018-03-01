import { AmountFieldFactory } from 'components/AmountFieldFactory';
import React from 'react';
import classnames from 'classnames';
import { Input } from 'components/ui';

export const AmountField: React.SFC = () => (
  <div className="input-group-wrapper InteractExplorer-field">
    <label className="input-group">
      <div className="input-group-header">Value</div>
      <AmountFieldFactory
        withProps={({ currentValue: { raw }, isValid, onChange, readOnly }) => (
          <Input
            name="value"
            value={raw}
            onChange={onChange}
            readOnly={readOnly}
            className={classnames('InteractExplorer-field-input', 'form-control', {
              'is-invalid': !(isValid || raw === '')
            })}
          />
        )}
      />
    </label>
  </div>
);
