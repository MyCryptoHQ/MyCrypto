import React from 'react';

import translate from 'translations';
import { UnitDropDown, SendEverything } from 'components';
import { Input } from 'components/ui';
import { AmountFieldFactory } from './AmountFieldFactory';
import './AmountField.scss';

interface Props {
  optional?: boolean;
  networkId?: string;
  hasUnitDropdown?: boolean;
  hasSendEverything?: boolean;
  showAllTokens?: boolean;
  showInvalidWithoutValue?: boolean;
  customValidator?(rawAmount: string): boolean;
}

export const AmountField: React.SFC<Props> = ({
  optional,
  hasUnitDropdown,
  hasSendEverything,
  showAllTokens,
  networkId,
  customValidator,
  showInvalidWithoutValue
}) => (
  <AmountFieldFactory
    withProps={({ currentValue: { raw }, isValid, onChange, readOnly }) => (
      <div className="AmountField input-group-wrapper">
        <label className="AmountField-group input-group input-group-inline" htmlFor="amount">
          <div className="input-group-header">
            <div className="">{translate('SEND_AMOUNT_SHORT')}</div>
            {optional && <span className="small optional">(optional)</span>}
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
            showInvalidWithoutValue={showInvalidWithoutValue}
          />
          {hasUnitDropdown ? (
            <UnitDropDown showAllTokens={showAllTokens} />
          ) : (
            <span className="AmountField-networkId input-group-inline-absolute-right">
              {networkId}
            </span>
          )}
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
