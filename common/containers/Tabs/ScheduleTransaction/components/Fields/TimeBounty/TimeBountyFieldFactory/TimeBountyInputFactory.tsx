import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Query } from 'components/renderCbs';
import { AppState } from 'features/reducers';
import { scheduleSelectors } from 'features/schedule';
import { CallbackProps } from 'containers/Tabs/ScheduleTransaction/components/Fields/TimeBounty/TimeBountyFieldFactory';

interface StateProps {
  currentTimeBounty: scheduleSelectors.ICurrentTimeBounty;
  isValid: boolean;
}

interface OwnProps {
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

type Props = OwnProps & StateProps;

class TimeBountyInputFactoryClass extends Component<Props> {
  public render() {
    const { currentTimeBounty, isValid, onChange, withProps } = this.props;

    return (
      <Query
        params={['readOnly']}
        withQuery={({ readOnly }) =>
          withProps({
            currentTimeBounty,
            isValid: !!currentTimeBounty.value && isValid,
            readOnly: !!readOnly,
            onChange
          })
        }
      />
    );
  }
}

export const TimeBountyInputFactory = connect((state: AppState) => ({
  currentTimeBounty: scheduleSelectors.getCurrentTimeBounty(state),
  isValid: scheduleSelectors.isValidCurrentTimeBounty(state)
}))(TimeBountyInputFactoryClass);
