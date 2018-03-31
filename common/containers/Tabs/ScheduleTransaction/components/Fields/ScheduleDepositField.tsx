import { connect } from 'react-redux';
import React, { Component } from 'react';
import { AppState } from 'reducers';
import { setScheduleDepositField, TSetScheduleDepositField } from 'actions/transaction';
import { translateRaw } from 'translations';
import { Input } from 'components/ui';
import { getScheduleDeposit, isValidScheduleDeposit, getDecimal } from 'selectors/transaction';
import { toWei } from 'libs/units';

interface OwnProps {
  decimal: number;
  scheduleDeposit: any;
  validScheduleDeposit: boolean;
}

interface DispatchProps {
  setScheduleDepositField: TSetScheduleDepositField;
}

type Props = OwnProps & DispatchProps;

class ScheduleDepositFieldClass extends Component<Props> {
  public render() {
    const { scheduleDeposit, validScheduleDeposit } = this.props;

    return (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">{translateRaw('SCHEDULE_DEPOSIT')}</div>
          <Input
            className={!!scheduleDeposit.raw && !validScheduleDeposit ? 'invalid' : ''}
            type="number"
            placeholder={translateRaw('SCHEDULE_DEPOSIT_PLACEHOLDER')}
            value={scheduleDeposit.raw}
            onChange={this.handleDepositChange}
          />
        </label>
      </div>
    );
  }

  private handleDepositChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const { decimal } = this.props;
    const { value } = ev.currentTarget;

    this.props.setScheduleDepositField({
      raw: value,
      value: value ? toWei(value, decimal) : null
    });
  };
}

export const ScheduleDepositField = connect(
  (state: AppState) => ({
    decimal: getDecimal(state),
    scheduleDeposit: getScheduleDeposit(state),
    validScheduleDeposit: isValidScheduleDeposit(state)
  }),
  {
    setScheduleDepositField
  }
)(ScheduleDepositFieldClass);
