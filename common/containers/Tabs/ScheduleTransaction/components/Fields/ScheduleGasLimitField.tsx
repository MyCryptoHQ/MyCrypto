import { connect } from 'react-redux';
import React from 'react';
import { AppState } from 'reducers';
import { setScheduleGasLimitField, TSetScheduleGasLimitField } from 'actions/transaction';
import { translateRaw } from 'translations';
import { Input } from 'components/ui';
import { getScheduleGasLimit, isValidScheduleGasLimit } from 'selectors/transaction';
import { Wei } from 'libs/units';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

interface OwnProps {
  scheduleGasLimit: any;
  validScheduleGasLimit: boolean;
}

interface DispatchProps {
  setScheduleGasLimitField: TSetScheduleGasLimitField;
}

type Props = OwnProps & DispatchProps;

class ScheduleGasLimitFieldClass extends React.Component<Props> {
  public render() {
    const { scheduleGasLimit, validScheduleGasLimit } = this.props;

    return (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">{translateRaw('TRANS_GAS')}</div>
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
    scheduleGasLimit: getScheduleGasLimit(state),
    validScheduleGasLimit: isValidScheduleGasLimit(state)
  }),
  {
    setScheduleGasLimitField
  }
)(ScheduleGasLimitFieldClass);
