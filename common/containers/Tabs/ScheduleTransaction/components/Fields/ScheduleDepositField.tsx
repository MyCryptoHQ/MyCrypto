import React, { Component } from 'react';
import { connect } from 'react-redux';

import { translateRaw } from 'translations';
import { toWei } from 'libs/units';
import { AppState } from 'features/reducers';
import { scheduleActions, scheduleSelectors } from 'features/schedule';
import { transactionMetaSelectors } from 'features/transaction';
import { Input, Tooltip } from 'components/ui';
import Help from 'components/ui/Help';

interface OwnProps {
  decimal: number;
  scheduleDeposit: any;
  validScheduleDeposit: boolean;
}

interface DispatchProps {
  setScheduleDepositField: scheduleActions.TSetScheduleDepositField;
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
            isValid={scheduleDeposit.raw && validScheduleDeposit}
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
    decimal: transactionMetaSelectors.getDecimal(state),
    scheduleDeposit: scheduleSelectors.getScheduleDeposit(state),
    validScheduleDeposit: scheduleSelectors.isValidScheduleDeposit(state)
  }),
  {
    setScheduleDepositField: scheduleActions.setScheduleDepositField
  }
)(ScheduleDepositFieldClass);
