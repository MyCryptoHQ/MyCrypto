import React, { Component } from 'react';
import { setSchedulingToggle, TSetSchedulingToggle } from 'actions/schedule';
import { connect } from 'react-redux';
import translate from 'translations';
import { getCurrentSchedulingToggle, ICurrentSchedulingToggle } from 'selectors/schedule/fields';
import { AppState } from 'reducers';
import { Toggle } from 'components/ui';

interface DispatchProps {
  setSchedulingToggle: TSetSchedulingToggle;
}

interface StateProps {
  currentSchedulingToggle: ICurrentSchedulingToggle;
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
    currentSchedulingToggle: getCurrentSchedulingToggle(state)
  }),
  { setSchedulingToggle }
)(SchedulingToggleClass);
