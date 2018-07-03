import React from 'react';
import { connect } from 'react-redux';

import { translateRaw } from 'translations';
import { Wei } from 'libs/units';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import { AppState } from 'features/reducers';
import { scheduleActions, scheduleSelectors } from 'features/schedule';
import { transactionNetworkSelectors } from 'features/transaction';
import { Input, InlineSpinner } from 'components/ui';

interface OwnProps {
  gasEstimationPending: boolean;
  scheduleGasLimit: any;
  validScheduleGasLimit: boolean;
}

interface DispatchProps {
  setScheduleGasLimitField: scheduleActions.TSetScheduleGasLimitField;
}

type Props = OwnProps & DispatchProps;

class ScheduleGasLimitFieldClass extends React.Component<Props> {
  public render() {
    const { gasEstimationPending, scheduleGasLimit, validScheduleGasLimit } = this.props;

    return (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">
            {translateRaw('SCHEDULE_GAS_LIMIT')}
            <div className="flex-spacer" />
            <InlineSpinner active={gasEstimationPending} text="Calculating" />
          </div>
          <Input
            isValid={scheduleGasLimit.raw && validScheduleGasLimit}
            type="number"
            placeholder={EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK.toString()}
            value={scheduleGasLimit.raw}
            onChange={this.handleGasLimitChange}
          />
        </label>
      </div>
    );
  }

  private handleGasLimitChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;

    this.props.setScheduleGasLimitField({
      raw: value,
      value: Wei(value)
    });
  };
}

export const ScheduleGasLimitField = connect(
  (state: AppState) => ({
    gasEstimationPending: transactionNetworkSelectors.getGasEstimationPending(state),
    scheduleGasLimit: scheduleSelectors.getScheduleGasLimit(state),
    validScheduleGasLimit: scheduleSelectors.isValidScheduleGasLimit(state)
  }),
  {
    setScheduleGasLimitField: scheduleActions.setScheduleGasLimitField
  }
)(ScheduleGasLimitFieldClass);
