import React, { Component } from 'react';
import { setSchedulingToggle, TSetSchedulingToggle } from 'actions/transaction';
import { connect } from 'react-redux';
import translate from 'translations';
import { getCurrentSchedulingToggle, ICurrentSchedulingToggle } from 'selectors/transaction';
import { AppState } from 'reducers';

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
        <label className="switch checkbox">
          <input
            type="checkbox"
            checked={currentSchedulingToggle.value}
            onChange={this.handleOnChange}
          />
          <span className="slider round" />
        </label>
      </div>
    );
  }

  private handleOnChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const checked = ev.currentTarget.checked;
    this.props.setSchedulingToggle({ raw: checked.toString(), value: checked });
  };
}

export const SchedulingToggle = connect(
  (state: AppState) => ({
    currentSchedulingToggle: getCurrentSchedulingToggle(state)
  }),
  { setSchedulingToggle }
)(SchedulingToggleClass);
