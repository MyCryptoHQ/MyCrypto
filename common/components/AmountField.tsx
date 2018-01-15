import React from 'react';
import { AmountFieldFactory } from './AmountFieldFactory';
import { UnitDropDown } from 'components';
import translate, { translateRaw } from 'translations';

interface Props {
  hasUnitDropdown?: boolean;
  showAllTokens?: boolean;
  customValidator?(rawAmount: string): boolean;
}

export const AmountField: React.SFC<Props> = ({
  hasUnitDropdown,
  showAllTokens,
  customValidator
}) => (
  <AmountFieldFactory
    withProps={({ currentValue: { raw }, isValid, onChange, readOnly }) => (
      <React.Fragment>
        <label>{translate('SEND_amount')}</label>
        <div className="input-group">
          <input
            className={`form-control ${
              isAmountValid(raw, customValidator, isValid) ? 'is-valid' : 'is-invalid'
            }`}
            type="number"
            placeholder={translateRaw('SEND_amount_short')}
            value={raw}
            readOnly={!!readOnly}
            onChange={onChange}
          />
          {hasUnitDropdown && <UnitDropDown showAllTokens={showAllTokens} />}
        </div>
      </React.Fragment>
    )}
  />
);

const isAmountValid = (raw, customValidator, isValid) =>
  customValidator ? customValidator(raw) : isValid;
