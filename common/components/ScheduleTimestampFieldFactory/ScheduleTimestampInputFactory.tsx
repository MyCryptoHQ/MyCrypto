import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import {
  getCurrentScheduleTimestamp,
  isValidCurrentScheduleTimestamp,
  ICurrentScheduleTimestamp
} from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { CallbackProps } from 'components/ScheduleTimestampFieldFactory';
import { getResolvingDomain } from 'selectors/ens';
import Pikaday from 'pikaday-time';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

interface StateProps {
  currentScheduleTimestamp: ICurrentScheduleTimestamp;
  isValid: boolean;
  isResolving: boolean;
}

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = OwnProps & StateProps;

class ScheduleTimestampInputFactoryClass extends Component<Props> {
  public componentDidMount() {
    const now = new Date();

    const picker = new Pikaday({
      field: document.getElementById('datepicker'),
      format: EAC_SCHEDULING_CONFIG.SCHEDULE_TIMESTAMP_FORMAT,
      minDate: now,
      defaultDate: now,
      setDefaultDate: true,
      yearRange: [2016, 2100],
      showTime: true,
      showMinutes: true,
      showSeconds: false,
      use24hour: false,
      incrementMinuteBy: 5,
      onSelect: this.props.onChange
    });
    picker.setDate(Date.now());
  }

  public render() {
    const { currentScheduleTimestamp, onChange, isValid, withProps } = this.props;

    return (
      <div className="form-group">
        <Query
          params={['readOnly']}
          withQuery={({ readOnly }) =>
            withProps({
              currentScheduleTimestamp,
              isValid,
              onChange,
              readOnly: !!readOnly || this.props.isResolving
            })
          }
        />
      </div>
    );
  }
}

export const ScheduleTimestampInputFactory = connect((state: AppState) => ({
  currentScheduleTimestamp: getCurrentScheduleTimestamp(state),
  isResolving: getResolvingDomain(state),
  isValid: isValidCurrentScheduleTimestamp(state)
}))(ScheduleTimestampInputFactoryClass);
