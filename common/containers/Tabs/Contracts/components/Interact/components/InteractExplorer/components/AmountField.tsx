import { AmountFieldFactory } from 'components/AmountFieldFactory';
import React from 'react';
import classnames from 'classnames';

export const AmountField: React.SFC<{}> = () => (
  <label className="InteractExplorer-field form-group">
    <h4 className="InteractExplorer-field-label">Value</h4>
    <AmountFieldFactory
      withProps={({ currentValue: { raw }, isValid, onChange, readOnly }) => (
        <input
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
);
