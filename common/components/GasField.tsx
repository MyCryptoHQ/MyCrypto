import React from 'react';
import { GasFieldFactory } from './GasFieldFactory';
import translate from 'translations';
import { Aux } from 'components/ui';

export const GasField: React.SFC<{}> = () => (
  <Aux>
    <label>{translate('TRANS_gas')} </label>
    <GasFieldFactory
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
