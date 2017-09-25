import React from 'react';
import translate, { translateRaw } from 'translations';
import UnitDropdown from './UnitDropdown';

interface Props {
  value: string;
  unit: string;
  tokens: string[];
  onChange?(value: string, unit: string): void;
}

export default class AmountField extends React.Component {
  public props: Props;

  public render() {
    const { value, unit, onChange } = this.props;
    const isReadonly = !onChange;
    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <label>{translate('SEND_amount')}</label>
          <div className="input-group">
            <input
              className={`form-control ${isFinite(Number(value)) &&
              Number(value) > 0
                ? 'is-valid'
                : 'is-invalid'}`}
              type="text"
              placeholder={translateRaw('SEND_amount_short')}
              value={value}
              disabled={isReadonly}
              onChange={isReadonly ? void 0 : this.onValueChange}
            />
            <UnitDropdown
              value={unit}
              options={['ether'].concat(this.props.tokens)}
              onChange={isReadonly ? void 0 : this.onUnitChange}
            />
          </div>
          {!isReadonly && (
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

  public onUnitChange = (unit: string) => {
    if (this.props.onChange) {
      this.props.onChange(this.props.value, unit);
    }
  };

  public onValueChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange(
        (e.target as HTMLInputElement).value,
        this.props.unit
      );
    }
  };

  public onSendEverything = () => {
    if (this.props.onChange) {
      this.props.onChange('everything', this.props.unit);
    }
  };
}
