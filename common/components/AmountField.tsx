import React from 'react';
import { AmountFieldFactory } from './AmountFieldFactory';
import { Aux } from 'components/ui';
import { UnitDropDown } from 'components';
import translate, { translateRaw } from 'translations';

interface Props {
  hasUnitDropdown?: boolean;
}

export const AmountField: React.SFC<Props> = ({ hasUnitDropdown }) => (
  <AmountFieldFactory
    withProps={({ currentValue: { raw }, isValid, onChange, readOnly }) => (
      <Aux>
        <label>{translate('SEND_amount')}</label>

        <div className="input-group">
          <input
            className={`form-control ${isValid ? 'is-valid' : 'is-invalid'}`}
            type="number"
            placeholder={translateRaw('SEND_amount_short')}
            value={raw}
            readOnly={!!readOnly}
            onChange={onChange}
          />
          {hasUnitDropdown && <UnitDropDown />}
        </div>
      </Aux>
    )}
  />
);
