import React from 'react';
import { GasFieldFactory } from 'components/GasFieldFactory';
import classnames from 'classnames';

export const GasField: React.SFC<{}> = () => (
  <label className="InteractExplorer-field form-group">
    <h4 className="InteractExplorer-field-label">Gas Limit</h4>
    <GasFieldFactory
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
