import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { AppState } from 'features/reducers';
import { scheduleActions, scheduleSelectors } from 'features/schedule';
import { Toggle } from 'components/ui';

interface DispatchProps {
  setSchedulingToggle: scheduleActions.TSetSchedulingToggle;
}

interface StateProps {
  currentSchedulingToggle: scheduleSelectors.ICurrentSchedulingToggle;
}

type Props = DispatchProps & StateProps;

class SchedulingToggleClass extends Component<Props> {
  public render() {
    const { currentSchedulingToggle } = this.props;

    return (
      <div className="input-group-wrapper">
        <span className="input-group-header">{translate('SCHEDULING_TOGGLE')}</span>
        <Toggle checked={currentSchedulingToggle.value} onChangeHandler={this.handleOnChange} />
      </div>
    );
  }

  private handleOnChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const checked = ev.currentTarget.checked;
    this.props.setSchedulingToggle({ value: checked });
  };
}

export const SchedulingToggle = connect(
  (state: AppState) => ({
    currentSchedulingToggle: scheduleSelectors.getCurrentSchedulingToggle(state)
  }),
  { setSchedulingToggle: scheduleActions.setSchedulingToggle }
)(SchedulingToggleClass);
