import React from 'react';

import translate from 'translations';
import { UnitDropDown, SendEverything } from 'components';
import { Input } from 'components/ui';
import { AmountFieldFactory } from './AmountFieldFactory';

interface Props {
  hasUnitDropdown?: boolean;
  hasSendEverything?: boolean;
  showAllTokens?: boolean;
  showInvalidWithoutValue?: boolean;
  customValidator?(rawAmount: string): boolean;
}

export const AmountField: React.SFC<Props> = ({
  hasUnitDropdown,
  hasSendEverything,
  showAllTokens,
  customValidator,
  showInvalidWithoutValue
}) => (
  <AmountFieldFactory
    withProps={({ currentValue: { raw }, isValid, onChange, readOnly }) => (
      <div className="AmountField input-group-wrapper">
        <label className="AmountField-group input-group input-group-inline">
          <div className="input-group-header">{translate('SEND_AMOUNT_SHORT')}</div>
          <Input
            isValid={isAmountValid(raw, customValidator, isValid)}
            type="number"
            placeholder="1"
            value={raw}
            readOnly={!!readOnly}
            onChange={onChange}
            showInvalidWithoutValue={showInvalidWithoutValue}
          />
          {hasSendEverything && <SendEverything />}
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
