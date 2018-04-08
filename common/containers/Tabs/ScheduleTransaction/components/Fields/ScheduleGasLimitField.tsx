import { connect } from 'react-redux';
import React from 'react';
import { AppState } from 'reducers';
import { setScheduleGasLimitField, TSetScheduleGasLimitField } from 'actions/schedule';
import { translateRaw } from 'translations';
import { Input, InlineSpinner } from 'components/ui';
import { getGasEstimationPending } from 'selectors/transaction';
import { Wei } from 'libs/units';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import { getScheduleGasLimit, isValidScheduleGasLimit } from 'selectors/schedule/fields';

interface OwnProps {
  gasEstimationPending: boolean;
  scheduleGasLimit: any;
  validScheduleGasLimit: boolean;
}

interface DispatchProps {
  setScheduleGasLimitField: TSetScheduleGasLimitField;
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
            className={!!scheduleGasLimit.raw && !validScheduleGasLimit ? 'invalid' : ''}
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
    gasEstimationPending: getGasEstimationPending(state),
    scheduleGasLimit: getScheduleGasLimit(state),
    validScheduleGasLimit: isValidScheduleGasLimit(state)
  }),
  {
    setScheduleGasLimitField
  }
)(ScheduleGasLimitFieldClass);
