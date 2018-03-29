import React, { Component } from 'react';
import { setScheduleTimezone, TSetScheduleTimezone } from 'actions/transaction';
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

class ScheduleTimezoneDropDownClass extends Component<DispatchProps> {
  public render() {
    const userTimezone = moment.tz.guess();
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
                value={userTimezone}
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

  private handleOnChange = (timezone: Option<string>) => {
    if (!timezone.value) {
      throw Error('No timezone value found');
    }
    this.props.setScheduleTimezone(timezone.value);
  };
}

export const ScheduleTimezoneDropDown = connect(null, { setScheduleTimezone })(
  ScheduleTimezoneDropDownClass
);
