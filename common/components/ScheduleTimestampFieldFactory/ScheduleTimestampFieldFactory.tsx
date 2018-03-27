import { Query } from 'components/renderCbs';
import { setCurrentScheduleTimestamp, TSetCurrentScheduleTimestamp } from 'actions/transaction';
import { ScheduleTimestampInputFactory } from './ScheduleTimestampInputFactory';
import React from 'react';
import { connect } from 'react-redux';
import { ICurrentScheduleTimestamp } from 'selectors/transaction';
import moment from 'moment';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

interface DispatchProps {
  setCurrentScheduleTimestamp: TSetCurrentScheduleTimestamp;
}

interface OwnProps {
  scheduleTimestamp: string | null;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

export interface CallbackProps {
  isValid: boolean;
  readOnly: boolean;
  currentScheduleTimestamp: ICurrentScheduleTimestamp;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

type Props = DispatchProps & OwnProps;

class ScheduleTimestampFieldFactoryClass extends React.Component<Props> {
  public componentDidMount() {
    const { scheduleTimestamp } = this.props;
    if (scheduleTimestamp) {
      this.props.setCurrentScheduleTimestamp(scheduleTimestamp);
    }
  }

  public render() {
    return (
      <ScheduleTimestampInputFactory
        onChange={this.setScheduleTimestamp}
        withProps={this.props.withProps}
      />
    );
  }

  private setScheduleTimestamp = (ev: any) => {
    const value = ev.currentTarget
      ? ev.currentTarget.value
      : moment(ev).format(EAC_SCHEDULING_CONFIG.SCHEDULE_TIMESTAMP_FORMAT);
    this.props.setCurrentScheduleTimestamp(value);
  };
}

const ScheduleTimestampFieldFactory = connect(null, { setCurrentScheduleTimestamp })(
  ScheduleTimestampFieldFactoryClass
);

interface DefaultScheduleTimestampFieldProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultScheduleTimestampField: React.SFC<DefaultScheduleTimestampFieldProps> = ({
  withProps
}) => (
  <Query
    params={['scheduleTimestamp']}
    withQuery={({ scheduleTimestamp }) => (
      <ScheduleTimestampFieldFactory scheduleTimestamp={scheduleTimestamp} withProps={withProps} />
    )}
  />
);

export { DefaultScheduleTimestampField as ScheduleTimestampFieldFactory };
