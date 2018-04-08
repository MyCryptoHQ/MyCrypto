import React, { Component } from 'react';
import { setScheduleTimezone, TSetScheduleTimezone } from 'actions/schedule';
import { getCurrentScheduleTimezone, ICurrentScheduleTimezone } from 'selectors/schedule';
import { AppState } from 'reducers';
import { Query } from 'components/renderCbs';
import { connect } from 'react-redux';
import { Option } from 'react-select';
import { Dropdown } from 'components/ui';
import moment from 'moment';
import 'moment-timezone';
import translate from 'translations';

interface DispatchProps {
  setScheduleTimezone: TSetScheduleTimezone;
}

interface StateProps {
  currentScheduleTimezone: ICurrentScheduleTimezone;
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
    currentScheduleTimezone: getCurrentScheduleTimezone(state)
  }),
  { setScheduleTimezone }
)(ScheduleTimezoneDropDownClass);
