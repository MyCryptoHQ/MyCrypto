import React from 'react';
import { GasLimitFieldFactory } from './GasLimitFieldFactory';
import translate from 'translations';

export const GasLimitField: React.SFC<{}> = () => (
  <React.Fragment>
    <label>{translate('TRANS_gas')} </label>
    <GasLimitFieldFactory
      withProps={({ gasLimit: { raw, value }, onChange, readOnly }) => (
        <input
          className={`form-control ${!!value ? 'is-valid' : 'is-invalid'}`}
          type="text"
          readOnly={!!readOnly}
          value={raw}
          onChange={onChange}
        />
      )}
    />
  </React.Fragment>
);
