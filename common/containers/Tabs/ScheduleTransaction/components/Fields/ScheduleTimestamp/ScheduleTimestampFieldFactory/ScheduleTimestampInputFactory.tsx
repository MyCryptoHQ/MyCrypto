import React, { Component } from 'react';
import { Query } from 'components/renderCbs';
import {
  getCurrentScheduleTimestamp,
  isValidCurrentScheduleTimestamp,
  ICurrentScheduleTimestamp,
  fiveMinFromNow
} from 'selectors/transaction';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { CallbackProps } from './ScheduleTimestampFieldFactory';
import { getResolvingDomain } from 'selectors/ens';
import Pikaday from 'pikaday-time';
import moment from 'moment';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

import { setCurrentScheduleTimestamp, TSetCurrentScheduleTimestamp } from 'actions/transaction';

interface DispatchProps {
  setCurrentScheduleTimestamp: TSetCurrentScheduleTimestamp;
}

interface StateProps {
  currentScheduleTimestamp: ICurrentScheduleTimestamp;
  isValid: boolean;
  isResolving: boolean;
}

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = DispatchProps & OwnProps & StateProps;

class ScheduleTimestampInputFactoryClass extends Component<Props> {
  public componentDidMount() {
    const datetimepickerElement = document.getElementById('datepicker');
    const { currentScheduleTimestamp, onChange } = this.props;

    const picker = new Pikaday({
      field: datetimepickerElement,
      format: EAC_SCHEDULING_CONFIG.SCHEDULE_TIMESTAMP_FORMAT,
      defaultDate: fiveMinFromNow,
      setDefaultDate: true,
      yearRange: [2016, 2100],
      showTime: true,
      showMinutes: true,
      showSeconds: false,
      use24hour: true,
      incrementMinuteBy: 5,
      onSelect: onChange
    });
    picker.setMinDate(fiveMinFromNow);

    if (!currentScheduleTimestamp.value) {
      const value = moment(fiveMinFromNow).format(EAC_SCHEDULING_CONFIG.SCHEDULE_TIMESTAMP_FORMAT);
      this.props.setCurrentScheduleTimestamp(value);
    }
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

export const ScheduleTimestampInputFactory = connect(
  (state: AppState) => ({
    currentScheduleTimestamp: getCurrentScheduleTimestamp(state),
    isResolving: getResolvingDomain(state),
    isValid: isValidCurrentScheduleTimestamp(state)
  }),
  { setCurrentScheduleTimestamp }
)(ScheduleTimestampInputFactoryClass);
