import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { translateRaw } from 'translations';
import { gasPriceToBase } from 'libs/units';
import { scheduleActions, scheduleSelectors } from 'features/schedule';
import { Input } from 'components/ui';

interface OwnProps {
  scheduleGasPrice: any;
  validScheduleGasPrice: boolean;
}

interface DispatchProps {
  setScheduleGasPriceField: scheduleActions.TSetScheduleGasPriceField;
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
            isValid={scheduleGasPrice.raw && validScheduleGasPrice}
            type="number"
            placeholder="40"
            value={scheduleGasPrice.raw}
            onChange={this.handleGasPriceChange}
            showInvalidWithoutValue={true}
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
    scheduleGasPrice: scheduleSelectors.getScheduleGasPrice(state),
    validScheduleGasPrice: scheduleSelectors.isValidScheduleGasPrice(state)
  }),
  {
    setScheduleGasPriceField: scheduleActions.setScheduleGasPriceField
  }
)(ScheduleGasPriceFieldClass);
