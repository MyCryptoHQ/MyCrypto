import { connect } from 'react-redux';
import React, { Component } from 'react';
import { AppState } from 'reducers';
import { setScheduleDepositField, TSetScheduleDepositField } from 'actions/schedule';
import { translateRaw } from 'translations';
import { Input, Tooltip } from 'components/ui';
import { getDecimal } from 'selectors/transaction';
import { getScheduleDeposit, isValidScheduleDeposit } from 'selectors/schedule/fields';
import { toWei } from 'libs/units';
import Help from 'components/ui/Help';

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
          <div className="input-group-header">
            <span className="ScheduleFields-field-title-wrap">
              {translateRaw('SCHEDULE_DEPOSIT')}
              <div className="ScheduleFields-field-title-tooltip">
                <Tooltip>{translateRaw('SCHEDULE_DEPOSIT_TOOLTIP')}</Tooltip>
                <Help className="ScheduleFields-field-title-help" />
              </div>
            </span>
          </div>
          <Input
            className={!!scheduleDeposit.raw && !validScheduleDeposit ? 'invalid' : ''}
            type="number"
            placeholder="0.00001"
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
