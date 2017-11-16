import React from 'react';
import translate, { translateRaw } from 'translations';
import { Wei } from 'libs/units';
import { UnitConverter } from 'components/renderCbs';

interface Props {
  decimal: number;
  unit: string;
  tokens: string[];
  balance: number | null | Wei;
  readOnly: boolean;
  onAmountChange(value: string, unit: string): void;
  onUnitChange(unit: string): void;
}

export const AmountField: React.SFC<Props> = props => {
  const { unit, balance, decimal, readOnly } = props;

  const callWithBaseUnit = ({ currentTarget: { value } }) =>
    props.readOnly && props.onAmountChange(value, props.unit);

  const onSendEverything = () =>
    props.readOnly && props.onAmountChange('everything', props.unit);

  const validInput = (input: string) => isFinite(+input) && +input > 0;

  return (
    <div className="row form-group">
      <div className="col-xs-11">
        <label>{translate('SEND_amount')}</label>
        <div className="input-group">
          <UnitConverter decimal={decimal} onChange={callWithBaseUnit}>
            {({ onUserInput, convertedUnit }) => (
              <input
                className={`form-control ${
                  validInput(convertedUnit) ? 'is-valid' : 'is-invalid'
                }`}
                type="text"
                placeholder={translateRaw('SEND_amount_short')}
                value={convertedUnit}
                readOnly={readOnly}
                onChange={onUserInput}
              />
            )}
          </UnitConverter>
        </div>
        {!readOnly &&
          balance && (
            <span className="help-block">
              <a onClick={onSendEverything}>
                <span className="strong">
                  {translate('SEND_TransferTotal')}
                </span>
              </a>
            </span>
          )}
      </div>
    </div>
  );
};
