import React, { Component } from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import { AppState } from 'features/reducers';
import { scheduleActions, scheduleSelectors } from 'features/schedule';
import PrimaryToggle, { RadioOption } from 'components/ui/PrimaryToggle';

interface DispatchProps {
  setScheduleType: scheduleActions.TSetScheduleType;
}

interface StateProps {
  currentScheduleType: scheduleSelectors.ICurrentScheduleType;
}

type Props = DispatchProps & StateProps;

class ScheduleTypeClass extends Component<Props> {
  public render() {
    const { currentScheduleType } = this.props;
    const options: RadioOption[] = [
      {
        label: translate('SCHEDULE_TYPE_TIME'),
        value: 'time'
      },
      {
        label: translate('SCHEDULE_TYPE_BLOCK'),
        value: 'block'
      }
    ];

    return (
      <PrimaryToggle
        options={options}
        selectedValue={currentScheduleType.value}
        onChangeHandler={this.handleOnChange}
      />
    );
  }

  private handleOnChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.currentTarget.value;
    this.props.setScheduleType({ raw: value, value });
  };
}

export const ScheduleType = connect(
  (state: AppState) => ({
    currentScheduleType: scheduleSelectors.getCurrentScheduleType(state)
  }),
  { setScheduleType: scheduleActions.setScheduleType }
)(ScheduleTypeClass);
