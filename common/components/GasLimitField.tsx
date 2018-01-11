import React from 'react';
import { GasLimitFieldFactory } from './GasLimitFieldFactory';
import translate from 'translations';
import { Aux } from 'components/ui';

export const GasLimitField: React.SFC<{}> = () => (
  <Aux>
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
  </Aux>
);
