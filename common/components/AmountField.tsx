import React from 'react';
import { AmountFieldFactory } from './AmountFieldFactory';
import { UnitDropDown } from 'components';
import translate from 'translations';
import { Input } from 'components/ui';

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
      <div className="input-group-wrapper">
        <label className="input-group input-group-inline">
          <div className="input-group-header">{translate('SEND_AMOUNT_SHORT')}</div>
          <Input
            className={`input-group-input ${
              isAmountValid(raw, customValidator, isValid) ? '' : 'invalid'
            }`}
            type="number"
            placeholder={'1'}
            value={raw}
            readOnly={!!readOnly}
            onChange={onChange}
          />
          {hasUnitDropdown && <UnitDropDown showAllTokens={showAllTokens} />}
        </label>
      </div>
    )}
  />
);

const isAmountValid = (
  raw: string,
  customValidator: ((rawAmount: string) => boolean) | undefined,
  isValid: boolean
) => (customValidator ? customValidator(raw) : isValid);
