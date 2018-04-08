import { connect } from 'react-redux';
import React from 'react';
import { AppState } from 'reducers';
import { setScheduleGasPriceField, TSetScheduleGasPriceField } from 'actions/schedule';
import { translateRaw } from 'translations';
import { Input } from 'components/ui';
import { getScheduleGasPrice, isValidScheduleGasPrice } from 'selectors/schedule/fields';
import { gasPriceToBase } from 'libs/units';

interface OwnProps {
  scheduleGasPrice: any;
  validScheduleGasPrice: boolean;
}

interface DispatchProps {
  setScheduleGasPriceField: TSetScheduleGasPriceField;
}

type Props = OwnProps & DispatchProps;

class ScheduleGasPriceFieldClass extends React.Component<Props> {
  public render() {
    const { scheduleGasPrice, validScheduleGasPrice } = this.props;

    return (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">{translateRaw('SCHEDULE_GAS_PRICE')} (gwei)</div>
          <Input
            className={!!scheduleGasPrice.raw && !validScheduleGasPrice ? 'invalid' : ''}
            type="number"
            placeholder="40"
            value={scheduleGasPrice.raw}
            onChange={this.handleGasPriceChange}
          />
        </label>
      </div>
    );
  }

  private handleGasPriceChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;

    this.props.setScheduleGasPriceField({
      raw: value,
      value: value ? gasPriceToBase(parseInt(value, 10)) : null
    });
  };
}

export const ScheduleGasPriceField = connect(
  (state: AppState) => ({
    scheduleGasPrice: getScheduleGasPrice(state),
    validScheduleGasPrice: isValidScheduleGasPrice(state)
  }),
  {
    setScheduleGasPriceField
  }
)(ScheduleGasPriceFieldClass);
