import React from 'react';
import translate, { translateRaw } from 'translations';
import UnitDropdown from './UnitDropdown';
import { Wei } from 'libs/units';
import { UnitConverter } from 'components/renderCbs';
interface Props {
  decimal: number;
  unit: string;
  tokens: string[];
  balance: number | null | Wei;
  isReadOnly: boolean;
  onAmountChange(value: string, unit: string): void;
  onUnitChange(unit: string): void;
}

export default class AmountField extends React.Component {
  public props: Props;

  get active() {
    return !this.props.isReadOnly;
  }

  public render() {
    const { unit, balance, decimal, isReadOnly } = this.props;
    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <label>{translate('SEND_amount')}</label>
          <div className="input-group">
            <UnitConverter decimal={decimal} onChange={this.callWithBaseUnit}>
              {({ onUserInput, convertedUnit }) => (
                <input
                  className={`form-control ${isFinite(Number(convertedUnit)) &&
                  Number(convertedUnit) > 0
                    ? 'is-valid'
                    : 'is-invalid'}`}
                  type="text"
                  placeholder={translateRaw('SEND_amount_short')}
                  value={convertedUnit}
                  disabled={isReadOnly}
                  onChange={onUserInput}
                />
              )}
            </UnitConverter>
            <UnitDropdown
              value={unit}
              options={['ether'].concat(this.props.tokens)}
              onChange={isReadOnly ? void 0 : this.onUnitChange}
            />
          </div>
          {!isReadOnly &&
            balance && (
              <span className="help-block">
                <a onClick={this.onSendEverything}>
                  <span className="strong">
                    {translate('SEND_TransferTotal')}
                  </span>
                </a>
              </span>
            )}
        </div>
      </div>
    );
  }

  public onUnitChange = (unit: string) =>
    this.active && this.props.onUnitChange(unit); // thsi needs to be converted unit

  public callWithBaseUnit = ({ currentTarget: { value } }) =>
    this.active && this.props.onAmountChange(value, this.props.unit);

  public onSendEverything = () =>
    this.active && this.props.onAmountChange('everything', this.props.unit);
}
