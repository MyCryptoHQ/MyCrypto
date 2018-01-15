import React from 'react';
import { GasLimitFieldFactory } from 'components/GasLimitFieldFactory';
import classnames from 'classnames';

export const GasLimitField: React.SFC<{}> = () => (
  <label className="InteractExplorer-field form-group">
    <h4 className="InteractExplorer-field-label">Gas Limit</h4>
    <GasLimitFieldFactory
      withProps={({ gasLimit: { raw, value }, onChange, readOnly }) => (
        <input
          name="gasLimit"
          value={raw}
          disabled={readOnly}
          onChange={onChange}
          className={classnames('InteractExplorer-field-input', 'form-control', {
            'is-invalid': !value
          })}
        />
      )}
    />
  </label>
);
