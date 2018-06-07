import React from 'react';
import { AmountFieldFactory } from './AmountFieldFactory';
import { UnitDropDown, SendEverything } from 'components';
import translate from 'translations';
import { Input } from 'components/ui';

interface Props {
  hasUnitDropdown?: boolean;
  hasSendEverything?: boolean;
  showAllTokens?: boolean;
  customValidator?(rawAmount: string): boolean;
}

export const AmountField: React.SFC<Props> = ({
  hasUnitDropdown,
  hasSendEverything,
  showAllTokens,
  customValidator
}) => (
  <AmountFieldFactory
    withProps={({ currentValue: { raw }, isValid, onChange, readOnly }) => (
      <div className="AmountField input-group-wrapper">
        <label className="AmountField-group input-group input-group-inline" htmlFor="amount">
          <div className="input-group-header">
            <div className="">{translate('SEND_AMOUNT_SHORT')}</div>
            <div className="flex-spacer" />
            {hasSendEverything && <SendEverything />}
          </div>
          <Input
            id="amount"
            isValid={isAmountValid(raw, customValidator, isValid)}
            type="number"
            placeholder="0.0"
            autoComplete="off"
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
