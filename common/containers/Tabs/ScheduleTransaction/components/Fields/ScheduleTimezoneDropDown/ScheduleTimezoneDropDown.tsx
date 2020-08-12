import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Option } from 'react-select';
import moment from 'moment-timezone';

import translate from 'translations';
import { scheduleActions, scheduleSelectors } from 'features/schedule';
import { AppState } from 'features/reducers';
import { Query } from 'components/renderCbs';
import { Dropdown } from 'components/ui';

interface DispatchProps {
  setScheduleTimezone: scheduleActions.TSetScheduleTimezone;
}

interface StateProps {
  currentScheduleTimezone: scheduleSelectors.ICurrentScheduleTimezone;
}

type Props = DispatchProps & StateProps;

class ScheduleTimezoneDropDownClass extends Component<Props> {
  public render() {
    const { currentScheduleTimezone } = this.props;
    const allTimezones = moment.tz.names();

    return (
      <div className="input-group-wrapper">
        <label className="input-group">
          <div className="input-group-header">{translate('SCHEDULE_TIMEZONE')}</div>
          <Query
            params={['readOnly']}
            withQuery={({ readOnly }) => (
              <Dropdown
                options={allTimezones}
                value={currentScheduleTimezone.value}
                onChange={this.handleOnChange}
                clearable={false}
                searchable={true}
                disabled={!!readOnly}
              />
            )}
          />
        </label>
      </div>
    );
  }

  private handleOnChange = (timezone: Option<string> | null) => {
    if (!timezone) {
      return;
    }

    if (!timezone.value) {
      throw Error('No timezone value found');
    }

    this.props.setScheduleTimezone({
      value: timezone.value,
      raw: timezone.value
    });
  };
}

export const ScheduleTimezoneDropDown = connect(
  (state: AppState) => ({
    currentScheduleTimezone: scheduleSelectors.getCurrentScheduleTimezone(state)
  }),
  { setScheduleTimezone: scheduleActions.setScheduleTimezone }
)(ScheduleTimezoneDropDownClass);
