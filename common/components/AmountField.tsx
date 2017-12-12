import React from 'react';
import { AmountFieldFactory } from './AmountFieldFactory';
import { Aux } from 'components/ui';
import translate, { translateRaw } from 'translations';

export const AmountField: React.SFC<{}> = () => (
  <AmountFieldFactory
    withProps={({ currentValue: { raw }, isValid, onChange, readOnly }) => (
      <Aux>
        <label>{translate('SEND_amount')}</label>

        <input
          className={`form-control ${isValid ? 'is-valid' : 'is-invalid'}`}
          type="text"
          placeholder={translateRaw('SEND_amount_short')}
          value={raw}
          readOnly={!!readOnly}
          onChange={onChange}
        />
      </Aux>
    )}
  />
);
